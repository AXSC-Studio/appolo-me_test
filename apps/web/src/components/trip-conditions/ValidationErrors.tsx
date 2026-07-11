// spec: specs/001-trip-condition-input.md § エラー表示
// isStillMissing: 確定後も未入力の場合のみメッセージを表示する

import type { ValidationErrorKey, TripConditionDraft } from "../../types/trip-conditions";

const ERROR_MESSAGES: Record<ValidationErrorKey, string> = {
  toLocation: "出張先を選択してください",
  purposeType: "出張目的を選択してください",
  startDate: "出発日を選択してください",
  endDate: "帰着日を選択してください",
  dateOrder: "帰着日は出発日より後の日付を選択してください",
};

function isStillMissing(key: ValidationErrorKey, draft: TripConditionDraft): boolean {
  switch (key) {
    case "toLocation": return !draft.toLocation;
    case "purposeType": return !draft.purposeType;
    case "startDate": return !draft.startDate;
    case "endDate": return !draft.endDate;
    case "dateOrder":
      if (!draft.startDate || !draft.endDate) return false;
      return (
        draft.startDate.month > draft.endDate.month ||
        (draft.startDate.month === draft.endDate.month &&
          draft.startDate.day > draft.endDate.day)
      );
  }
}

type Props = { errors: ValidationErrorKey[]; draft: TripConditionDraft };

export function ValidationErrors({ errors, draft }: Props) {
  const active = errors.filter((key) => isStillMissing(key, draft));
  if (active.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-100 rounded-xl p-3 space-y-1">
      {active.map((key) => (
        <p key={key} className="text-xs text-red-500 font-medium">
          • {ERROR_MESSAGES[key]}
        </p>
      ))}
    </div>
  );
}
