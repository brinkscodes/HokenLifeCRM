export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#92FE9D" />
          <stop offset="100%" stopColor="#00C9FF" />
        </linearGradient>
        <linearGradient id="brand-gradient-subtle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#92FE9D" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00C9FF" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Abstract geometric H */}
      <rect x="4" y="4" width="32" height="32" rx="8" fill="url(#brand-gradient)" opacity="0.15" />
      <path
        d="M12 10V30M28 10V30M12 20H28"
        stroke="url(#brand-gradient)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Accent dots */}
      <circle cx="12" cy="10" r="2" fill="url(#brand-gradient)" />
      <circle cx="28" cy="10" r="2" fill="url(#brand-gradient)" />
    </svg>
  );
}

export function LogoWithText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Logo />
      <span className="text-lg font-bold tracking-tight">
        Hoken<span className="bg-gradient-to-r from-[#92FE9D] to-[#00C9FF] bg-clip-text text-transparent">Life</span>
        <span className="ml-1 text-xs font-medium text-muted-foreground">CRM</span>
      </span>
    </div>
  );
}
