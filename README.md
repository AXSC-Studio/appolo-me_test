# appolo-me_test

**Language / 语言 / 言語:** [English](#english) | [中文](#chinese) | [日本語](#japanese)

---

<a name="english"></a>
## English

> **This is the autonomous development test version of [appolo-me](https://github.com/AXSC-Studio/appolo-me).**  
> Claude Cowork (AI) completed the entire development cycle — design, implementation, testing, and merging — **from a single instruction**.

🔗 **Live Demo:** https://axsc-studio.github.io/appolo-me_test/

### TL;DR — Autonomous Development by the Numbers

| Metric | Value |
|--------|-------|
| Human code interventions | **0** |
| Continuous working time | **8 hrs 7 min** (2026-07-11 08:32:39 → 16:40:06) |
| Total commits | **43** (avg. 11.3 min/commit) |
| Issues raised → closed | **17 Issues, 100% autonomous** |
| PRs created → merged | **19 PRs, all MERGED** |
| Tests passed (all layers) | **129 + 5 + 11 = 145 tests** |
| Quality score (3rd-party eval) | **82 / 100** |

### Experiment: Can a single Vision Install drive full autonomous development?

**Answer: Yes.**

By handing Claude Cowork a single "Vision Install" document (requirements spec), the following were completed with zero human code intervention:

- Auto-generation of feature specs (`specs/*.md`) — external design, internal design, test conditions
- Auto-creation of 18 GitHub Issues (1 Issue = 1 feature)
- 17 complete TDD cycles (RED → GREEN → Refactor)
- PR creation, CI pass verification, and auto-approval merging
- Full test coverage: unit, integration, and Playwright acceptance tests

### Test Results

| Phase | Count | Result |
|-------|-------|--------|
| Unit tests (Vitest) | 129 | **129 / 129 PASS** |
| Integration tests (Vitest) | 5 | **5 / 5 PASS** |
| Acceptance tests (Vitest) | 5 | **5 / 5 PASS** |
| Browser E2E (Playwright) | 11 | **11 / 11 PASS** |

#### Vision Install ❶' — 5 Acceptance Criteria

| # | Criterion | Result |
|---|-----------|--------|
| 1 | User can enter business trip purpose | PASS |
| 2 | 3+ candidates are displayed | PASS |
| 3 | Priority ranking is clearly visible | PASS |
| 4 | Recommendation reason per candidate is shown | PASS |
| 5 | User can select the person to meet | PASS |

### ROI Comparison: Human-Led vs AI Autonomous

| Metric | appolo-me (Human-led) | appolo-me_test (AI autonomous) |
|--------|-----------------------|-------------------------------|
| Active development period | ~15 days (2026-06-29 – 07-13) | **8.1 hours** (single day) |
| Commits | 84 | 43 |
| Issues | 35 | 18 |
| Issue close rate | 69% | **94%** |
| E2E testing | None | **Playwright 11/11 PASS** |
| TypeScript purity | JS remaining | **100% TypeScript** |
| test / code ratio | Unknown | **1.17** |
| Quality score | 84 / 100 | 82 / 100 |

> **Quality gap: only 2 points (84 vs 82). Speed gap: ~44×.**

### Quality Score Breakdown (Enterprise-Grade Evaluation)

| Axis (max) | appolo-me | appolo-me_test | Winner |
|------------|-----------|----------------|--------|
| Issue governance (/25) | **22** | 16 | appolo-me |
| PR & merge quality (/20) | **20** | 15 | appolo-me |
| Test quality (/25) | 15 | **25** | appolo-me_test |
| Code architecture (/15) | 12 | **14** | appolo-me_test |
| Docs & infrastructure (/15) | **15** | 12 | appolo-me |
| **Total (/100)** | **84** | **82** | appolo-me ±2 |

### Tech Stack

- React 19 + TypeScript 6 (100%) + Vite 8
- Tailwind CSS v3 / React Router v7
- Vitest + @testing-library/react v16 / Playwright
- GitHub Actions (lint · test · auto-merge · GitHub Pages deploy)

### Local Setup

```bash
git clone https://github.com/AXSC-Studio/appolo-me_test.git
cd appolo-me_test
yarn install
yarn workspace web dev
```

---

<a name="chinese"></a>
## 中文

> **本仓库是 [appolo-me](https://github.com/AXSC-Studio/appolo-me) 的自主开发测试版。**  
> Claude Cowork（AI）仅凭 **一次指令**，完成了从设计、实现、测试到合并的全流程开发。

🔗 **在线演示：** https://axsc-studio.github.io/appolo-me_test/

### 概览 — 自主开发的量化数据

| 指标 | 数值 |
|------|------|
| 人工代码干预次数 | **0次** |
| 连续工作时长 | **8小时7分钟**（2026-07-11 08:32:39 → 16:40:06） |
| 总提交数 | **43次**（平均11.3分钟/次） |
| Issue 创建 → 关闭 | **17个 Issue，100%自主处理** |
| PR 创建 → 合并 | **19个 PR，全部 MERGED** |
| 测试通过（所有层级） | **129 + 5 + 11 = 145件** |
| 质量评分（第三方评估） | **82 / 100分** |

### 实验：仅凭 Vision Install 能否完成完整的自主开发？

**结论：可以。**

将一份"Vision Install"文档（需求规格说明）交给 Claude Cowork，在零人工代码干预的情况下完成了以下全部工作：

- 自动生成功能规格书（`specs/*.md`）——外部设计、内部设计、测试条件
- 自动创建 18 个 GitHub Issue（1 Issue = 1 功能）
- 完整执行 17 次 TDD 循环（RED → GREEN → Refactor）
- PR 创建、CI 通过验证、自动审批合并
- 全层测试：单元测试、集成测试、Playwright 验收测试

### 测试结果

| 阶段 | 件数 | 结果 |
|------|------|------|
| 单元测试（Vitest） | 129件 | **129 / 129 PASS** |
| 集成测试（Vitest） | 5件 | **5 / 5 PASS** |
| 验收测试（Vitest） | 5件 | **5 / 5 PASS** |
| 浏览器 E2E（Playwright） | 11件 | **11 / 11 PASS** |

### ROI 对比：人工主导 vs AI 自主

| 指标 | appolo-me（人工主导） | appolo-me_test（AI 自主） |
|------|-----------------------|--------------------------|
| 活跃开发期间 | 约15天（2026-06-29 〜 07-13） | **8.1小时**（同一天内） |
| 提交数 | 84 | 43 |
| Issue 数 | 35 | 18 |
| Issue 关闭率 | 69% | **94%** |
| E2E 测试 | 无 | **Playwright 11/11 PASS** |
| TypeScript 纯度 | 存在 JS 代码 | **100% TypeScript** |
| 质量评分 | 84 / 100 | 82 / 100 |

> **质量差距仅 2 分（84 vs 82），开发速度差距约 44 倍。**

### 技术栈

- React 19 + TypeScript 6（100%）+ Vite 8
- Tailwind CSS v3 / React Router v7
- Vitest + @testing-library/react v16 / Playwright
- GitHub Actions（lint · test · auto-merge · GitHub Pages 部署）

---

<a name="japanese"></a>
## 日本語

> **このリポジトリは [appolo-me](https://github.com/AXSC-Studio/appolo-me) の自律開発テスト版です。**  
> Claude Cowork（AI）が **1回の指示だけ** で、設計・実装・テスト・マージまでを完走した記録。

🔗 **Live Demo:** https://axsc-studio.github.io/appolo-me_test/

### TL;DR — 数字で見る自律開発

| 指標 | 値 |
|------|----|
| 人間のコード介入 | **0回** |
| 連続作業時間 | **8時間7分**（2026-07-11 08:32:39 → 16:40:06） |
| 総コミット数 | **43コミット**（平均 11.3分/コミット） |
| Issue 起票 → クローズ | **17 Issues を100%自律処理** |
| PR 作成 → マージ | **19 PRs、全MERGED** |
| テスト全層 PASS | **129 + 5 + 11 = 145件** |
| 品質スコア（第三者評価） | **82 / 100点** |

### 実証実験：ビジョンインストールだけで開発できるか？

**結論：できた。**

「Vision Install」文書（要件定義1枚）を Claude Cowork に渡しただけで、以下をすべて人間の介入なしで完走しました。

- 機能仕様書（`specs/*.md`）の自動生成（外部設計・内部設計・テスト条件）
- GitHub Issues の自動起票（18件 / 1 Issue = 1機能）
- TDD ループ（RED → GREEN → Refactor）を17回完走
- PR 作成・CI パス確認・自動承認マージ
- 単体テスト・結合テスト・Playwright 受け入れテストの全層自動実行

### テスト結果

| フェーズ | 件数 | 結果 |
|---------|------|------|
| 単体テスト（Vitest） | 129件 | **129 / 129 PASS** |
| 結合テスト（Vitest） | 5件 | **5 / 5 PASS** |
| 受け入れテスト（Vitest） | 5件 | **5 / 5 PASS** |
| ブラウザ実動作（Playwright） | 11件 | **11 / 11 PASS** |

#### Vision Install ❶' — 受け入れ基準 5項目

| # | 基準 | 結果 |
|---|------|------|
| 1 | 出張目的を入力できる | PASS |
| 2 | 候補者が 3 名以上表示される | PASS |
| 3 | 優先順位が明確に見える | PASS |
| 4 | 各候補の推薦理由が分かる | PASS |
| 5 | 顧客が次に会う相手を選べる | PASS |

### ROI 比較：人間主導 vs AI 自律

| 指標 | appolo-me（人間主導） | appolo-me_test（AI 自律） |
|------|----------------------|--------------------------|
| アクティブ開発期間 | 約15日（2026-06-29〜07-13） | **8.1時間**（同日内） |
| コミット数 | 84 | 43 |
| Issue 数 | 35件 | 18件 |
| Issue クローズ率 | 69% | **94%** |
| E2E テスト | なし | **Playwright 11/11 PASS** |
| TypeScript 純度 | JS 残存あり | **100% TypeScript** |
| test / code 比率 | 不明 | **1.17** |
| 品質スコア | 84 / 100 | 82 / 100 |

> **品質差わずか 2 点（84 vs 82）で、開発速度は約 44 倍の差。**

### 品質スコア詳細（エンタープライズグレード評価）

| 評価軸（満点） | appolo-me | appolo-me_test | 勝者 |
|----------------|-----------|----------------|------|
| Issue 管理ガバナンス（/25） | **22** | 16 | appolo-me |
| PR・マージ品質（/20） | **20** | 15 | appolo-me |
| テスト品質（/25） | 15 | **25** | appolo-me_test |
| コードアーキテクチャ（/15） | 12 | **14** | appolo-me_test |
| ドキュメント・インフラ（/15） | **15** | 12 | appolo-me |
| **合計（/100）** | **84** | **82** | appolo-me ±2 |

### 技術スタック

- React 19 + TypeScript 6（100%）+ Vite 8
- Tailwind CSS v3 / React Router v7
- Vitest + @testing-library/react v16 / Playwright
- GitHub Actions（lint・test・auto-merge・GitHub Pages デプロイ）

### ローカル起動

```bash
git clone https://github.com/AXSC-Studio/appolo-me_test.git
cd appolo-me_test
yarn install
yarn workspace web dev
```

### 最終評価について

本番リポジトリ [appolo-me](https://github.com/AXSC-Studio/appolo-me) 完成後、改めて比較・最終評価を実施予定です。

---

*Powered by [Claude Cowork](https://claude.ai) — AXSC Studio*
