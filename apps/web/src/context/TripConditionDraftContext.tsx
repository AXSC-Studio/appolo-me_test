// spec: specs/001-trip-condition-input.md § Internal Design

import { createContext, useContext, type ReactNode } from "react";
import { useTripConditionDraft } from "../hooks/useTripConditionDraft";
import type { PurposeType, TripDate } from "../types/trip-conditions";

type TripConditionDraftContextValue = ReturnType<typeof useTripConditionDraft>;

const TripConditionDraftContext =
  createContext<TripConditionDraftContextValue | null>(null);

export function TripConditionDraftProvider({
  children,
}: {
  children: ReactNode;
}) {
  const value = useTripConditionDraft();
  return (
    <TripConditionDraftContext.Provider value={value}>
      {children}
    </TripConditionDraftContext.Provider>
  );
}

export function useTripConditionDraftContext(): TripConditionDraftContextValue {
  const ctx = useContext(TripConditionDraftContext);
  if (!ctx)
    throw new Error(
      "useTripConditionDraftContext は TripConditionDraftProvider の内側で使用してください"
    );
  return ctx;
}
