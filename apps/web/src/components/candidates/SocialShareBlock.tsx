// spec: specs/002-candidate-extraction.md § Screen / SocialShareBlock
// コールドスタート対策: X共有 / テキストコピー / リンクコピー

import { useState } from "react";
import { Share2, Copy, Link } from "lucide-react";
import type { HandoffDataset } from "../../types/trip-conditions";

type Props = { handoffDataset: HandoffDataset };

function buildTweetText(ds: HandoffDataset): string {
  const { toLocation, startDate, endDate } = ds;
  return encodeURIComponent(
    `${startDate.month}/${startDate.day}〜${endDate.month}/${endDate.day}に${toLocation}へ出張します。アポイントご希望の方はappolo.meからご連絡ください！ #appolo_me #出張アポ`
  );
}

function buildPlainText(ds: HandoffDataset): string {
  const { toLocation, startDate, endDate } = ds;
  return `${startDate.month}/${startDate.day}〜${endDate.month}/${endDate.day}に${toLocation}へ出張します。アポイントご希望の方はappolo.meからご連絡ください！`;
}

export function SocialShareBlock({ handoffDataset }: Props) {
  const [copied, setCopied] = useState<"text" | "link" | null>(null);

  function handleXShare() {
    const tweet = buildTweetText(handoffDataset);
    window.open(
      `https://twitter.com/intent/tweet?text=${tweet}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function handleCopyText() {
    await navigator.clipboard.writeText(buildPlainText(handoffDataset));
    setCopied("text");
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied("link");
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="bg-brand-light border border-gray-100 rounded-2xl p-4 space-y-3">
      <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
        Share your trip
      </p>
      <p className="text-xs text-brand-dark font-medium">
        出張をシェアして、もっと多くのアポを獲得しましょう
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleXShare}
          aria-label="X（Twitter）でシェア"
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-black text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-gray-800 transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
          X でシェア
        </button>
        <button
          type="button"
          onClick={handleCopyText}
          aria-label="テキストをコピー"
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-xs font-bold text-brand-dark rounded-xl cursor-pointer hover:bg-gray-50 transition-all"
        >
          <Copy className="w-3.5 h-3.5" />
          {copied === "text" ? "コピー済み" : "テキスト"}
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="リンクをコピー"
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-xs font-bold text-brand-dark rounded-xl cursor-pointer hover:bg-gray-50 transition-all"
        >
          <Link className="w-3.5 h-3.5" />
          {copied === "link" ? "コピー済み" : "リンク"}
        </button>
      </div>
    </div>
  );
}
