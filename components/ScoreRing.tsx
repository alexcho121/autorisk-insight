import { ConfidenceBand } from "@/lib/types";

type ScoreRingProps = {
  score: number;
  band: ConfidenceBand;
};

export default function ScoreRing({ score, band }: ScoreRingProps) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Math.max(0, Math.min(score, 100));
  const dashOffset = circumference - (safeScore / 100) * circumference;
  const ringColor = getRingColor(band);

  return (
    <div className="relative h-32 w-32">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128">
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="#E5EDF5"
          strokeWidth="10"
          fill="none"
        />

        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke={ringColor}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-3xl font-bold text-slate-950">{safeScore}</p>
        <p className="text-xs font-medium text-slate-500">/100</p>
      </div>
    </div>
  );
}

export function getBandClassName(confidenceBand: ConfidenceBand): string {
  if (confidenceBand === "Strong Candidate") {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  }

  if (confidenceBand === "Good but Check") {
    return "bg-sky-50 text-sky-700 ring-1 ring-sky-200";
  }

  if (confidenceBand === "Caution") {
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  }

  if (confidenceBand === "High Caution") {
    return "bg-orange-50 text-orange-700 ring-1 ring-orange-200";
  }

  return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
}

function getRingColor(confidenceBand: ConfidenceBand): string {
  if (confidenceBand === "Strong Candidate") {
    return "#10B981";
  }

  if (confidenceBand === "Good but Check") {
    return "#0EA5E9";
  }

  if (confidenceBand === "Caution") {
    return "#F59E0B";
  }

  if (confidenceBand === "High Caution") {
    return "#F97316";
  }

  return "#FB7185";
}
