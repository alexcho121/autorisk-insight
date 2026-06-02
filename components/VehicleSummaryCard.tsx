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
    <div className="rounded-lg border border-slate-300 bg-[#F8FAFC] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {!compact && (
            <p className="text-xs font-medium uppercase text-slate-500">
              Inspection summary
            </p>
          )}

          <h2 className="mt-1 text-2xl font-bold text-[#101820]">
            {buildVehicleTitle(vehicle)}
          </h2>

          {!compact && (
            <p className="mt-1 text-sm text-slate-600">
              Confirm these listing details before inspecting the vehicle.
            </p>
          )}
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
            vehicle.regoMentioned
              ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200"
              : "bg-slate-200 text-slate-700 ring-1 ring-slate-300"
          }`}
        >
          {vehicle.regoMentioned ? "Rego mentioned" : "Rego not mentioned"}
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
          className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700"
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
