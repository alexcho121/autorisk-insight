import BrandMark from "@/components/BrandMark";
import VehicleSummaryCard from "@/components/VehicleSummaryCard";
import { VehicleInput } from "@/lib/types";

// Review screen for user-corrected extraction details.

type ReviewViewProps = {
  vehicle: VehicleInput;
  onVehicleFieldChange: (
    field: keyof VehicleInput,
    value: string | number | boolean | null
  ) => void;
  onRunRiskScan: () => void;
  onStartOver: () => void;
};

export default function ReviewView({
  vehicle,
  onVehicleFieldChange,
  onRunRiskScan,
  onStartOver,
}: ReviewViewProps) {
  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 text-slate-950 sm:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-4xl flex-col justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <BrandMark />
              <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                Review details
              </h1>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Edit anything that looks off before the check runs.
              </p>
            </div>

            <button
              type="button"
              onClick={onStartOver}
              className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Start over
            </button>
          </div>

          <VehicleSummaryCard vehicle={vehicle} />

          <details className="mt-4 rounded-2xl border border-slate-200 bg-[#F8FAFC]">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-800">
              Edit extracted details
            </summary>

            <div className="border-t border-slate-200 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <TextInput
                  label="Make"
                  value={vehicle.make}
                  onChange={(value) => onVehicleFieldChange("make", value)}
                />

                <TextInput
                  label="Model"
                  value={vehicle.model}
                  onChange={(value) => onVehicleFieldChange("model", value)}
                />

                <NumberInput
                  label="Year"
                  value={vehicle.year}
                  onChange={(value) => onVehicleFieldChange("year", value)}
                />

                <NumberInput
                  label="Mileage"
                  value={vehicle.mileage}
                  onChange={(value) => onVehicleFieldChange("mileage", value)}
                />

                <NumberInput
                  label="Price"
                  value={vehicle.price}
                  onChange={(value) => onVehicleFieldChange("price", value)}
                />

                <TextInput
                  label="Transmission"
                  value={vehicle.transmission}
                  onChange={(value) =>
                    onVehicleFieldChange("transmission", value)
                  }
                />

                <TextInput
                  label="Fuel Type"
                  value={vehicle.fuelType}
                  onChange={(value) => onVehicleFieldChange("fuelType", value)}
                />

                <TextInput
                  label="Body"
                  value={vehicle.bodyStyle}
                  onChange={(value) => onVehicleFieldChange("bodyStyle", value)}
                />

                <TextInput
                  label="Seller"
                  value={vehicle.sellerType}
                  onChange={(value) => onVehicleFieldChange("sellerType", value)}
                />

                <TextInput
                  label="Service"
                  value={vehicle.serviceHistoryStatus}
                  onChange={(value) =>
                    onVehicleFieldChange("serviceHistoryStatus", value)
                  }
                />
              </div>

              <label className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <input
                  type="checkbox"
                  checked={vehicle.regoMentioned}
                  onChange={(event) =>
                    onVehicleFieldChange("regoMentioned", event.target.checked)
                  }
                />

                <span className="text-sm font-medium text-slate-600">
                  Rego mentioned
                </span>
              </label>
            </div>
          </details>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-500">
              Uses your edits and matched inspection priorities.
            </p>

            <button
              type="button"
              onClick={onRunRiskScan}
              className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
            >
              Run check
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      <input
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      <input
        type="number"
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        value={value ?? ""}
        onChange={(event) =>
          onChange(event.target.value === "" ? null : Number(event.target.value))
        }
      />
    </label>
  );
}
