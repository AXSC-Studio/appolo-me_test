// TDD RED — Issue #4: TripConditionDraftContext
// spec: specs/001-trip-condition-input.md § Internal Design

import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { TripConditionDraftProvider, useTripConditionDraftContext } from "../apps/web/src/context/TripConditionDraftContext";

describe("TripConditionDraftContext", () => {
  it("Provider外で使用するとエラーをthrowする", () => {
    expect(() => {
      renderHook(() => useTripConditionDraftContext());
    }).toThrow();
  });

  it("Provider内では draft が取得できる", () => {
    const { result } = renderHook(() => useTripConditionDraftContext(), {
      wrapper: TripConditionDraftProvider,
    });
    expect(result.current.draft).toBeDefined();
    expect(result.current.draft.formStatus).toBe("idle");
  });

  it("Provider内では setToLocation が利用可能", () => {
    const { result } = renderHook(() => useTripConditionDraftContext(), {
      wrapper: TripConditionDraftProvider,
    });
    expect(result.current.setToLocation).toBeInstanceOf(Function);
  });

  it("Provider内では confirm が利用可能", () => {
    const { result } = renderHook(() => useTripConditionDraftContext(), {
      wrapper: TripConditionDraftProvider,
    });
    expect(result.current.confirm).toBeInstanceOf(Function);
  });
});
