# 001-trip-condition-input

## Purpose
出張中に誰へ先に会うべきかをAIが判断するための前提情報（出張目的・滞在予定・会いたい相手の条件）をホストから受け取る。後続の候補者抽出（002）の入力データを成立させる最上流機能群。

## User Flow
1. ホストがサイトにアクセスする（ヒーローセクションとフォームカードが表示される）
2. 出張先をドロップダウンから選択する（japanDestinationsリスト）
3. 出張目的を選択グリッドから選ぶ（STARTUP_FUNDING / SAAS_SALES / DX_ALLIANCE / CUSTOM）
4. カレンダーウィジェットで出張期間の開始日・終了日を選択する
5. 入力内容を確定し、AIマッチング処理（ローディング演出）を経て候補者表示（002）へ遷移する
6. 必須項目が未選択の場合はエラーが表示され、入力に戻る

## Screen / External Design

### レイアウト
- ヘッダー: `appolo.me` ロゴ（左）+ ハンバーガーメニューボタン（右）。sticky
- ヒーローセクション: 「出張予定を公開して、アポイントを獲得」見出し + 補足テキスト
- フォームカード: 白背景・角丸・shadowの1枚カードに下記4要素を縦並び
- BottomNav: 固定フッター（出張の管理 / ゲストとのやりとり 2タブ、useNavigate接続済み）

### ① 出張先ドロップダウン
- ラベル: `DESTINATION (出張先)`
- 入力方式: selectドロップダウン。japanDestinationsリスト（10都市）
- 必須。未選択時エラー対象

### ② 出張目的 選択グリッド
- ラベル: `出張の目的 (AIマッチングの基準)`
- 選択肢: STARTUP_FUNDING / SAAS_SALES / DX_ALLIANCE / CUSTOM
- 必須。未選択時エラー対象

### ③ カレンダーウィジェット
- 月切替: 7月 ↔ 8月（2026年）
- 日付選択: 1クリック目=開始日、2クリック目=終了日。範囲ハイライト
- 必須

### ④ 確定ボタン
- クリック後ローディング演出 → 002へ遷移

## Data / API Contract
- 入力: `toLocation` / `purposeType` / `purposeText`(CUSTOM時) / `startDate` / `endDate`
- 出力: 全必須項目充足時、handoffDatasetとして002へ引き渡す
- 未充足時: `validationErrors: ValidationErrorKey[]` を返す

## Data / State
```typescript
type PurposeType = "STARTUP_FUNDING" | "SAAS_SALES" | "DX_ALLIANCE" | "CUSTOM";
type TripDate = { month: number; day: number };
type ValidationErrorKey = "toLocation" | "purposeType" | "startDate" | "endDate" | "dateOrder";
type FormStatus = "idle" | "editing" | "error" | "confirmed";
type TripConditionDraft = {
  toLocation: string;
  purposeType: PurposeType | null;
  purposeText: string;
  startDate: TripDate | null;
  endDate: TripDate | null;
  validationErrors: ValidationErrorKey[];
  formStatus: FormStatus;
  handoffDataset: HandoffDataset | null;
};
```

## Internal Design
- `useTripConditionDraft` hook: useReducer実装（純粋関数でユニットテスト可能）
- `TripConditionDraftContext`: Provider + useTripConditionDraftContext
- `validateDraft`: 純粋関数。ValidationErrorKey[]を返す
- `buildHandoffDataset`: 純粋関数。確定時のデータセット生成
- コンポーネント分割: AppHeader / HeroSection / TripConditionForm / TripCalendar / ValidationErrors / BottomNav

## Function Responsibilities
- 入力値を受け取りフォーム状態を更新する責務
- 確定操作時に必須項目を検証し、不足があればvalidationErrorsを更新する責務
- 検証成功時に002へ引き渡すhandoffDatasetを生成する責務

## Error Handling
- 必須項目未入力時: validationErrors に該当キーを追加し、エラー表示
- 日付前後関係不整合（startDate > endDate）: "dateOrder"エラー
- 002未到達状態でリロード: フォームを入力可能状態で表示

## Unit Test Conditions
1. 全必須項目入力済みで確定操作 → formStatusが"confirmed"になり handoffDataset が生成されること
2. 必須項目が1つでも未入力で確定操作 → formStatusが"confirmed"にならず validationErrors に該当キーが含まれること
3. 複数必須項目が未入力の場合 → validationErrors に全未入力項目のキーが含まれること
4. startDate > endDate で確定操作 → validationErrors に "dateOrder" が含まれること
5. formStatus="confirmed" 状態でリロード発生 → フォームが入力可能状態（"idle"/"editing"）で表示されること

## Issue Breakdown Hint
1. 型定義・定数（PurposeType / ValidationErrorKey / TripDate / TripConditionDraft / HandoffDataset / japanDestinations）
2. useTripConditionDraft hook（useReducer / validateDraft / buildHandoffDataset）
3. TripConditionDraftContext（Provider + useTripConditionDraftContext）
4. レイアウトコンポーネント（AppHeader / HeroSection / BottomNav）
5. TripConditionForm（出張先 / 目的グリッド / 確定ボタン）
6. TripCalendar（月切替 / 開始〜終了日範囲選択）
7. ValidationErrors コンポーネント（エラーメッセージ表示 / isStillMissing）

## Issue Readiness Check
- [x] User Flow定義済み
- [x] 外部設計（Screen）定義済み
- [x] Data/State型定義済み
- [x] Unit Test Conditions定義済み（TDD RED根拠確立）
