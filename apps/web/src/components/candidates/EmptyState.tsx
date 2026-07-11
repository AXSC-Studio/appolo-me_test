// spec: specs/002-candidate-extraction.md § Screen / EmptyState
// ガイダンステキスト + 「出張条件を再入力する」ボタン

import { useNavigate } from "react-router-dom";
import { SearchX } from "lucide-react";

type Props = { guidance: string };

export function EmptyState({ guidance }: Props) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
        <SearchX className="w-8 h-8 text-gray-300" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-extrabold text-brand-dark">候補者が見つかりませんでした</p>
        <p className="text-xs text-gray-400 max-w-xs">{guidance}</p>
      </div>
      <button
        type="button"
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-brand-orange text-white text-sm font-extrabold rounded-full cursor-pointer hover:bg-brand-orange/90 transition-all"
      >
        出張条件を再入力する
      </button>
    </div>
  );
}
