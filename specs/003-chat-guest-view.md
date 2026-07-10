# 003-chat-guest-view

## Purpose
ホストが選択した候補者に対してアポイント打診テキストを送り、ゲストとのやりとりをチャット形式で管理する。Vision Install E2E UXのホスト STEP 6「アポイント依頼文または次アクションを確認する」とゲスト STEP 1〜5を実現する。

## User Flow

### ホスト側（/chat画面）
1. 候補者カードの「{名前}様とのチャットに進む」ボタン → /chat?candidateId=xxx へ遷移
2. チャット詳細ビューが表示される（相手名・会社名ヘッダー + メッセージバブル + 入力フォーム）
3. 打診テキストを貼り付けて送信する
4. 1.5秒後にゲストからのモック自動返信が届く
5. BottomNavの「ゲストとのやりとり」タブからスレッド一覧へ戻れる

### ゲスト側（v0スコープ: モック表現のみ）
- ゲストの回答はモック自動返信で表現する（実際のゲスト画面はv1以降）

## Screen / External Design

### スレッド一覧ビュー（/chat、activeThread未設定時）
- ヘッダー: 「ゲストとのやりとり」
- スレッドカード: 候補者アイコン（イニシャル）+ 名前 + 会社 + 最終メッセージ + 時刻
- スレッドカードクリック → チャット詳細ビューへ

### チャット詳細ビュー（/chat、activeThread設定時）
- ヘッダー: 戻るボタン（←）+ {名前}様 + 会社名
- メッセージバブル: ホスト発信=右・ブランドオレンジ / ゲスト発信=左・グレー
- 入力フォーム: textarea（Shift+Enter改行・Enter送信）+ 送信ボタン
- 空状態: 「打診テキストを貼り付けて送信してください」

## Data / State（ChatContext）
```typescript
type Message = {
  id: string;
  senderId: "host" | "guest";
  text: string;
  timestamp: Date;
};
type Thread = {
  candidateId: string;
  messages: Message[];
};
type ChatContextValue = {
  threads: Record<string, Thread>;
  activeThreadId: string | null;
  setActiveThread: (candidateId: string) => void;
  clearActiveThread: () => void;
  sendMessage: (candidateId: string, text: string) => void;
};
```

## Internal Design
- `ChatContext`: threads / activeThreadId を useState で管理
- `sendMessage`: host Message追加 → setTimeout(1500ms) → MOCK_REPLIES からランダムに guest Message追加
- `ChatView`: useSearchParamsで?candidateId= を受け取り setActiveThread を実行
- スレッド一覧 ↔ チャット詳細は activeThreadId の有無で切り替え（ルート変更なし）
- MOCK_REPLIES: 3種類のモック返信テキスト

## Function Responsibilities
- スレッドを candidateId をキーとして管理する責務
- メッセージ送信後1.5秒でモック返信を追加する責務
- URLパラメータからactiveThreadを初期化する責務

## Error Handling
- スレッドが存在しない candidateId が指定された場合: 空スレッドを自動生成
- メッセージ未入力の状態での送信操作: 無視（送信ボタンdisabled）

## Unit Test Conditions
1. sendMessage 実行後、threads[candidateId].messagesにhost Messageが追加されること
2. sendMessage 実行から1500ms後、threads[candidateId].messagesにguest Messageが追加されること
3. MOCK_REPLIESの中からrandomに選ばれたテキストがguest Messageのtextになること
4. setActiveThread実行後、activeThreadIdが指定のcandidateIdになること
5. clearActiveThread実行後、activeThreadIdがnullになること
6. 存在しないcandidateIdでsetActiveThreadを実行した場合、空のスレッドが生成されること

## Issue Breakdown Hint
1. ChatContext（Provider / sendMessage with mock reply / useChatContext）
2. ChatView（スレッド一覧ビュー / チャット詳細ビュー / useSearchParams連携）
3. main.tsx統合 + App.tsxルーティング更新（/chat route追加 + ChatProvider追加）

## Issue Readiness Check
- [x] User Flow定義済み
- [x] 外部設計（Screen）定義済み
- [x] Data/State型定義済み
- [x] Unit Test Conditions定義済み
