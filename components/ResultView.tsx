// components/ResultView.tsx

import ScoreRing from "@/components/ScoreRing";
import VehicleSummaryCard from "@/components/VehicleSummaryCard";
import { KnownIssue, RiskResult, VehicleInput } from "@/lib/types";

type ResultViewProps = {
  vehicle: VehicleInput;
  riskResult: RiskResult;
  matchedIssues: KnownIssue[];
  onStartOver: () => void;
};

export default function ResultView({
  vehicle,
  riskResult,
  matchedIssues,
  onStartOver,
}: ResultViewProps) {
  const scoreTone = getScoreTone(riskResult.buyingConfidenceScore);
  const visibleReasons = riskResult.topReasons.slice(0, 4);
  const visibleSteps = riskResult.nextSteps.slice(0, 3);
  const visibleIssues = matchedIssues.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 text-slate-950 sm:px-6">
      <section className="mx-auto max-w-5xl">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <VehicleSummaryCard vehicle={vehicle} compact />

          <button
            type="button"
            onClick={onStartOver}
            className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Start over
          </button>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex justify-center sm:block">
              <ScoreRing
                score={riskResult.buyingConfidenceScore}
                band={riskResult.confidenceBand}
              />
            </div>

            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Buying Confidence Score
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                  {riskResult.buyingConfidenceScore}/100
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${scoreTone.badge}`}
                >
                  {riskResult.confidenceBand}
                </span>
              </div>

              <p className="mt-2 text-lg font-semibold text-slate-800">
                {riskResult.recommendation}
              </p>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                {riskResult.summary}
              </p>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                Based on your selected budget range and the information
                available in the listing.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50">
            <h2 className="text-sm font-bold text-slate-950">
              Why this score
            </h2>

            <ul className="mt-3 space-y-2">
              {visibleReasons.map((reason) => (
                <li
                  key={reason}
                  className="flex gap-2 text-sm leading-5 text-slate-600"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50">
            <h2 className="text-sm font-bold text-slate-950">Next steps</h2>

            <ol className="mt-3 space-y-2">
              {visibleSteps.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-2 text-sm leading-5 text-slate-600"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-bold text-sky-700 ring-1 ring-sky-100">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {matchedIssues.length > 0 && (
          <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-950">
                  Inspection priorities
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Matched to this model. Treat as inspection prompts.
                </p>
              </div>
            </div>

            <div className="mt-3 grid gap-2 md:grid-cols-3">
              {visibleIssues.map((issue) => (
                <article
                  key={issue.id}
                  className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                      {issue.area}
                    </p>

                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                      {issue.severity}
                    </span>
                  </div>

                  <h3 className="mt-1 text-sm font-semibold text-slate-900">
                    {issue.issue}
                  </h3>

                  {issue.howToInspect.length > 0 && (
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {issue.howToInspect[0]}
                    </p>
                  )}
                </article>
              ))}
            </div>

            {matchedIssues.length > visibleIssues.length && (
              <p className="mt-3 text-xs text-slate-500">
                Plus {matchedIssues.length - visibleIssues.length} more in the
                detailed report.
              </p>
            )}
          </section>
        )}

        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50">
          <details>
            <summary className="cursor-pointer text-sm font-bold text-slate-950">
              Detailed report
            </summary>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <DetailList
                title="Missing info"
                items={riskResult.missingInformation}
                emptyText="No major missing info detected."
              />

              <DetailList
                title="Seller red flags"
                items={riskResult.sellerRedFlags}
                emptyText="No major seller red flags detected."
              />

              <DetailList
                title="Verification checks"
                items={riskResult.requiredVerificationChecks}
                emptyText="No verification checks available."
              />

              <DetailList
                title="Known issue notes"
                items={riskResult.knownIssueWarnings}
                emptyText="No model-specific inspection notes matched this listing."
              />
            </div>

            {matchedIssues.length > 0 && (
              <KnownIssueDetails issues={matchedIssues} />
            )}
          </details>
        </section>
      </section>
    </main>
  );
}

type DetailListProps = {
  title: string;
  items: string[];
  emptyText: string;
};

function DetailList({ title, items, emptyText }: DetailListProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3">
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>

      {items.length > 0 ? (
        <ul className="mt-2 space-y-1.5">
          {items.map((item) => (
            <li key={item} className="text-xs leading-5 text-slate-600">
              • {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs leading-5 text-slate-500">{emptyText}</p>
      )}
    </section>
  );
}

function KnownIssueDetails({ issues }: { issues: KnownIssue[] }) {
  return (
    <section className="mt-3 rounded-xl border border-slate-200 bg-[#F8FAFC] p-3">
      <h3 className="text-sm font-bold text-slate-900">
        Matched inspection notes
      </h3>

      <div className="mt-2 grid gap-2">
        {issues.map((issue) => (
          <article key={issue.id} className="rounded-lg bg-white p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                {issue.area}
              </span>
              <span className="rounded-full bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                {issue.severity}
              </span>
            </div>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {issue.issue}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {issue.whyItMatters}
            </p>

            {issue.howToInspect.length > 0 && (
              <ul className="mt-2 space-y-1">
                {issue.howToInspect.slice(0, 2).map((check) => (
                  <li key={check} className="text-xs leading-5 text-slate-600">
                    • {check}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function getScoreTone(score: number) {
  if (score >= 81) {
    return {
      badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    };
  }

  if (score >= 66) {
    return {
      badge: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
    };
  }

  if (score >= 46) {
    return {
      badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    };
  }

  if (score >= 31) {
    return {
      badge: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
    };
  }

  return {
    badge: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  };
}
