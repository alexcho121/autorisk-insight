import { VehicleInput } from "@/lib/types";

type VehicleSummaryCardProps = {
  vehicle: VehicleInput;
  compact?: boolean;
};

export default function VehicleSummaryCard({
  vehicle,
  compact = false,
}: VehicleSummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {!compact && (
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Vehicle
            </p>
          )}

          <h2
            className={`font-bold text-slate-950 ${
              compact ? "text-lg" : "mt-1 text-xl"
            }`}
          >
            {buildVehicleTitle(vehicle)}
          </h2>

          {!compact && (
            <p className="mt-1 text-sm text-slate-500">
              Review the key listing details.
            </p>
          )}
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
            vehicle.regoMentioned
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
          }`}
        >
          {vehicle.regoMentioned ? "Rego listed" : "No rego"}
        </span>
      </div>

      <VehiclePills vehicle={vehicle} />
    </div>
  );
}

export function VehiclePills({ vehicle }: { vehicle: VehicleInput }) {
  const pills = [
    vehicle.mileage ? `${formatNumber(vehicle.mileage)} km` : "Mileage unknown",
    vehicle.transmission || "Transmission unknown",
    vehicle.fuelType || "Fuel unknown",
    vehicle.bodyStyle || "Body style unknown",
    vehicle.price ? formatPrice(vehicle.price) : "Price unknown",
  ];

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {pills.map((pill, index) => (
        <span
          key={index}
          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
        >
          {pill}
        </span>
      ))}
    </div>
  );
}

export function buildVehicleTitle(vehicle: VehicleInput): string {
  const year = vehicle.year ? String(vehicle.year) : "";
  const make = vehicle.make !== "Unknown" ? vehicle.make : "";
  const model = vehicle.model !== "Unknown" ? vehicle.model : "";

  const titleParts = [year, make, model].filter((part) => part.length > 0);

  if (titleParts.length === 0) {
    return "Vehicle details detected";
  }

  return titleParts.join(" ");
}

export function buildVehicleSubtitle(vehicle: VehicleInput): string {
  const subtitleParts: string[] = [];

  if (vehicle.mileage) {
    subtitleParts.push(`${formatNumber(vehicle.mileage)} km`);
  }

  if (vehicle.transmission && vehicle.transmission !== "Unknown") {
    subtitleParts.push(vehicle.transmission);
  }

  if (vehicle.fuelType && vehicle.fuelType !== "Unknown") {
    subtitleParts.push(vehicle.fuelType);
  }

  if (vehicle.bodyStyle && vehicle.bodyStyle !== "Unknown") {
    subtitleParts.push(vehicle.bodyStyle);
  }

  if (vehicle.price) {
    subtitleParts.push(formatPrice(vehicle.price));
  }

  if (subtitleParts.length === 0) {
    return "Review the extracted information below.";
  }

  return subtitleParts.join(" · ");
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-AU").format(value);
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}
