type BrandMarkProps = {
  compact?: boolean;
};

export default function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div className="inline-flex items-center gap-2.5">
      <svg
        aria-hidden="true"
        className="h-9 w-9 shrink-0"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="48" rx="8" fill="#101820" />
        <path
          d="M13 30a11 11 0 0 1 22 0"
          stroke="#F8FAFC"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M16.5 29.5h15"
          stroke="#334155"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M24 29l7-8"
          stroke="#F59E0B"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="24" cy="30" r="3" fill="#F8FAFC" />
        <path
          d="M15 36h18"
          stroke="#22C55E"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      {!compact && (
        <span className="text-base font-bold text-[#101820]">
          AutoRisk Insight
        </span>
      )}
    </div>
  );
}
