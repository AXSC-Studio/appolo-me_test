// spec: specs/001-trip-condition-input.md § Screen / External Design
// フォーム状態管理はuseTripConditionDraftContext経由。UIのみ責務。

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Target } from "lucide-react";
import { useTripConditionDraftContext } from "../../context/TripConditionDraftContext";
import { JAPAN_DESTINATIONS } from "../../constants/japan-destinations";
import { ValidationErrors } from "./ValidationErrors";
import { TripCalendar } from "./TripCalendar";
import type { PurposeType } from "../../types/trip-conditions";

const PURPOSE_OPTIONS: { type: PurposeType; label: string; sub: string; category: string }[] = [
  { type: "STARTUP_FUNDING", label: "資金調達・アライアンス探索", sub: "スタートアップ / 投資家面談", category: "BUSINESS" },
  { type: "SAAS_SALES", label: "SaaS新規開拓・地方営業", sub: "法人営業 / デモ商談", category: "SALES" },
  { type: "DX_ALLIANCE", label: "製造DX推進・協業面談", sub: "製造業 / パートナー開拓", category: "PARTNER" },
  { type: "CUSTOM", label: "AI推薦目的", sub: "目的をAIが分析して最適化", category: "AI RECOMMENDED" },
];

export function TripConditionForm() {
  const navigate = useNavigate();
  const {
    draft,
    setToLocation,
    setPurposeType,
    setStartDate,
    setEndDate,
    confirm,
  } = useTripConditionDraftContext();

  useEffect(() => {
    if (draft.formStatus === "confirmed") {
      navigate("/candidates");
    }
  }, [draft.formStatus, navigate]);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
      {/* ① 出張先ドロップダウン */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-[10px] font-bold text-brand-orange tracking-widest uppercase">
          <MapPin className="w-3 h-3" />
          DESTINATION (出張先)
        </label>
        <select
          value={draft.toLocation}
          onChange={(e) => setToLocation(e.target.value)}
          className="w-full bg-brand-light border border-gray-100 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-orange transition-all cursor-pointer appearance-none"
        >
          <option value="">出張先を選択</option>
          {JAPAN_DESTINATIONS.map((dest) => (
            <option key={dest} value={dest}>{dest}</option>
          ))}
        </select>
      </div>

      {/* ② 出張目的グリッド */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
          <Target className="w-3 h-3" />
          出張の目的 (AIマッチングの基準)
        </label>
        <div className="space-y-2">
          {PURPOSE_OPTIONS.map((opt) => {
            const isSelected = draft.purposeType === opt.type;
            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => setPurposeType(opt.type)}
                className={[
                  "w-full text-left px-4 py-3 rounded-xl border-2 transition-all cursor-pointer",
                  isSelected
                    ? "border-brand-orange bg-brand-accent"
                    : "border-gray-100 bg-brand-light hover:border-gray-200",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold text-brand-dark">{opt.label}</p>
                    <p className="text-[10px] text-gray-400">{opt.sub}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-brand-orange bg-brand-accent px-1.5 py-0.5 rounded-full">
                      {opt.category}
                    </span>
                    {isSelected && (
                      <svg className="w-4 h-4 text-brand-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ③ カレンダー */}
      <TripCalendar
        startDate={draft.startDate}
        endDate={draft.endDate}
        onSelectStart={setStartDate}
        onSelectEnd={setEndDate}
      />

      {/* バリデーションエラー */}
      {draft.formStatus === "error" && (
        <ValidationErrors errors={draft.validationErrors} draft={draft} />
      )}

      {/* ④ 確定ボタン */}
      <button
        type="button"
        onClick={confirm}
        className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-extrabold text-sm py-4 rounded-full cursor-pointer transition-all shadow-[0_8px_24px_rgba(255,126,71,0.3)]"
      >
        AIマッチングを開始する
      </button>
    </div>
  );
}
