// spec: specs/002-candidate-extraction.md § Internal Design / Function Responsibilities
// ソート戦略: 関係性スコア(第1) → 業種ボーナス(第2) → ID昇順(第3)
// これにより「友人/元同僚」は業種問わず常に上位になる（spec Unit Test Condition 1）

import type { CandidateRecord, MatchResult, RankingState } from "../types/candidates";
import type { HandoffDataset } from "../types/trip-conditions";
import { fetchCandidates } from "../data/candidateDummyDB";
import {
  generateReason,
  generateNextAction,
  generatePitchMessage,
} from "./reasonGenerator";

// ── 関係性ベーススコア（spec 002 § Internal Design 準拠）──────
const RELATIONSHIP_SCORE: Record<CandidateRecord["relationship"], number> = {
  "友人・元同僚": 50,
  "既存取引先": 45,
  "過去面識あり": 40,
  "要新規開拓": 35,
};

// ── 業種ボーナス（第2ソートキー: 同関係性内での差別化）────────
const PURPOSE_INDUSTRY_BONUS: Record<
  HandoffDataset["purposeType"],
  (industry: string) => number
> = {
  STARTUP_FUNDING: (ind) =>
    ind.includes("VC") || ind.includes("投資") ? 10 : 0,
  SAAS_SALES: (ind) =>
    ind.includes("SaaS") || ind.includes("法人営業") ? 10 : 0,
  DX_ALLIANCE: (ind) =>
    ind.includes("DX") || ind.includes("製造") ? 10 : 0,
  CUSTOM: () => 5,
};

// ── rankCandidates ────────────────────────────────────────────

/**
 * fetchFn を DI 可能にすることでテストで fetchCandidates をモック替えできる。
 */
export async function rankCandidates(
  handoffDataset: HandoffDataset,
  fetchFn: () => Promise<CandidateRecord[]> = fetchCandidates
): Promise<RankingState> {
  let candidates: CandidateRecord[];
  try {
    candidates = await fetchFn();
  } catch {
    return {
      status: "error",
      guidance: "候補者データの取得に失敗しました。しばらく経ってから再試行してください。",
    };
  }

  if (candidates.length === 0) {
    return {
      status: "empty",
      guidance: "条件に合う候補者が見つかりませんでした。出張条件を変更してお試しください。",
    };
  }

  const scored = candidates.map((c) => {
    const relScore = RELATIONSHIP_SCORE[c.relationship];
    const bonus = PURPOSE_INDUSTRY_BONUS[handoffDataset.purposeType](c.industry);
    return { candidate: c, relScore, bonus, total: relScore + bonus };
  });

  // ソート: 関係性スコア降順(第1) → 業種ボーナス降順(第2) → ID昇順(第3)
  scored.sort((a, b) => {
    if (b.relScore !== a.relScore) return b.relScore - a.relScore;
    if (b.bonus !== a.bonus) return b.bonus - a.bonus;
    return a.candidate.id.localeCompare(b.candidate.id);
  });

  const results: MatchResult[] = scored.map(({ candidate, total }, index) => ({
    candidateId: candidate.id,
    priority: index + 1,
    matchingScore: total,
    matchedAttribute: candidate.strength,
    recommendationReason: generateReason(candidate, handoffDataset.purposeType),
    nextAction: generateNextAction(candidate, handoffDataset.purposeType),
    pitchMessage: generatePitchMessage(candidate, handoffDataset.purposeType),
  }));

  return { status: "success", results };
}
