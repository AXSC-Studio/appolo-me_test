# appolo-me_test

> **[appolo-me](https://github.com/AXSC-Studio/appolo-me) の自律開発テスト版**  
> Claude Cowork（AI）が **1回の指示だけ** で、設計・実装・テスト・マージまでを完走した記録。

🔗 **Live Demo:** https://axsc-studio.github.io/appolo-me_test/

---

## TL;DR — 数字で見る自律開発

| 指標 | 値 |
|------|----|
| 人間のコード介入 | **0回** |
| 連続作業時間 | **8時間7分**（2026-07-11 08:32:39 → 16:40:06） |
| 総コミット数 | **43コミット**（平均 11.3分/コミット） |
| Issue 起票 → クローズ | **17 Issues を100%自律処理** |
| PR 作成 → マージ | **19 PRs、全MERGED** |
| テスト全層 PASS | **129 + 5 + 11 = 145件** |
| 品質スコア（第三者評価） | **82 / 100点** |

---

## 実証実験：ビジョンインストールだけで開発できるか？

**結論：できた。**

「Vision Install」文書（要件定義1枚）を Claude Cowork に渡しただけで、
以下をすべて人間の介入なしで完走しました。

- 機能仕様書（`specs/*.md`）の自動生成（外部設計・内部設計・テスト条件）
- GitHub Issues の自動起票（18件 / 1 Issue = 1機能）
- TDD ループ（RED → GREEN → Refactor）を17回完走
- PR 作成・CI パス確認・自動承認マージ
- 単体テスト・結合テスト・Playwright 受け入れテストの全層自動実行

---

## テスト結果

| フェーズ | 件数 | 結果 |
|---------|------|------|
| 単体テスト（Vitest） | 129 件 | **129 / 129 PASS** |
| 結合テスト（Vitest） | 5 件 | **5 / 5 PASS** |
| 受け入れテスト（Vitest） | 5 件 | **5 / 5 PASS** |
| ブラウザ実動作（Playwright） | 11 件 | **11 / 11 PASS** |

### Vision Install ❶' — 受け入れ基準 5項目

| # | 基準 | 結果 |
|---|------|------|
| 1 | 出張目的を入力できる | PASS |
| 2 | 候補者が 3 名以上表示される | PASS |
| 3 | 優先順位が明確に見える | PASS |
| 4 | 各候補の推薦理由が分かる | PASS |
| 5 | 顧客が次に会う相手を選べる | PASS |

---

## ROI 比較：人間主導 vs AI 自律

人間主導開発リポジトリ [appolo-me](https://github.com/AXSC-Studio/appolo-me) との客観比較です。

| 指標 | appolo-me（人間主導） | appolo-me_test（AI 自律） |
|------|----------------------|--------------------------|
| git 上の開発期間 | 127日（2026-03-05 〜 07-10） | **8.1時間**（同日内） |
| コミット数 | 84 | 43 |
| Issue 数 | 35 件 | 18 件 |
| Issue クローズ率 | 69% | **94%** |
| E2E テスト | なし | **Playwright 11 / 11 PASS** |
| TypeScript 純度 | JS 残存あり | **100% TypeScript** |
| test / code 比率 | 不明 | **1.17** |
| 品質スコア | 84 / 100 | 82 / 100 |

> **品質差わずか 2 点（84 vs 82）で、git 開発期間は約 125 倍の差。**

※ 127日は git コミット日数ベースの期間であり、実際の稼働工数ではありません。

---

## 品質スコア詳細（エンタープライズグレード・厳格評価）

| 評価軸（満点） | appolo-me | appolo-me_test | 勝者 |
|----------------|-----------|----------------|------|
| Issue 管理ガバナンス（/25） | **22** | 16 | appolo-me |
| PR・マージ品質（/20） | **20** | 15 | appolo-me |
| テスト品質（/25） | 15 | **25** | appolo-me_test |
| コードアーキテクチャ（/15） | 12 | **14** | appolo-me_test |
| ドキュメント・インフラ（/15） | **15** | 12 | appolo-me |
| **合計（/100）** | **84** | **82** | appolo-me ±2 |

**appolo-me_test の最大の弱点：** Issue Labels ゼロ（最大減点要因）。整備すれば逆転可能。  
**appolo-me_test の強み：** E2E 含む全テスト層 PASS・TypeScript 100%・test/code 比 1.17。

---

## 技術スタック

- **フロントエンド:** React 19 + TypeScript 6（100%）+ Vite 8
- **スタイル:** Tailwind CSS v3 / React Router v7
- **テスト:** Vitest + @testing-library/react v16 / Playwright
- **CI/CD:** GitHub Actions（lint・test・auto-merge・GitHub Pages デプロイ）

## 開発フロー（実験で使用）

```
Vision Install（要件定義 1 文書）
  → specs/*.md 自動生成（外部設計・内部設計・テスト条件）
  → GitHub Issues 自動起票（18 件）
  → Issue 消化ループ × 17回
      RED（テスト失敗確認）
      → GREEN（実装）
      → Refactor
      → PR 作成
      → CI パス → 自動承認マージ
  → 単体テスト（129件）→ 結合テスト（5件）→ 受け入れテスト → Playwright
```

---

## ローカル起動

```bash
git clone https://github.com/AXSC-Studio/appolo-me_test.git
cd appolo-me_test
yarn install
yarn workspace web dev
```

---

## 最終評価について

本番リポジトリ [appolo-me](https://github.com/AXSC-Studio/appolo-me) 完成後、
改めて比較・最終評価を実施予定です。

---

*Powered by [Claude Cowork](https://claude.ai) — AXSC Studio*
