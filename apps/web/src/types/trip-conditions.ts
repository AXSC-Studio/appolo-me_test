// spec: specs/001-trip-condition-input.md § Data/State

export type PurposeType =
  | "STARTUP_FUNDING"
  | "SAAS_SALES"
  | "DX_ALLIANCE"
  | "CUSTOM";

export type TripDate = {
  month: number;
  day: number;
};

/** 型安全なunion型（string[]より厳格・exhaustive switch可能） */
export type ValidationErrorKey =
  | "toLocation"
  | "purposeType"
  | "startDate"
  | "endDate"
  | "dateOrder";

export type FormStatus = "idle" | "editing" | "error" | "confirmed";

export type HandoffDataset = {
  toLocation: string;
  purposeType: PurposeType;
  purposeText: string;
  startDate: TripDate;
  endDate: TripDate;
};

export type TripConditionDraft = {
  toLocation: string;
  purposeType: PurposeType | null;
  purposeText: string;
  startDate: TripDate | null;
  endDate: TripDate | null;
  validationErrors: ValidationErrorKey[];
  formStatus: FormStatus;
  handoffDataset: HandoffDataset | null;
};
