// TDD GREEN — Issue #10: matchingEngine + reasonGenerator
// spec: specs/002-candidate-extraction.md § Unit Test Conditions 1-5

import { describe, it, expect, vi } from "vitest";
import { rankCandidates } from "../apps/web/src/engine/matchingEngine";
import {
  generateReason,
  generateNextAction,
  generatePitchMessage,
} from "../apps/web/src/engine/reasonGenerator";
import type { CandidateRecord } from "../apps/web/src/types/candidates";
import type { HandoffDataset } from "../apps/web/src/types/trip-conditions";

// ── フィクスチャ ──────────────────────────────────────────────

const baseHandoff: HandoffDataset = {
  toLocation: "東京(渋谷・恵比寿)",
  purposeType: "STARTUP_FUNDING",
  purposeText: "",
  startDate: { month: 7, day: 20 },
  endDate: { month: 7, day: 22 },
};

const friendCandidate: CandidateRecord = {
  id: "c001",
  name: "佐藤 健一",
  company: "テックスタート",
  role: "CEO",
  industry: "IT・SaaS",
  relationship: "友人・元同僚",
  lastContact: "2026-05-01",
  strength: "SaaS立ち上げ経験",
};

const vcCandidate: CandidateRecord = {
  id: "c002",
  name: "田中 美咲",
  company: "グロースキャピタル",
  role: "Partner",
  industry: "VC・投資",
  relationship: "既存取引先",
  lastContact: "2026-06-01",
  strength: "シードVC",
};

const newCandidate: CandidateRecord = {
  id: "c003",
  name: "山本 大輔",
  company: "DXソリューションズ",
  role: "部長",
  industry: "製造業DX",
  relationship: "要新規開拓",
  lastContact: "なし",
  strength: "DX推進",
};

// ── rankCandidates テスト ─────────────────────────────────────

describe("matchingEngine — rankCandidates", () => {
  it("STARTUP_FUNDING: 友人/元同僚の候補者がpriority=1になる", async () => {
    const mockFetch = vi.fn().mockResolvedValue([
      friendCandidate,
      vcCandidate,
      newCandidate,
    ]);
    const result = await rankCandidates(baseHandoff, mockFetch);
    expect(result.status).toBe("success");
    if (result.status === "success") {
      expect(result.results[0].candidateId).toBe("c001"); // 友人・元同僚
      expect(result.results[0].priority).toBe(1);
    }
  });

  it("同スコアの候補者はID昇順でソートされる", async () => {
    // 全員 relationship="要新規開拓"（同ベーススコア35）、industry=合わせない
    const candidates: CandidateRecord[] = [
      { ...newCandidate, id: "c030", relationship: "要新規開拓", industry: "その他" },
      { ...newCandidate, id: "c010", relationship: "要新規開拓", industry: "その他" },
      { ...newCandidate, id: "c020", relationship: "要新規開拓", industry: "その他" },
    ];
    const mockFetch = vi.fn().mockResolvedValue(candidates);
    const result = await rankCandidates(baseHandoff, mockFetch);
    expect(result.status).toBe("success");
    if (result.status === "success") {
      expect(result.results.map((r) => r.candidateId)).toEqual([
        "c010",
        "c020",
        "c030",
      ]);
    }
  });

  it("fetchCandidates 失敗時 → status='error'", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("network error"));
    const result = await rankCandidates(baseHandoff, mockFetch);
    expect(result.status).toBe("error");
  });

  it("候補者0件 → status='empty'", async () => {
    const mockFetch = vi.fn().mockResolvedValue([]);
    const result = await rankCandidates(baseHandoff, mockFetch);
    expect(result.status).toBe("empty");
  });

  it("全MatchResultフィールドが非空文字列", async () => {
    const mockFetch = vi.fn().mockResolvedValue([friendCandidate]);
    const result = await rankCandidates(baseHandoff, mockFetch);
    expect(result.status).toBe("success");
    if (result.status === "success") {
      const r = result.results[0];
      expect(r.candidateId).toBeTruthy();
      expect(r.matchedAttribute).toBeTruthy();
      expect(r.recommendationReason).toBeTruthy();
      expect(r.nextAction).toBeTruthy();
      expect(r.pitchMessage).toBeTruthy();
    }
  });
});

// ── reasonGenerator テスト ────────────────────────────────────

describe("reasonGenerator — generateReason", () => {
  it("STARTUP_FUNDING: 生成文が候補者名を含む", () => {
    const reason = generateReason(friendCandidate, "STARTUP_FUNDING");
    expect(reason).toContain("佐藤 健一");
  });

  it("全purposeTypeで空文字列にならない", () => {
    const types = ["STARTUP_FUNDING", "SAAS_SALES", "DX_ALLIANCE", "CUSTOM"] as const;
    for (const t of types) {
      expect(generateReason(friendCandidate, t)).toBeTruthy();
    }
  });
});

describe("reasonGenerator — generateNextAction + generatePitchMessage", () => {
  it("generateNextAction: 友人・元同僚は直接連絡を推奨する文言", () => {
    const action = generateNextAction(friendCandidate, "STARTUP_FUNDING");
    expect(action).toBeTruthy();
    expect(action.length).toBeGreaterThan(5);
  });

  it("generatePitchMessage: 候補者名を含む打診テキストが生成される", () => {
    const msg = generatePitchMessage(friendCandidate, "STARTUP_FUNDING");
    expect(msg).toContain("佐藤 健一");
  });
});
