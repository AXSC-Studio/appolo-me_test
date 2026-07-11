// spec: specs/002-candidate-extraction.md § Data / State (CandidateContext)
// handoffDataset変化を監視し、2000ms後にrankCandidatesを実行する。

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { RankingState, MatchResult } from "../types/candidates";
import type { HandoffDataset } from "../types/trip-conditions";
import { rankCandidates } from "../engine/matchingEngine";

type CandidateContextValue = {
  rankingState: RankingState | null;
  isLoading: boolean;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  getCandidate: (id: string) => MatchResult | undefined;
};

const CandidateContext = createContext<CandidateContextValue | null>(null);

type Props = {
  handoffDataset: HandoffDataset | null;
  children: ReactNode;
};

export function CandidateProvider({ handoffDataset, children }: Props) {
  const [rankingState, setRankingState] = useState<RankingState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!handoffDataset) return;

    setIsLoading(true);
    setRankingState(null);

    const timer = setTimeout(async () => {
      const result = await rankCandidates(handoffDataset);
      setRankingState(result);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [handoffDataset]);

  const getCandidate = useCallback(
    (id: string): MatchResult | undefined => {
      if (!rankingState || rankingState.status !== "success") return undefined;
      return rankingState.results.find((r) => r.candidateId === id);
    },
    [rankingState]
  );

  return (
    <CandidateContext.Provider
      value={{ rankingState, isLoading, selectedId, setSelectedId, getCandidate }}
    >
      {children}
    </CandidateContext.Provider>
  );
}

export function useCandidateContext(): CandidateContextValue {
  const ctx = useContext(CandidateContext);
  if (!ctx)
    throw new Error(
      "useCandidateContext は CandidateProvider の内側で使用してください"
    );
  return ctx;
}
