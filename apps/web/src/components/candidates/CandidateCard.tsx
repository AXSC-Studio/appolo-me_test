// spec: specs/002-candidate-extraction.md § Screen / 候補者カード
// アコーディオン展開: selectedId === candidateId のとき展開

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Copy, Check, MessageCircle } from "lucide-react";
import type { MatchResult } from "../../types/candidates";

const PRIORITY_LABELS: Record<number, string> = {
  1: "No.1 優先アプローチ",
  2: "No.2 次点候補",
  3: "No.3 補欠候補",
};

type Props = {
  result: MatchResult;
  candidateName: string;
  company: string;
  role: string;
  isExpanded: boolean;
  onToggle: () => void;
};

export function CandidateCard({
  result,
  candidateName,
  company,
  role,
  isExpanded,
  onToggle,
}: Props) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const priorityLabel =
    PRIORITY_LABELS[result.priority] ?? `No.${result.priority}`;

  async function handleCopyPitch() {
    await navigator.clipboard.writeText(result.pitchMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleChatNav() {
    navigate(`/chat?candidateId=${result.candidateId}`);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* ヘッダー (常時表示) */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-4 cursor-pointer hover:bg-gray-50 transition-all"
        aria-expanded={isExpanded}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-bold text-brand-orange bg-brand-accent px-2 py-0.5 rounded-full">
                {priorityLabel}
              </span>
              <span className="text-[10px] font-bold text-gray-400">
                マッチ度 {result.matchingScore}%
              </span>
            </div>
            <p className="text-sm font-extrabold text-brand-dark">{candidateName}</p>
            <p className="text-xs text-gray-400">
              {company} / {role}
            </p>
          </div>
          <div className="mt-1 text-gray-300">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>
      </button>

      {/* アコーディオン展開エリア */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-50">
          {/* 選定理由 */}
          <div className="pt-3 space-y-1">
            <p className="text-[10px] font-bold text-brand-orange tracking-widest uppercase">
              AIマッチング選定理由
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              {result.recommendationReason}
            </p>
          </div>

          {/* 次アクション */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              推奨次アクション
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              {result.nextAction}
            </p>
          </div>

          {/* 打診テキスト + コピー */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              打診テキスト
            </p>
            <div className="bg-brand-light rounded-xl p-3">
              <p className="text-xs text-brand-dark leading-relaxed whitespace-pre-wrap">
                {result.pitchMessage}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyPitch}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-xs font-bold text-brand-dark rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-green-500" />
                  コピー済み
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  コピー
                </>
              )}
            </button>
          </div>

          {/* チャットへ */}
          <button
            type="button"
            onClick={handleChatNav}
            className="w-full flex items-center justify-center gap-2 py-3 bg-brand-orange text-white text-sm font-extrabold rounded-full cursor-pointer hover:bg-brand-orange/90 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            {candidateName}様とのチャットに進む
          </button>
        </div>
      )}
    </div>
  );
}
