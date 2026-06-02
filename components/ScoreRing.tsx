import { ConfidenceBand } from "@/lib/types";

type ScoreRingProps = {
  score: number;
  band: ConfidenceBand;
};

export default function ScoreRing({ score, band }: ScoreRingProps) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Math.max(0, Math.min(score, 100));
  const dashOffset = circumference - (safeScore / 100) * circumference;
  const ringColor = getRingColor(band);

  return (
    <div className="relative h-40 w-40">
      <svg className="h-40 w-40 -rotate-90" viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="12"
          fill="none"
        />

        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke={ringColor}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-4xl font-bold text-white">
          {safeScore}
        </p>
        <p className="text-sm font-medium text-slate-300">/100</p>
      </div>
    </div>
  );
}

export function getBandClassName(confidenceBand: ConfidenceBand): string {
  if (confidenceBand === "Strong Candidate") {
    return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300";
  }

  if (confidenceBand === "Good but Check") {
    return "bg-lime-100 text-lime-800 ring-1 ring-lime-300";
  }

  if (confidenceBand === "Caution") {
    return "bg-amber-100 text-amber-800 ring-1 ring-amber-300";
  }

  if (confidenceBand === "High Caution") {
    return "bg-orange-100 text-orange-800 ring-1 ring-orange-300";
  }

  return "bg-red-100 text-red-800 ring-1 ring-red-300";
}

function getRingColor(confidenceBand: ConfidenceBand): string {
  if (confidenceBand === "Strong Candidate") {
    return "#10B981";
  }

  if (confidenceBand === "Good but Check") {
    return "#65A30D";
  }

  if (confidenceBand === "Caution") {
    return "#F59E0B";
  }

  if (confidenceBand === "High Caution") {
    return "#F97316";
  }

  return "#EF4444";
}
