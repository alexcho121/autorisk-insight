type BrandMarkProps = {
  compact?: boolean;
};

export default function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div className="inline-flex items-center gap-2.5">
      <svg
        aria-hidden="true"
        className="h-8 w-8 shrink-0"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="48" rx="14" fill="#E0F2FE" />
        <path
          d="M13 30a11 11 0 0 1 22 0"
          stroke="#2563EB"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M16.5 29.5h15"
          stroke="#BAE6FD"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M24 29l7-8"
          stroke="#10B981"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="24" cy="30" r="3" fill="#FFFFFF" />
        <path
          d="M15 36h18"
          stroke="#F59E0B"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      {!compact && (
        <span className="text-base font-bold text-slate-950">
          AutoRisk Insight
        </span>
      )}
    </div>
  );
}
