// spec: specs/001-trip-condition-input.md § BottomNav
// spec: specs/004-app-shell-integration.md § BottomNav
// useNavigate + useLocation でアクティブ状態管理。

import { useNavigate, useLocation } from "react-router-dom";

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isTripActive = pathname === "/" || pathname === "/candidates";
  const isChatActive = pathname === "/chat";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-lg border-t border-gray-100 py-3.5 px-6 shadow-[0_-8px_30px_rgba(0,0,0,0.03)]">
      <div className="max-w-md mx-auto flex justify-around items-center">
        <button
          type="button"
          onClick={() => navigate("/")}
          className={[
            "flex flex-col items-center space-y-1.5 py-1 px-4 rounded-xl transition-all cursor-pointer",
            isTripActive ? "text-brand-orange" : "text-gray-400 hover:text-gray-600",
          ].join(" ")}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-1 .1-1.3.5l-.4.6c-.4.6-.2 1.4.4 1.7L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.4 5.8c.3.6 1.1.8 1.7.4l.6-.4c.4-.3.6-.8.5-1.3Z" />
          </svg>
          <span className="text-[11px] font-bold">出張の管理</span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/chat")}
          className={[
            "flex flex-col items-center space-y-1.5 py-1 px-4 rounded-xl transition-all cursor-pointer",
            isChatActive ? "text-brand-orange" : "text-gray-400 hover:text-gray-600",
          ].join(" ")}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
          </svg>
          <span className="text-[11px] font-bold">ゲストとのやりとり</span>
        </button>
      </div>
    </div>
  );
}
