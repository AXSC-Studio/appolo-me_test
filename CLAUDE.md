# CLAUDE.md

## Role
あなたはAXSC標準に従うAI開発アシスタントです。本リポジトリ（appolo-me_test）における実行ルールはこのファイルを正本とします。

## Project Context
- プロダクト名: appolo.me（出張中に「今会うべき人」をAIが見つけアポイントへつなぐMVP）
- リポジトリ位置づけ: **COWORK × AXSC 自律開発検証プロジェクト**（appolo-meのIssue駆動開発との品質比較テスト）
- 技術スタック: React 19 + TypeScript + Vite 8 + Tailwind CSS v3 / React Router v7 / Vitest / GitHub Actions
- v0スコープ: ダミーDB・モックマッチング・モック自動返信（Firebase / OpenAI は将来フェーズ）

## Process / Technical Source Priority
判断が衝突した場合、以下の順に優先する。
1. Vision Install（GitHub Issue #1 / AXSC-Studio/appolo-me_test）
2. AXSCモダン開発アーキテクチャ正本（本ファイル）
3. GitHub Issue
4. `tests/`
5. `specs/`

## Development Flow（BML ⇄ SDD ✕ TDD on V字モデル）
```
Vision Install → Specify(specs/*.md) → Plan(Issue起票) → Tasks → Implement → テスト
```
- 実装前に対応する `specs/*.md` と GitHub Issue が存在することを確認する
- 1 Issue = 1 Function。Issueの粒度を肥大化させない
- テスト条件は `specs/*.md` に先に定義し、その後 `tests/` に実コードを書く（RED → GREEN → REFACTOR）
- RED（失敗するテスト）が確認できるまでGREEN（実装）に進まない

## Directory Rules
- `apps/`     … 実装コード（`apps/web/` のみ。v0は単一フロントエンド）
- `docs/`     … `business/`（ビジネス文書）/ `requirements/`（技術判断メモ）
- `specs/`    … 機能仕様（外部設計・内部設計・単体/結合テスト条件）
- `tests/`    … テストコード（実行コードのみ。条件は specs/ 側に書く）
- ルート直下に `src/` は使わない
- `apps/` への無断実装（Specify/Plan/Tasksを経ない実装）禁止

## Git / GitHub Rules
- Issue → ブランチ作成 → 実装 → PR作成 → CIパス → 承認 → mainマージ のフローを経る
- **承認方針: COWORK自律テストのため、CIパス後はClaudeが自動承認・マージを行う（明示設定）**
- ブランチ命名: `feature/issue-{N}-{slug}`（例: `feature/issue-2-trip-condition-form`）
- PR本文: ビジネスメンバーが理解できるレベルで作業内容を記載（Vision Install Issue Templateに準拠）
- README.md のみ main への直プッシュを許可する

## Testing Rules
- 単体テスト・結合テスト・受け入れテストの3層を弱めない
- 既存テスト・既存テスト条件の削除・弱体化は行わない
- テストコードは `tests/` 配下に置く（ファイル名: `{対象}-{issue番号}.test.{ts|tsx}`）

## TDD Checklist（各Issue消化時に必ず遵守）
- [ ] specs/*.md の Unit Test Conditions を確認した
- [ ] tests/ に RED コードを書いた
- [ ] RED（テスト失敗）を確認した
- [ ] 実装（GREEN）した
- [ ] Refactor した
- [ ] PR作成 + レポートコメント記載した
- [ ] CIパス後 自動承認・マージした
- [ ] Issueにクロージングコメントを記載してクローズした

## Prohibited Actions
- specs/*.md と GitHub Issue が存在しない状態での実装
- RED確認をスキップした実装（テスト後付け禁止）
- 既存テスト・テスト条件の削除・弱体化
- Secret値の推測・生成・記載
- Issueの Labels をユーザー許可なく追加
- GCP / Firebase / GitHub の削除操作

## Security Rules
- `.env` / `.env.local` を Git 管理対象に含めない
- Secret実値をコード・README・Issue本文に記載しない
