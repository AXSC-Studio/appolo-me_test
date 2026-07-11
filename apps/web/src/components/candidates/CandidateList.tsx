// spec: specs/002-candidate-extraction.md § Screen
// CandidateContext から状態を受け取り、各状態に応じたUIを表示する

import { useState } from "react";
import { useCandidateContext } from "../../context/CandidateContext";
import { DUMMY_CANDIDATES } from "../../data/candidateDummyDB";
import type { HandoffDataset } from "../../types/trip-conditions";
import { MatchingProgress } from "./MatchingProgress";
import { EmptyState } from "./EmptyState";
import { SocialShareBlock } from "./SocialShareBlock";
import { CandidateCard } from "./CandidateCard";

type Props = { handoffDataset: HandoffDataset | null };

export function CandidateList({ handoffDataset }: Props) {
  const { rankingState, isLoading } = useCandidateContext();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // handoffDataset が null → まだ入力されていない
  if (!handoffDataset) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
        <p className="text-sm font-extrabold text-brand-dark">
          出張条件を入力してください
        </p>
        <p className="text-xs text-gray-400">
          出張先・目的・日程を入力すると、AIが最適な候補者をマッチングします
        </p>
      </div>
    );
  }

  if (isLoading) return <MatchingProgress />;

  if (!rankingState) return null;

  if (rankingState.status === "empty" || rankingState.status === "error") {
    return <EmptyState guidance={rankingState.guidance} />;
  }

  // success
  const { results } = rankingState;
  const candidateMap = new Map(DUMMY_CANDIDATES.map((c) => [c.id, c]));

  return (
    <div className="space-y-3">
      {results.map((result) => {
        const candidate = candidateMap.get(result.candidateId);
        if (!candidate) return null;
        return (
          <CandidateCard
            key={result.candidateId}
            result={result}
            candidateName={candidate.name}
            company={candidate.company}
            role={candidate.role}
            isExpanded={expandedId === result.candidateId}
            onToggle={() =>
              setExpandedId(
                expandedId === result.candidateId ? null : result.candidateId
              )
            }
          />
        );
      })}
      <SocialShareBlock handoffDataset={handoffDataset} />
    </div>
  );
}
