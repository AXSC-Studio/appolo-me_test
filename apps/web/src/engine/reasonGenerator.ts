// spec: specs/002-candidate-extraction.md § Internal Design
// 純粋関数群。purposeType別トーンで推薦文・次アクション・打診テキストを生成。

import type { CandidateRecord } from "../types/candidates";
import type { PurposeType } from "../types/trip-conditions";

export function generateReason(
  candidate: CandidateRecord,
  purposeType: PurposeType
): string {
  const rel = candidate.relationship;
  const base =
    rel === "友人・元同僚"
      ? "既存の信頼関係から即座に商談へ移行できます"
      : rel === "既存取引先"
        ? "既存の取引実績があり、スムーズな展開が期待できます"
        : rel === "過去面識あり"
          ? "面識があるため初回アポイントのハードルが低いです"
          : "新規開拓ですが業界特性が高くマッチ度が高いです";

  switch (purposeType) {
    case "STARTUP_FUNDING":
      return `${candidate.name}様は${candidate.industry}に精通しており、${base}。資金調達・アライアンス探索において最適な候補です。`;
    case "SAAS_SALES":
      return `${candidate.name}様のSaaS導入経験と${candidate.company}でのネットワークを活用できます。${base}。`;
    case "DX_ALLIANCE":
      return `${candidate.name}様はDX推進の実績を持ち、製造業向け協業面談に最適です。${base}。`;
    case "CUSTOM":
      return `${candidate.name}様（${candidate.company} / ${candidate.role}）との商談が推奨されます。${base}。`;
  }
}

export function generateNextAction(
  candidate: CandidateRecord,
  purposeType: PurposeType
): string {
  const rel = candidate.relationship;
  if (rel === "友人・元同僚") {
    return "直接連絡して出張日程を共有し、ランチミーティングを打診する";
  }
  if (rel === "既存取引先") {
    return "担当者へメールで訪問アポイントを送付し、商談アジェンダを事前共有する";
  }
  if (rel === "過去面識あり") {
    return "LinkedInまたはメールで近況を共有しながら出張の機会を打診する";
  }
  // 要新規開拓
  switch (purposeType) {
    case "STARTUP_FUNDING":
      return "紹介者を経由して初回面談のアポイントを取得する";
    case "SAAS_SALES":
      return "会社HPのお問い合わせフォームから訪問提案メールを送付する";
    case "DX_ALLIANCE":
      return "業界イベントで接触機会を作り、名刺交換から関係構築を開始する";
    case "CUSTOM":
      return "SNSでフォローし、コンテンツへの反応をきっかけに接点を作る";
  }
}

export function generatePitchMessage(
  candidate: CandidateRecord,
  purposeType: PurposeType
): string {
  const dateRange = "来月の出張期間中";
  switch (purposeType) {
    case "STARTUP_FUNDING":
      return `${candidate.name}様、お世話になっております。${dateRange}に${candidate.company}様のお近くへ出張する予定です。資金調達・事業アライアンスについてご意見をいただけますと幸いです。30分ほどお時間をいただけないでしょうか？`;
    case "SAAS_SALES":
      return `${candidate.name}様、いつもありがとうございます。${dateRange}に貴社近郊へ参る予定があり、弊社SaaSの新機能についてご紹介させていただきたく存じます。ご都合よろしければお時間をいただけますか？`;
    case "DX_ALLIANCE":
      return `${candidate.name}様、はじめてご連絡いたします。${dateRange}に御社近くへ出張予定があります。製造DX分野での協業についてぜひご相談させていただきたいと思っております。15〜30分ほどお時間いただけますでしょうか？`;
    case "CUSTOM":
      return `${candidate.name}様、${dateRange}に${candidate.company}様近郊へ出張の機会があります。ぜひ一度お話しさせていただけないでしょうか？30分ほどお時間をいただけますと幸いです。`;
  }
}
