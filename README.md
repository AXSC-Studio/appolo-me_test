# appolo-me_test

> **このリポジトリは [appolo-me](https://github.com/AXSC-Studio/appolo-me) の**テスト版**です。**

---

## 目的

このリポジトリは、以下の実証実験を行うために作成されました。

### 実証実験テーマ：「ビジョンインストールだけで自律的に最後まで開発できるか？」

Claude Cowork を使い、**ビジョン（要件）を渡すだけ**で、設計・実装・テスト・PRマージまでを自律的に完走させる実験です。

---

## 実証できたこと

### 1. ビジョンインストールだけで自律的に最後まで開発できた

- GitHub Issues の自動起票（1 Issue = 1 機能）
- RED → GREEN → Refactor → PR → 自動承認マージ のループを完走
- 単体テスト・結合テスト・受け入れテストまで自律実行

### 2. 品質はどうだったか？

**テスト結果サマリー**

| フェーズ | 結果 |
|---------|------|
| 単体テスト（Step 6） | 129 / 129 PASS |
| 結合テスト（Step 7） | 5 / 5 PASS |
| 受け入れテスト（Step 8） | 5 / 5 PASS（Vitest） |
| ブラウザ実動作（Playwright） | 11 / 11 PASS |

**Vision Install ❶' 5項目（受け入れ基準）**

| # | 基準 | 結果 |
|---|------|------|
| 1 | 出張目的を入力できる | ✓ PASS |
| 2 | 候補者が3名以上表示される | ✓ PASS |
| 3 | 優先順位が明確に見える | ✓ PASS |
| 4 | 各候補の推薦理由が分かる | ✓ PASS |
| 5 | 顧客が次に会う相手を選べる | ✓ PASS |

### 3. 実験の目的

Claude Cowork による自律開発の**実現可能性と品質水準を測定**すること。

人間が一行もコードを書かずに、ビジョン文書を渡すだけで動くプロトタイプが完成するか？ → **完成した。**

---

## 最終品質評価について

**このテスト版の品質評価は暫定です。**

本番リポジトリ [appolo-me](https://github.com/AXSC-Studio/appolo-me) のアプリが完成した後、改めて比較・再評価を行います。

- 自律開発版（本リポジトリ）と人間主導開発版（appolo-me）の品質・速度・保守性を比較
- 実験結果をもとに Cowork 活用のベストプラクティスを策定予定

---

## 技術スタック

- React 19 + TypeScript 6 + Vite 8
- Tailwind CSS v3
- React Router v7
- Vitest + @testing-library/react v16
- Playwright（ブラウザ受け入れテスト）

## 開発フロー（実験で使用）

```
Vision Install
  → GitHub Issues 自動起票
  → Issue消化ループ（RED → GREEN → Refactor → PR → マージ）
  → 単体テスト → 結合テスト → 受け入れテスト → Playwright実動作確認
```

---

*Powered by [Claude Cowork](https://claude.ai) — AXSC Studio*
