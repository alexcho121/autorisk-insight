import BrandMark from "@/components/BrandMark";
import ScoreRing, { getBandClassName } from "@/components/ScoreRing";
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
  const nextSteps = buildNextSteps(riskResult, matchedIssues);

  return (
    <main className="min-h-screen bg-[#EEF1F4] px-4 py-6 text-slate-900 sm:px-6">
      <section className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <BrandMark />
            <h1 className="mt-4 text-2xl font-bold text-[#101820] sm:text-3xl">
              Buying confidence result
            </h1>
          </div>

          <button
            type="button"
            onClick={onStartOver}
            className="w-fit rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#101820] shadow-sm transition hover:bg-slate-50"
          >
            Check another listing
          </button>
        </div>

        <section className="rounded-lg border border-slate-300 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-lg border border-[#1C2936] bg-[#101820] p-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <p className="text-sm font-medium text-slate-300">
                Buying Confidence Score
              </p>

              <div className="mt-5 flex justify-center">
                <ScoreRing
                  score={riskResult.buyingConfidenceScore}
                  band={riskResult.confidenceBand}
                />
              </div>

              <div className="mt-5 flex justify-center">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBandClassName(
                    riskResult.confidenceBand
                  )}`}
                >
                  {riskResult.confidenceBand}
                </span>
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs font-medium uppercase text-slate-400">
                  Recommendation
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {riskResult.recommendation}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <VehicleSummaryCard vehicle={vehicle} compact />

              <h2 className="mt-5 text-2xl font-bold text-[#101820]">
                {getResultTitle(riskResult)}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {getSummaryText(riskResult)}
              </p>

              <div className="mt-5">
                <h3 className="text-sm font-semibold text-[#101820]">
                  Top next steps
                </h3>

                <ol className="mt-3 grid gap-2">
                  {nextSteps.map((step, index) => (
                    <li
                      key={index}
                      className="flex gap-3 rounded-md border border-slate-300 bg-[#F8FAFC] px-4 py-3 text-sm leading-6 text-slate-700"
                    >
                      <span className="font-semibold text-[#101820]">
                        {index + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-2">
          <details className="rounded-lg border border-slate-300 bg-white p-5 shadow-sm">
            <summary className="cursor-pointer text-base font-bold text-[#101820]">
              View model-specific inspection priorities
            </summary>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              These are inspection priorities, not confirmed faults.
            </p>

            {matchedIssues.length === 0 ? (
              <p className="mt-4 text-sm text-slate-600">
                No model-specific inspection priorities found for this vehicle.
              </p>
            ) : (
              <div className="mt-4 grid gap-3">
                {matchedIssues.map((issue) => (
                  <InspectionPriorityCard key={issue.id} issue={issue} />
                ))}
              </div>
            )}
          </details>

          <details className="rounded-lg border border-slate-300 bg-white p-5 shadow-sm">
            <summary className="cursor-pointer text-base font-bold text-[#101820]">
              View full report details
            </summary>

            <div className="mt-4 grid gap-3">
              <DetailList
                title="Top reasons"
                items={buildTopReasons(riskResult)}
                emptyText="No major reason detected."
              />

              <DetailList
                title="Required checks"
                items={riskResult.requiredVerificationChecks}
                emptyText="No additional verification check detected."
              />

              <DetailList
                title="Seller red flags"
                items={riskResult.sellerRedFlags}
                emptyText="No seller red flags detected."
              />

              <DetailList
                title="Known issue warnings"
                items={riskResult.knownIssueWarnings}
                emptyText="No model-specific warning added."
              />
            </div>
          </details>
        </section>

        <footer className="mt-5 rounded-lg border border-slate-300 bg-white p-5 text-sm leading-6 text-slate-700 shadow-sm">
          This tool is only an early screening assistant. Always check PPSR,
          recall status, rego, service history, and get a mechanic inspection
          before buying.
        </footer>
      </section>
    </main>
  );
}

function InspectionPriorityCard({ issue }: { issue: KnownIssue }) {
  return (
    <article className="rounded-md border border-slate-300 bg-[#F8FAFC] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-[#101820]">{issue.area}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-700">
            {issue.issue}
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
          {issue.severity}
        </span>
      </div>

      <details className="mt-3">
        <summary className="cursor-pointer text-sm font-semibold text-[#101820]">
          Inspection steps
        </summary>

        <p className="mt-3 text-sm leading-6 text-slate-700">
          <strong>Why it matters:</strong> {issue.whyItMatters}
        </p>

        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-[#101820]">
              How to inspect
            </p>

            <ul className="mt-2 list-disc pl-5 text-sm leading-6 text-slate-700">
              {issue.howToInspect.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-[#101820]">
              Seller questions
            </p>

            <ul className="mt-2 list-disc pl-5 text-sm leading-6 text-slate-700">
              {issue.sellerQuestions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 rounded-md border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-600">
          <p>
            <strong>Source:</strong> {issue.sourceName}
          </p>

          <p className="mt-1">
            <strong>Confidence:</strong> {issue.confidence}
          </p>

          <p className="mt-1">
            <strong>Caution:</strong> {issue.wordingCaution}
          </p>
        </div>
      </details>
    </article>
  );
}

function DetailList({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: string[];
  emptyText: string;
}) {
  return (
    <div className="rounded-md border border-slate-300 bg-[#F8FAFC] p-4">
      <h3 className="font-semibold text-[#101820]">{title}</h3>

      {items.length === 0 ? (
        <p className="mt-2 text-sm text-slate-600">{emptyText}</p>
      ) : (
        <ul className="mt-2 list-disc pl-5 text-sm leading-6 text-slate-700">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function buildTopReasons(riskResult: RiskResult): string[] {
  const reasons: string[] = [];

  addUniqueItems(reasons, riskResult.riskReasons);
  addUniqueItems(reasons, riskResult.sellerRedFlags);
  addUniqueItems(reasons, riskResult.missingInformation);

  return reasons.slice(0, 3);
}

function buildNextSteps(
  riskResult: RiskResult,
  matchedIssues: KnownIssue[]
): string[] {
  const steps: string[] = [];

  addUniqueItems(steps, riskResult.requiredVerificationChecks);

  if (riskResult.missingInformation.length > 0) {
    steps.push("Ask the seller to confirm the missing listing details.");
  }

  if (matchedIssues.length > 0) {
    steps.push("Check the model-specific inspection priorities before viewing.");
  }

  if (steps.length === 0) {
    steps.push("Ask for service records and confirm rego status.");
    steps.push("Check PPSR and recall status before buying.");
    steps.push("Book a mechanic inspection before purchase.");
  }

  return removeDuplicateStrings(steps).slice(0, 3);
}

function addUniqueItems(target: string[], source: string[]) {
  for (let i = 0; i < source.length; i++) {
    if (!target.includes(source[i])) {
      target.push(source[i]);
    }
  }
}

function removeDuplicateStrings(items: string[]): string[] {
  const uniqueItems: string[] = [];

  for (let i = 0; i < items.length; i++) {
    if (!uniqueItems.includes(items[i])) {
      uniqueItems.push(items[i]);
    }
  }

  return uniqueItems;
}

function getResultTitle(riskResult: RiskResult): string {
  if (riskResult.buyingConfidenceScore >= 81) {
    return "This listing looks like a strong candidate.";
  }

  if (riskResult.buyingConfidenceScore >= 66) {
    return "This listing looks promising, but still needs checks.";
  }

  if (riskResult.buyingConfidenceScore >= 46) {
    return "This listing needs caution before inspection.";
  }

  if (riskResult.buyingConfidenceScore >= 31) {
    return "This listing needs careful checking first.";
  }

  return "This listing may be better to avoid for now.";
}

function getSummaryText(riskResult: RiskResult): string {
  if (riskResult.buyingConfidenceScore >= 81) {
    return "The available listing information looks relatively strong. Still complete PPSR, recall, service record, and mechanic checks.";
  }

  if (riskResult.buyingConfidenceScore >= 66) {
    return "The listing may be worth checking further, but a few details should be confirmed before booking an inspection.";
  }

  if (riskResult.buyingConfidenceScore >= 46) {
    return "The listing has enough uncertainty that you should ask questions before inspection.";
  }

  if (riskResult.buyingConfidenceScore >= 31) {
    return "The listing has several concerns or missing details. Clarify the key issues before spending time on an inspection.";
  }

  return "The listing has significant risk signals or missing information. It may be better to avoid unless the seller provides strong evidence.";
}
