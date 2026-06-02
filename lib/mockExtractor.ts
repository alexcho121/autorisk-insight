
// 판매글 원문을 VehicleInput 형태로 바꾸는 파일

import { VehicleInput } from "./types";

// rawText라는 문자열을 받아서 VehicleInput 객체를 반환
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
    regoMentioned: lowerText.includes("rego"),
    sellerDescription: rawText,
    rawListingText: rawText,
    extractionMethod: "mock",
  };
}

function detectMake(text: string): string {
  const makes = ["Toyota", "Mazda", "Hyundai", "Honda", "Kia", "Nissan", "Ford"];

  for (let i = 0; i < makes.length; i++) {
    if (text.toLowerCase().includes(makes[i].toLowerCase())) {
      return makes[i];
    }
  }

  return "Unknown";
}

function detectModel(text: string): string {
  const models = [
    "Corolla",
    "Yaris",
    "Camry",
    "Mazda 2",
    "Mazda 3",
    "i30",
    "Getz",
    "Civic",
    "Jazz",
    "Cerato",
    "Rio",
  ];

  for (let i = 0; i < models.length; i++) {
    if (text.toLowerCase().includes(models[i].toLowerCase())) {
      return models[i];
    }
  }

  return "Unknown";
}

function detectYear(text: string): number | null {
  const match = text.match(/\b(200[0-9]|201[0-9]|202[0-6])\b/);

  if (!match) {
    return null;
  }

  return Number(match[0]);
}

function detectMileage(text: string): number | null {
  const match = text.match(/([0-9]{1,3}(?:,[0-9]{3})?|[0-9]{5,6})\s?(km|kms|kilometres)/i);

  if (!match) {
    return null;
  }

  return Number(match[1].replace(",", ""));
}

function detectPrice(text: string): number | null {
  const match = text.match(/\$?\s?([0-9]{1,3}(?:,[0-9]{3})|[0-9]{4,5})/);

  if (!match) {
    return null;
  }

  return Number(match[1].replace(",", ""));
}

function detectTransmission(lowerText: string): string {
  if (lowerText.includes("automatic") || lowerText.includes("auto")) {
    return "Automatic";
  }

  if (lowerText.includes("manual")) {
    return "Manual";
  }

  return "Unknown";
}

function detectServiceHistory(lowerText: string): string {
  if (lowerText.includes("full service history") || lowerText.includes("logbook")) {
    return "Full service history mentioned";
  }

  if (lowerText.includes("service history")) {
    return "Service history mentioned";
  }

  return "Not mentioned";
}
function detectFuelType(lowerText: string): string {
  if (lowerText.includes("diesel")) {
    return "Diesel";
  }

  if (lowerText.includes("hybrid")) {
    return "Hybrid";
  }

  if (lowerText.includes("electric") || lowerText.includes("ev")) {
    return "Electric";
  }

  if (lowerText.includes("petrol") || lowerText.includes("gasoline")) {
    return "Petrol";
  }

  return "Unknown";
}

function detectBodyStyle(lowerText: string): string {
  if (lowerText.includes("hatchback") || lowerText.includes("hatch")) {
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