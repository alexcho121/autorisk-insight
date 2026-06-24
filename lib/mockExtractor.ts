// lib/mockExtractor.ts
// OpenAI API가 실패하거나 없을 때 사용하는 fallback extractor입니다.
// 목표: perfect extraction이 아니라, MVP에서 score가 크게 흔들리지 않도록
// year / price / mileage / rego / service history를 최대한 안정적으로 추출합니다.

import { VehicleInput } from "./types";

export function extractListingMock(rawText: string): VehicleInput {
  const lowerText = rawText.toLowerCase();

  return {
    make: detectMake(rawText),
    model: detectModel(rawText),
    year: detectYear(rawText),
    mileage: detectMileage(rawText),
    price: detectPrice(rawText),
    transmission: detectTransmission(lowerText),
    fuelType: detectFuelType(lowerText),
    bodyStyle: detectBodyStyle(lowerText),
    sellerType: detectSellerType(lowerText),
    serviceHistoryStatus: detectServiceHistory(lowerText),
    regoMentioned: detectRegoMentioned(lowerText),
    sellerDescription: rawText,
    rawListingText: rawText,
    extractionMethod: "mock",
  };
}

function detectMake(text: string): string {
  const makes = [
    "Toyota",
    "Mazda",
    "Hyundai",
    "Honda",
    "Kia",
    "Nissan",
    "Ford",
    "Subaru",
    "Mitsubishi",
    "Volkswagen",
    "Suzuki",
  ];

  const lowerText = text.toLowerCase();

  for (let i = 0; i < makes.length; i++) {
    if (lowerText.includes(makes[i].toLowerCase())) {
      return makes[i];
    }
  }

  return "Unknown";
}

function detectModel(text: string): string {
  const modelAliases: { label: string; aliases: string[] }[] = [
    { label: "Corolla", aliases: ["corolla"] },
    { label: "Yaris", aliases: ["yaris"] },
    { label: "Camry", aliases: ["camry"] },
    { label: "Mazda 2", aliases: ["mazda 2", "mazda2"] },
    { label: "Mazda 3", aliases: ["mazda 3", "mazda3"] },
    { label: "i30", aliases: ["i30"] },
    { label: "Getz", aliases: ["getz"] },
    { label: "Civic", aliases: ["civic"] },
    { label: "Jazz", aliases: ["jazz"] },
    { label: "Cerato", aliases: ["cerato"] },
    { label: "Rio", aliases: ["rio"] },
    { label: "Micra", aliases: ["micra"] },
    { label: "Pulsar", aliases: ["pulsar"] },
    { label: "Focus", aliases: ["focus"] },
    { label: "Fiesta", aliases: ["fiesta"] },
    { label: "Impreza", aliases: ["impreza"] },
    { label: "Lancer", aliases: ["lancer"] },
    { label: "Golf", aliases: ["golf"] },
    { label: "Swift", aliases: ["swift"] },
  ];

  const lowerText = text.toLowerCase();

  for (let i = 0; i < modelAliases.length; i++) {
    const model = modelAliases[i];

    for (let j = 0; j < model.aliases.length; j++) {
      if (lowerText.includes(model.aliases[j])) {
        return model.label;
      }
    }
  }

  return "Unknown";
}

function detectYear(text: string): number | null {
  const matches = text.match(/\b(199[5-9]|200[0-9]|201[0-9]|202[0-6])\b/g);

  if (!matches || matches.length === 0) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  const years = matches
    .map((match) => Number(match))
    .filter((year) => year <= currentYear);

  if (years.length === 0) {
    return null;
  }

  // Marketplace text can contain "rego until 2026" before the actual car year.
  // The vehicle build year is usually the oldest plausible year mentioned.
  return Math.min(...years);
}

function detectMileage(text: string): number | null {
  const mileagePatterns = [
    /\b(?:driven|drove|done|travelled|traveled|clocked|covered)\s?(?:around|approx(?:imately)?|about)?\s?([0-9]{1,3}(?:\.[0-9])?)\s?k\b/i,
    /\b(?:driven|drove|done|travelled|traveled|clocked|covered)\s?(?:around|approx(?:imately)?|about)?\s?([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{5,6})\b/i,
    /([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{5,6})\s?(km|kms|kilometres|kilometers)\b/i,
    /\bodo(?:meter)?\s?:?\s?([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{5,6})\b/i,
    /\bmileage\s?:?\s?([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{5,6})\b/i,
    /\b(?:odo(?:meter)?|mileage|kms?|kilometres|kilometers)\s?:?\s?([0-9]{1,3}(?:\.[0-9])?)\s?k\b/i,
    /\b([0-9]{1,3})\s?k\s?(km|kms)\b/i,
  ];

  for (let i = 0; i < mileagePatterns.length; i++) {
    const match = text.match(mileagePatterns[i]);

    if (!match) {
      continue;
    }

    const rawValue = match[1].replace(/,/g, "");
    let mileage = Number(rawValue);

    if (mileagePatterns[i].source.includes("\\s?k")) {
      mileage = mileage * 1000;
    }

    if (mileage >= 1000 && mileage <= 500000) {
      return mileage;
    }
  }

  return null;
}

function detectPrice(text: string): number | null {
  const pricePatterns = [
    /\$\s?([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{4,6})\b/i,
    /\b(price|asking|ono|negotiable)\s?:?\s?\$?\s?([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{4,6})\b/i,
  ];

  for (let i = 0; i < pricePatterns.length; i++) {
    const match = text.match(pricePatterns[i]);

    if (!match) {
      continue;
    }

    const value = match[2] ?? match[1];
    const price = Number(value.replace(/,/g, ""));

    if (price >= 500 && price <= 100000) {
      return price;
    }
  }

  const shortPriceMatch = text.match(/\b([0-9]{1,2}(?:\.[0-9])?)\s?k\b/i);

  if (shortPriceMatch) {
    const price = Math.round(Number(shortPriceMatch[1]) * 1000);

    if (price >= 500 && price <= 100000) {
      return price;
    }
  }

  return null;
}

function detectTransmission(lowerText: string): string {
  if (
    lowerText.includes("automatic") ||
    lowerText.includes(" auto ") ||
    lowerText.includes(" auto,") ||
    lowerText.includes(" auto.") ||
    lowerText.includes(" auto\n")
  ) {
    return "Automatic";
  }

  if (lowerText.includes("manual")) {
    return "Manual";
  }

  if (lowerText.includes("cvt")) {
    return "CVT";
  }

  return "Unknown";
}

function detectFuelType(lowerText: string): string {
  if (lowerText.includes("diesel")) {
    return "Diesel";
  }

  if (lowerText.includes("hybrid")) {
    return "Hybrid";
  }

  if (
    lowerText.includes("electric") ||
    lowerText.includes(" ev ") ||
    lowerText.includes(" ev\n")
  ) {
    return "Electric";
  }

  if (lowerText.includes("petrol") || lowerText.includes("gasoline")) {
    return "Petrol";
  }

  if (lowerText.includes("lpg")) {
    return "LPG";
  }

  return "Unknown";
}

function detectBodyStyle(lowerText: string): string {
  if (lowerText.includes("hatchback") || lowerText.includes(" hatch")) {
    return "Hatchback";
  }

  if (lowerText.includes("sedan")) {
    return "Sedan";
  }

  if (lowerText.includes("wagon")) {
    return "Wagon";
  }

  if (lowerText.includes("suv")) {
    return "SUV";
  }

  if (lowerText.includes("ute")) {
    return "Ute";
  }

  return "Unknown";
}

function detectSellerType(lowerText: string): string {
  if (
    lowerText.includes("dealer") ||
    lowerText.includes("dealership") ||
    lowerText.includes("car yard")
  ) {
    return "Dealer";
  }

  if (
    lowerText.includes("private sale") ||
    lowerText.includes("private seller") ||
    lowerText.includes("selling my car")
  ) {
    return "Private seller";
  }

  return "Unknown";
}

function detectServiceHistory(lowerText: string): string {
  if (
    lowerText.includes("no service history") ||
    lowerText.includes("no logbook") ||
    lowerText.includes("no log book") ||
    lowerText.includes("missing service history")
  ) {
    return "No service history mentioned";
  }

  if (
    lowerText.includes("full service history") ||
    lowerText.includes("complete service history") ||
    lowerText.includes("complete logbook") ||
    lowerText.includes("complete log book") ||
    lowerText.includes("full logbook") ||
    lowerText.includes("full log book") ||
    lowerText.includes("full service records") ||
    lowerText.includes("logbook service") ||
    lowerText.includes("log books") ||
    lowerText.includes("logbooks")
  ) {
    return "Full service history mentioned";
  }

  if (
    lowerText.includes("service history") ||
    lowerText.includes("serviced regularly") ||
    lowerText.includes("regularly serviced") ||
    lowerText.includes("well serviced") ||
    lowerText.includes("servicing up to date") ||
    lowerText.includes("service book") ||
    lowerText.includes("service books") ||
    lowerText.includes("service records") ||
    lowerText.includes("service record") ||
    lowerText.includes("maintenance records") ||
    lowerText.includes("logbook") ||
    lowerText.includes("log book")
  ) {
    return "Service history mentioned";
  }

  return "Not mentioned";
}

function detectRegoMentioned(lowerText: string): boolean {
  if (
    lowerText.includes("no rego") ||
    lowerText.includes("rego expired") ||
    lowerText.includes("expired rego")
  ) {
    return true;
  }

  return (
    lowerText.includes("rego") ||
    lowerText.includes("registration") ||
    lowerText.includes("registered")
  );
}
