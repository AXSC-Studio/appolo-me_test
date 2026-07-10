# 002-candidate-extraction

## Purpose
001から引き渡されたhandoffDatasetを元に、AIがダミーDBから候補者をマッチング・ランキングして表示する。Vision Install ❷外部設計「候補者3名以上抽出 + 優先順位・推薦理由・次アクション提示」を実現する。

## User Flow
1. 001の確定操作後、/candidates へ遷移する
2. AIマッチング中のローディング演出（プログレスバー）が表示される
3. マッチング完了後、候補者カードが優先順位順に表示される
4. 各カードには候補者名・企業・マッチ度スコア・優先順位バッジが表示される
5. 候補者が0件の場合、ガイダンスメッセージと001へ戻るボタンを表示する
6. 候補者が1件以上の場合、コールドスタート対策のシェアブロックを最下部に表示する

## Screen / External Design

### 候補者カード（1枚）
- 優先順位バッジ（No.1 優先アプローチ）
- 候補者名・会社・役職・マッチ度%
- 「最適プランを見る」アコーディオントグル
- アコーディオン展開時: AIマッチング選定理由 / 次アクション / 打診テキスト（コピーボタン）
- 「{名前}様とのチャットに進む」ボタン → /chat?candidateId=xxx

### MatchingProgress
- プログレスバー（0→95%を約2秒でアニメーション）

### EmptyState
- ガイダンステキスト + 「出張条件を再入力する」ボタン（navigate("/")）

### SocialShareBlock（コールドスタート対策）
- 「X（Twitter）でシェア」「テキストをコピー」「リンクをコピー」ボタン

## Data / API Contract
- 入力: `HandoffDataset`（001からのhandoffDataset）
- 出力: `RankingState`
```typescript
type RankingState =
  | { status: "success"; results: MatchResult[] }
  | { status: "empty"; guidance: string }
  | { status: "error"; guidance: string };
type MatchResult = {
  candidateId: string;
  priority: number;
  matchingScore: number;
  matchedAttribute: string;
  recommendationReason: string;
  nextAction: string;
  pitchMessage: string;
};
```

## Data / State（CandidateContext）
```typescript
type CandidateContextValue = {
  rankingState: RankingState | null;
  isLoading: boolean;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  getCandidate: (id: string) => MatchResult | undefined;
};
```

## Internal Design
- `candidateDummyDB.ts`: 8名のダミー候補者。非同期fetchCandidates()
- `matchingEngine.ts`: rankCandidates(handoffDataset)。purposeType別スコアリング
- `reasonGenerator.ts`: generateReason / generateNextAction / generatePitchMessage
- `CandidateContext`: handoffDataset変化を監視、2000ms遅延後rankCandidates実行
- スコア基準（関係性ベース）: 友人/元同僚=50 / 既存取引先=45 / 過去面識あり=40 / 要新規開拓=35

## Function Responsibilities
- handoffDatasetからマッチング条件を解釈しスコアを算出する責務
- 候補者をスコア降順・ID昇順でソートする責務
- 推薦理由・次アクション・打診テキストを生成する責務
- ローディング状態・結果・空状態を管理する責務

## Error Handling
- fetchCandidates失敗時: status="error" のRankingStateを返す
- 候補者0件時: status="empty" のRankingStateを返す

## Unit Test Conditions
1. STARTUP_FUNDING で rankCandidates 実行 → 友人/元同僚の候補者がスコア最高位になること
2. 同スコアの候補者が複数いる場合 → ID昇順でソートされること
3. 全必須フィールドを持つMatchResultが生成されること（candidateId/priority/matchingScore/recommendationReason/nextAction/pitchMessage）
4. fetchCandidates が失敗した場合 → status="error" のRankingStateが返ること
5. 候補者が0件の場合 → status="empty" のRankingStateが返ること

## Issue Breakdown Hint
1. 型定義（CandidateRecord / MatchResult / RankingState / HandoffDataset）
2. candidateDummyDB（8名のダミーデータ + 非同期fetchCandidates）
3. reasonGenerator（generateReason / generateNextAction / generatePitchMessage）
4. matchingEngine（rankCandidates / purposeType別スコアリング）
5. CandidateContext（Provider + useCandidateContext + ローディング管理）
6. MatchingProgress + EmptyState + SocialShareBlock コンポーネント
7. CandidateCard（アコーディオン / コピー / チャットへ遷移）+ CandidateList（統合）

## Issue Readiness Check
- [x] User Flow定義済み
- [x] 外部設計（Screen）定義済み
- [x] Data/State型定義済み
- [x] Unit Test Conditions定義済み
