import { ChangeEvent } from "react";
import BrandMark from "@/components/BrandMark";

type InputViewProps = {
  rawListingText: string;
  onListingTextChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onAnalyseClick: () => void;
};

export default function InputView({
  rawListingText,
  onListingTextChange,
  onAnalyseClick,
}: InputViewProps) {
  return (
    <main className="min-h-screen bg-[#EEF1F4] px-4 py-6 text-slate-900 sm:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl flex-col justify-center">
        <div className="mb-7 text-center">
          <BrandMark />

          <h1 className="mt-6 text-3xl font-bold text-[#101820] sm:text-4xl">
            Before you inspect the car, inspect the listing first.
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Paste a used-car ad to check the basics, missing details, seller
            signals, and model-specific inspection priorities before you book a
            viewing.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-lg border border-slate-300 bg-white p-3 shadow-sm">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-14 h-52 w-52 text-slate-200"
            viewBox="0 0 220 220"
            fill="none"
          >
            <path
              d="M34 146a78 78 0 0 1 152 0"
              stroke="currentColor"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              d="M110 146l45-55"
              stroke="#CBD5E1"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M42 176h136"
              stroke="#E2E8F0"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="18 14"
            />
          </svg>

          <textarea
            className="relative max-h-[280px] min-h-[112px] w-full resize-none overflow-y-auto rounded-md border border-slate-300 bg-[#F8FAFC] p-4 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#101820] focus:bg-white focus:ring-4 focus:ring-slate-900/5"
            placeholder="Paste the full used-car listing here..."
            value={rawListingText}
            onChange={onListingTextChange}
          />

          <div className="relative mt-2 flex flex-col gap-3 border-t border-slate-200 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-500">
              Early screening only. Confirm PPSR, rego, recall status, and
              inspection before buying.
            </p>

            <button
              type="button"
              onClick={onAnalyseClick}
              className="rounded-md bg-[#101820] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#182536]"
            >
              Check This Listing
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
