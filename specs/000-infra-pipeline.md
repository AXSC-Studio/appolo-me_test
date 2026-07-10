# 000-infra-pipeline

## Purpose
全機能群の品質ゲートとなるCI/CD・テスト実行基盤を定義する。

## Scope
- CI（`.github/workflows/ci.yml`）: TypeScript check / build / vitest
- Auto Merge（`.github/workflows/auto-merge.yml`）: CIパス後の自動マージ（COWORK自律テストモード）
- テストセットアップ（`tests/setup.ts`）

## Out of Scope
- デプロイ（Firebase Hosting / Cloud Run）: v0スコープ外
- Secret実値の管理

## Integration Conditions
- 全PRがci.ymlのquality-gate（typecheck / build / test）を通過してからmainにマージされること
- テストが1件でも失敗している場合、マージを行わないこと

## Issue Breakdown Hint
1. CI セットアップ（typecheck / build / vitest）
2. auto-merge ジョブ設定（CIパス後の自動承認・マージ）

## Unit Test Conditions
- ci.ymlが存在し、typecheck・build・testジョブが定義されていること
- vitest.config.tsが存在し、jsdom環境とsetupFilesが設定されていること

## Issue Readiness Check
- [x] Scope定義済み
- [x] CI/auto-merge設定はchore: initial setupコミットで完了済み
