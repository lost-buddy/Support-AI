export const BrandMark = ({ className = "", title = "SupportAI" }) => (
  <svg className={className} viewBox="0 0 40 40" role="img" aria-label={title} fill="none">
    <rect x="2" y="2" width="36" height="36" rx="11" className="brand-mark-bg" />
    <path d="M11 13.5c0-1.38 1.12-2.5 2.5-2.5h13c1.38 0 2.5 1.12 2.5 2.5v9c0 1.38-1.12 2.5-2.5 2.5h-6l-5.5 4v-4h-1.5A2.5 2.5 0 0 1 11 22.5v-9Z" className="brand-mark-line" strokeWidth="2" strokeLinejoin="round" />
    <path d="M16 17h8M16 21h5" className="brand-mark-line" strokeWidth="2" strokeLinecap="round" />
    <path d="M26.5 25.5h1A2.5 2.5 0 0 0 30 23v-2" className="brand-mark-spark" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const Brand = ({ compact = false }) => (
  <div className={`brand-lockup ${compact ? "brand-lockup-compact" : ""}`}>
    <BrandMark className="brand-mark" />
    {!compact && <span className="brand-wordmark">Support<span>AI</span></span>}
  </div>
);
