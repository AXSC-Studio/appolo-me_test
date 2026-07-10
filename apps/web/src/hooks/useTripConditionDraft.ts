// spec: specs/001-trip-condition-input.md § Internal Design / Function Responsibilities
// useReducer実装。reducer / validateDraft / buildHandoffDataset は純粋関数なので
// React なしで vitest から直接テスト可能。

import { useReducer } from "react";
import type {
  TripConditionDraft,
  ValidationErrorKey,
  HandoffDataset,
  PurposeType,
  TripDate,
} from "../types/trip-conditions";

// ── 初期状態 ────────────────────────────────────────────────
export const initialDraft: TripConditionDraft = {
  toLocation: "",
  purposeType: null,
  purposeText: "",
  startDate: null,
  endDate: null,
  validationErrors: [],
  formStatus: "idle",
  handoffDataset: null,
};

// ── Action ──────────────────────────────────────────────────
type Action =
  | { type: "SET_LOCATION"; payload: string }
  | { type: "SET_PURPOSE_TYPE"; payload: PurposeType }
  | { type: "SET_PURPOSE_TEXT"; payload: string }
  | { type: "SET_START_DATE"; payload: TripDate }
  | { type: "SET_END_DATE"; payload: TripDate }
  | { type: "CONFIRM" };

// ── 純粋関数群 ──────────────────────────────────────────────

/** バリデーション。ValidationErrorKey[] を返す（空配列 = エラーなし）*/
export function validateDraft(draft: TripConditionDraft): ValidationErrorKey[] {
  const errors: ValidationErrorKey[] = [];
  if (!draft.toLocation) errors.push("toLocation");
  if (!draft.purposeType) errors.push("purposeType");
  if (!draft.startDate) errors.push("startDate");
  if (!draft.endDate) errors.push("endDate");
  if (
    draft.startDate &&
    draft.endDate &&
    (draft.startDate.month > draft.endDate.month ||
      (draft.startDate.month === draft.endDate.month &&
        draft.startDate.day > draft.endDate.day))
  ) {
    errors.push("dateOrder");
  }
  return errors;
}

/** 確定済みデータセットを生成。必須項目が欠落している場合は null を返す */
export function buildHandoffDataset(
  draft: TripConditionDraft
): HandoffDataset | null {
  if (
    !draft.toLocation ||
    !draft.purposeType ||
    !draft.startDate ||
    !draft.endDate
  ) {
    return null;
  }
  return {
    toLocation: draft.toLocation,
    purposeType: draft.purposeType,
    purposeText: draft.purposeText,
    startDate: draft.startDate,
    endDate: draft.endDate,
  };
}

/** 純粋な reducer */
export function reducer(
  state: TripConditionDraft,
  action: Action
): TripConditionDraft {
  switch (action.type) {
    case "SET_LOCATION":
      return { ...state, toLocation: action.payload, formStatus: "editing" };
    case "SET_PURPOSE_TYPE":
      return { ...state, purposeType: action.payload, formStatus: "editing" };
    case "SET_PURPOSE_TEXT":
      return { ...state, purposeText: action.payload, formStatus: "editing" };
    case "SET_START_DATE":
      return { ...state, startDate: action.payload, formStatus: "editing" };
    case "SET_END_DATE":
      return { ...state, endDate: action.payload, formStatus: "editing" };
    case "CONFIRM": {
      const errors = validateDraft(state);
      if (errors.length > 0) {
        return { ...state, formStatus: "error", validationErrors: errors };
      }
      const handoffDataset = buildHandoffDataset(state);
      return {
        ...state,
        formStatus: "confirmed",
        validationErrors: [],
        handoffDataset,
      };
    }
  }
}

// ── hook ────────────────────────────────────────────────────
export function useTripConditionDraft() {
  const [draft, dispatch] = useReducer(reducer, initialDraft);

  return {
    draft,
    setToLocation: (v: string) =>
      dispatch({ type: "SET_LOCATION", payload: v }),
    setPurposeType: (v: PurposeType) =>
      dispatch({ type: "SET_PURPOSE_TYPE", payload: v }),
    setPurposeText: (v: string) =>
      dispatch({ type: "SET_PURPOSE_TEXT", payload: v }),
    setStartDate: (v: TripDate) =>
      dispatch({ type: "SET_START_DATE", payload: v }),
    setEndDate: (v: TripDate) =>
      dispatch({ type: "SET_END_DATE", payload: v }),
    confirm: () => dispatch({ type: "CONFIRM" }),
  };
}
