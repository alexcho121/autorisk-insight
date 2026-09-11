import { VehicleInput } from "./types";

const MIN_VEHICLE_YEAR = 1980;
const MAX_FUTURE_MODEL_YEAR_OFFSET = 1;
const MIN_MILEAGE = 0;
const MAX_MILEAGE = 500000;
const MIN_PRICE = 500;
const MAX_PRICE = 100000;

export function sanitiseVehicleValues(vehicle: VehicleInput): VehicleInput {
  return {
    ...vehicle,
    year: sanitiseYear(vehicle.year),
    mileage: sanitiseMileage(vehicle.mileage),
    price: sanitisePrice(vehicle.price),
  };
}

export function sanitiseYear(year: number | null): number | null {
  if (!isFiniteNumber(year)) {
    return null;
  }

  const roundedYear = Math.round(year);
  const maxYear = new Date().getFullYear() + MAX_FUTURE_MODEL_YEAR_OFFSET;

  if (roundedYear < MIN_VEHICLE_YEAR || roundedYear > maxYear) {
    return null;
  }

  return roundedYear;
}

export function sanitiseMileage(mileage: number | null): number | null {
  if (!isFiniteNumber(mileage)) {
    return null;
  }

  const roundedMileage = Math.round(mileage);

  if (roundedMileage < MIN_MILEAGE || roundedMileage > MAX_MILEAGE) {
    return null;
  }

  return roundedMileage;
}

export function sanitisePrice(price: number | null): number | null {
  if (!isFiniteNumber(price)) {
    return null;
  }

  const roundedPrice = Math.round(price);

  if (roundedPrice < MIN_PRICE || roundedPrice > MAX_PRICE) {
    return null;
  }

  return roundedPrice;
}

function isFiniteNumber(value: number | null): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
