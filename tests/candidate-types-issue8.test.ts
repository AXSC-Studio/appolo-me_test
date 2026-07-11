// TDD GREEN — Issue #8: 002型定義
// spec: specs/002-candidate-extraction.md § Data / API Contract
// TypeScript discriminated union の exhaustive check をランタイムで検証

import { describe, it, expect } from "vitest";
import type {
  CandidateRecord,
  MatchResult,
  RankingState,
  Relationship,
} from "../apps/web/src/types/candidates";

// ── ヘルパー: RankingState を受け取りラベルを返す（exhaustive switch） ──
function describeRankingState(state: RankingState): string {
  switch (state.status) {
    case "success":
      return `success: ${state.results.length}件`;
    case "empty":
      return `empty: ${state.guidance}`;
    case "error":
      return `error: ${state.guidance}`;
  }
}

describe("002型定義 — CandidateRecord", () => {
  it("必須フィールドを持つオブジェクトが型エラーなく構築できる", () => {
    const record: CandidateRecord = {
      id: "c001",
      name: "田中 太郎",
      company: "株式会社AXSC",
      role: "代表取締役",
      industry: "IT・SaaS",
      relationship: "友人・元同僚",
      lastContact: "2026-03-15",
      strength: "SaaS営業に強い",
    };
    expect(record.id).toBe("c001");
    expect(record.relationship).toBe("友人・元同僚");
  });

  it("Relationship union型の全値が受け入れられる", () => {
    const rels: Relationship[] = [
      "友人・元同僚",
      "既存取引先",
      "過去面識あり",
      "要新規開拓",
    ];
    expect(rels).toHaveLength(4);
  });
});

describe("002型定義 — MatchResult", () => {
  it("全必須フィールドを持つMatchResultが構築できる", () => {
    const result: MatchResult = {
      candidateId: "c001",
      priority: 1,
      matchingScore: 85,
      matchedAttribute: "SaaS営業経験",
      recommendationReason: "SaaS製品の地方営業に強みを持つ",
      nextAction: "LinkedInで接続リクエストを送る",
      pitchMessage: "お世話になっております。出張のご連絡です...",
    };
    expect(result.priority).toBe(1);
    expect(result.matchingScore).toBeGreaterThanOrEqual(0);
    expect(result.matchingScore).toBeLessThanOrEqual(100);
  });
});

describe("002型定義 — RankingState discriminated union", () => {
  it("status=success のとき results にアクセスできる", () => {
    const state: RankingState = { status: "success", results: [] };
    expect(describeRankingState(state)).toBe("success: 0件");
  });

  it("status=empty のとき guidance にアクセスできる", () => {
    const state: RankingState = {
      status: "empty",
      guidance: "条件に合う候補者が見つかりませんでした。",
    };
    expect(describeRankingState(state)).toContain("empty:");
  });

  it("status=error のとき guidance にアクセスできる", () => {
    const state: RankingState = {
      status: "error",
      guidance: "マッチング処理に失敗しました。",
    };
    expect(describeRankingState(state)).toContain("error:");
  });
});
