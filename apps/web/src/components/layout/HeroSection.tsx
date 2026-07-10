// spec: specs/001-trip-condition-input.md § レイアウト - ヒーローセクション

export function HeroSection() {
  return (
    <section className="max-w-xl w-full mx-auto px-5 pt-8 pb-2 text-center space-y-2">
      <p className="text-[10px] font-bold text-brand-orange tracking-widest uppercase">
        AI Business Matching
      </p>
      <h1 className="font-extrabold text-brand-dark text-2xl leading-snug">
        出張予定を公開して、
        <br />
        アポイントを獲得
      </h1>
      <p className="text-xs text-gray-400 leading-relaxed">
        出張目的・滞在予定を入力するだけで、
        <br />
        AIが「今会うべき人」を優先順位付きで提案します。
      </p>
    </section>
  );
}
