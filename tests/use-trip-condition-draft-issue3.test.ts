// TDD RED phase — Issue #3: useTripConditionDraft hook
// spec: specs/001-trip-condition-input.md § Unit Test Conditions

import { describe, it, expect } from "vitest";

// RED: これらのimportは実装前は失敗する
import {
  reducer,
  validateDraft,
  buildHandoffDataset,
  initialDraft,
} from "../apps/web/src/hooks/useTripConditionDraft";

import type { TripConditionDraft } from "../apps/web/src/types/trip-conditions";

// ── テスト用ヘルパー ──────────────────────────────────
const FULL_DRAFT: TripConditionDraft = {
  toLocation: "東京(渋谷・恵比寿)",
  purposeType: "STARTUP_FUNDING",
  purposeText: "",
  startDate: { month: 7, day: 10 },
  endDate: { month: 7, day: 12 },
  validationErrors: [],
  formStatus: "editing",
  handoffDataset: null,
};

// ── validateDraft ─────────────────────────────────────
describe("validateDraft", () => {
  it("全必須項目入力済み → バリデーションエラーなし", () => {
    const errors = validateDraft(FULL_DRAFT);
    expect(errors).toHaveLength(0);
  });

  it("toLocation が空 → 'toLocation' エラーを含む", () => {
    const errors = validateDraft({ ...FULL_DRAFT, toLocation: "" });
    expect(errors).toContain("toLocation");
  });

  it("purposeType が null → 'purposeType' エラーを含む", () => {
    const errors = validateDraft({ ...FULL_DRAFT, purposeType: null });
    expect(errors).toContain("purposeType");
  });

  it("startDate が null → 'startDate' エラーを含む", () => {
    const errors = validateDraft({ ...FULL_DRAFT, startDate: null });
    expect(errors).toContain("startDate");
  });

  it("endDate が null → 'endDate' エラーを含む", () => {
    const errors = validateDraft({ ...FULL_DRAFT, endDate: null });
    expect(errors).toContain("endDate");
  });

  it("複数欠落 → 全て含まれる", () => {
    const errors = validateDraft({
      ...FULL_DRAFT,
      toLocation: "",
      purposeType: null,
    });
    expect(errors).toContain("toLocation");
    expect(errors).toContain("purposeType");
  });

  it("startDate > endDate → 'dateOrder' エラーを含む", () => {
    const errors = validateDraft({
      ...FULL_DRAFT,
      startDate: { month: 7, day: 15 },
      endDate: { month: 7, day: 10 },
    });
    expect(errors).toContain("dateOrder");
  });
});

// ── reducer ──────────────────────────────────────────
describe("reducer", () => {
  it("SET_LOCATION → toLocation が更新される", () => {
    const next = reducer(initialDraft, { type: "SET_LOCATION", payload: "大阪" });
    expect(next.toLocation).toBe("大阪");
  });

  it("SET_PURPOSE_TYPE → purposeType が更新される", () => {
    const next = reducer(initialDraft, {
      type: "SET_PURPOSE_TYPE",
      payload: "SAAS_SALES",
    });
    expect(next.purposeType).toBe("SAAS_SALES");
  });

  it("全必須項目入力後 CONFIRM → formStatus が 'confirmed' になる", () => {
    const next = reducer(FULL_DRAFT, { type: "CONFIRM" });
    expect(next.formStatus).toBe("confirmed");
  });

  it("全必須項目入力後 CONFIRM → handoffDataset が生成される", () => {
    const next = reducer(FULL_DRAFT, { type: "CONFIRM" });
    expect(next.handoffDataset).not.toBeNull();
    expect(next.handoffDataset?.toLocation).toBe("東京(渋谷・恵比寿)");
  });

  it("必須項目欠落で CONFIRM → formStatus が 'error' になる", () => {
    const draft: TripConditionDraft = { ...FULL_DRAFT, toLocation: "" };
    const next = reducer(draft, { type: "CONFIRM" });
    expect(next.formStatus).toBe("error");
  });

  it("必須項目欠落で CONFIRM → validationErrors に該当キーが含まれる", () => {
    const draft: TripConditionDraft = { ...FULL_DRAFT, toLocation: "" };
    const next = reducer(draft, { type: "CONFIRM" });
    expect(next.validationErrors).toContain("toLocation");
  });

  it("reducer は純粋関数 — 同じ state + action → 同じ結果", () => {
    const result1 = reducer(FULL_DRAFT, { type: "CONFIRM" });
    const result2 = reducer(FULL_DRAFT, { type: "CONFIRM" });
    expect(result1).toEqual(result2);
  });
});

// ── buildHandoffDataset ───────────────────────────────
describe("buildHandoffDataset", () => {
  it("全必須項目揃い → HandoffDataset を返す", () => {
    const dataset = buildHandoffDataset(FULL_DRAFT);
    expect(dataset).not.toBeNull();
    expect(dataset?.purposeType).toBe("STARTUP_FUNDING");
    expect(dataset?.startDate).toEqual({ month: 7, day: 10 });
  });

  it("purposeType=null → null を返す", () => {
    const dataset = buildHandoffDataset({ ...FULL_DRAFT, purposeType: null });
    expect(dataset).toBeNull();
  });
});
