// spec: specs/001-trip-condition-input.md § レイアウト - ヘッダー

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-xl mx-auto px-5 h-14 flex items-center justify-between">
        <span className="font-extrabold text-brand-dark text-lg tracking-tight">
          appolo.me
        </span>
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all text-gray-400"
          aria-label="メニュー"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </header>
  );
}
