// spec: specs/001-trip-condition-input.md § ① 出張先ドロップダウン

export const JAPAN_DESTINATIONS = [
  "東京(渋谷・恵比寿)",
  "東京(丸の内・大手町)",
  "大阪",
  "愛知",
  "福岡",
  "京都",
  "兵庫",
  "宮城",
  "北海道",
  "沖縄",
] as const;

export type JapanDestination = (typeof JAPAN_DESTINATIONS)[number];
