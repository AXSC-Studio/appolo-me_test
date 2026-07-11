// TDD GREEN — Issue #9: candidateDummyDB
// spec: specs/002-candidate-extraction.md § Internal Design

import { describe, it, expect } from "vitest";
import {
  DUMMY_CANDIDATES,
  fetchCandidates,
} from "../apps/web/src/data/candidateDummyDB";
import type { Relationship } from "../apps/web/src/types/candidates";

describe("candidateDummyDB — DUMMY_CANDIDATES", () => {
  it("8名のデータが存在する（Vision Install: 3名以上）", () => {
    expect(DUMMY_CANDIDATES).toHaveLength(8);
  });

  it("全候補者が必須フィールドを持つ", () => {
    for (const c of DUMMY_CANDIDATES) {
      expect(c.id).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(c.company).toBeTruthy();
      expect(c.role).toBeTruthy();
      expect(c.industry).toBeTruthy();
      expect(c.relationship).toBeTruthy();
      expect(c.strength).toBeTruthy();
    }
  });

  it("全4種類のRelationshipが含まれる", () => {
    const rels = new Set(DUMMY_CANDIDATES.map((c) => c.relationship));
    const expected: Relationship[] = [
      "友人・元同僚",
      "既存取引先",
      "過去面識あり",
      "要新規開拓",
    ];
    for (const r of expected) {
      expect(rels.has(r)).toBe(true);
    }
  });

  it("IDはユニーク", () => {
    const ids = DUMMY_CANDIDATES.map((c) => c.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

describe("candidateDummyDB — fetchCandidates", () => {
  it("Promiseを返す", () => {
    expect(fetchCandidates()).toBeInstanceOf(Promise);
  });

  it("8名の CandidateRecord[] を解決する", async () => {
    const result = await fetchCandidates();
    expect(result).toHaveLength(8);
    expect(result[0].id).toBe("c001");
  });

  it("複数回呼び出しても同じデータを返す", async () => {
    const [r1, r2] = await Promise.all([fetchCandidates(), fetchCandidates()]);
    expect(r1).toEqual(r2);
  });
});
