import { ChangeEvent } from "react";
import BrandMark from "@/components/BrandMark";
import { BudgetRange } from "@/lib/types";

type InputViewProps = {
  rawListingText: string;
  budgetRange: BudgetRange;
  isExtracting: boolean;
  onBudgetRangeChange: (budgetRange: BudgetRange) => void;
  onListingTextChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onAnalyseClick: () => void;
};

export default function InputView({
  rawListingText,
  budgetRange,
  isExtracting,
  onBudgetRangeChange,
  onListingTextChange,
  onAnalyseClick,
}: InputViewProps) {
  const budgetOptions: { label: string; value: BudgetRange }[] = [
    { label: "Not sure yet", value: "not_sure" },
    { label: "Under $5,000", value: "under_5000" },
    { label: "$5,000 – $8,000", value: "5000_8000" },
    { label: "$8,000 – $11,000", value: "8000_11000" },
    { label: "$11,000 – $15,000", value: "11000_15000" },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 text-slate-950 sm:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-2xl flex-col justify-center">
        <div className="mb-6 text-center">
          <BrandMark />

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Check a used-car listing before you inspect it.
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">
            Paste a listing, choose your budget, and get a quick confidence
            check.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60">
          <div className="mb-4">
            <p className="mb-2 text-sm font-semibold text-slate-800">
              Budget range
            </p>

            <div className="flex flex-wrap gap-2">
              {budgetOptions.map((option) => {
                const isSelected = budgetRange === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onBudgetRangeChange(option.value)}
                    disabled={isExtracting}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                      isSelected
                        ? "border-sky-600 bg-sky-600 text-white shadow-sm"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <textarea
            className="max-h-[240px] min-h-[128px] w-full resize-none overflow-y-auto rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-70"
            placeholder="Paste the car listing here..."
            value={rawListingText}
            onChange={onListingTextChange}
            disabled={isExtracting}
          />

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-500">
              Early screening only. Confirm PPSR, rego and inspection before
              buying.
            </p>

            <button
              type="button"
              onClick={onAnalyseClick}
              disabled={isExtracting}
              className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isExtracting ? "Reading listing..." : "Check listing"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
