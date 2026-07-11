// spec: specs/002-candidate-extraction.md § Data / API Contract
// TDD: TypeScript strict モードでエラーなし / discriminated union

// ── CandidateRecord ──────────────────────────────────────────
export type Relationship =
  | "友人・元同僚"
  | "既存取引先"
  | "過去面識あり"
  | "要新規開拓";

export type CandidateRecord = {
  id: string;
  name: string;
  company: string;
  role: string;
  industry: string;
  relationship: Relationship;
  lastContact: string; // ISO date string or "なし"
  strength: string;    // 強みの一言メモ
};

// ── MatchResult ──────────────────────────────────────────────
export type MatchResult = {
  candidateId: string;
  priority: number;
  matchingScore: number;        // 0–100
  matchedAttribute: string;
  recommendationReason: string;
  nextAction: string;
  pitchMessage: string;
};

// ── RankingState（discriminated union） ──────────────────────
export type RankingState =
  | { status: "success"; results: MatchResult[] }
  | { status: "empty"; guidance: string }
  | { status: "error"; guidance: string };
