# 004-app-shell-integration

## Purpose
全機能群（001/002/003）をアプリシェル（ルーティング・Provider構成・BottomNav）として統合し、E2E主要導線が破綻なく動作するアプリとして完成させる。

## User Flow
1. ホストが / にアクセス → TripConditionForm表示
2. 001完了 → /candidates へ自動遷移
3. 候補者選択 → チャットへ進むボタン → /chat?candidateId=xxx
4. BottomNavで / ↔ /chat を自由に行き来できる
5. /candidates は001完了後のみアクセス可能（未完了時は/へリダイレクト）

## Screen / External Design

### Provider構成（main.tsx）
BrowserRouter > TripConditionDraftProvider > CandidateProvider > ChatProvider > App

### ルーティング（App.tsx）
- `/` → TripConditionForm
- `/candidates` → CandidateList
- `/chat` → ChatView（?candidateId= でスレッド初期化）

### BottomNav
- タブ1「出張の管理」→ navigate("/")。/ または /candidates でアクティブ（brand-orange）
- タブ2「ゲストとのやりとり」→ navigate("/chat")。/chat でアクティブ
- useNavigate + useLocation でアクティブ状態管理

## Integration Conditions
- 001完了（handoffDataset生成）→ 002（CandidateList）への遷移が正しく動作すること
- 002候補者カードの「チャットに進む」→ 003（ChatView）への遷移が正しく動作すること
- BottomNavから/chat へ遷移した場合、スレッド一覧が表示されること
- /candidatesは handoffDataset=null の場合に/へリダイレクトすること

## Unit Test Conditions
1. handoffDataset=null の状態で /candidates にアクセス → /へリダイレクト（またはガイダンス表示）されること
2. Provider構成が正しく、TripConditionDraftContext / CandidateContext / ChatContext が全ルートで利用可能であること
3. BottomNavの「出張の管理」クリック → pathname が "/" になること
4. BottomNavの「ゲストとのやりとり」クリック → pathname が "/chat" になること
5. /chat?candidateId=cand-01 でアクセス → activeThreadId が "cand-01" になること

## Issue Breakdown Hint
1. Provider統合（main.tsx: CandidateProvider + ChatProvider 追加）
2. ルーティング統合（App.tsx: /candidates → CandidateList / /chat → ChatView）
3. BottomNav navigate接続（useNavigate + useLocation + アクティブ状態）

## Issue Readiness Check
- [x] User Flow定義済み
- [x] Provider構成・ルーティング定義済み
- [x] Integration Conditions定義済み
- [x] Unit Test Conditions定義済み
