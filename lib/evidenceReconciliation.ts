import {
  EvidenceCategory,
  EvidenceSignal,
  ListingEvidence,
  VehicleInput,
} from "./types";

const SERVICE_HISTORY_KNOWN_STATUSES = [
  "full service history mentioned",
  "service history mentioned",
];

const SERVICE_HISTORY_NEGATIVE_STATUSES = [
  "no service history mentioned",
  "service history not mentioned",
];

export function reconcileEvidenceWithVehicle(
  evidence: ListingEvidence,
  vehicle: VehicleInput
): ListingEvidence {
  const positiveSignals = uniqueStrings(
    evidence.positiveSignals.filter((signal) => {
      return !positiveSignalContradictsVehicle(signal, vehicle);
    })
  );

  const riskSignals = uniqueRiskSignals(
    evidence.riskSignals.filter((signal) => {
      return !riskSignalContradictsVehicle(signal, vehicle);
    })
  );

  const sellerClaims = uniqueStrings(evidence.sellerClaims);

  const missingInformation = uniqueStrings(
    evidence.missingInformation.filter((item) => {
      return !missingInformationContradictsVehicle(
        item,
        vehicle,
        positiveSignals,
        riskSignals
      );
    })
  );

  return {
    positiveSignals,
    riskSignals,
    missingInformation,
    sellerClaims,
  };
}

function positiveSignalContradictsVehicle(
  signal: string,
  vehicle: VehicleInput
): boolean {
  const lowerSignal = signal.toLowerCase();
  const serviceStatus = normalise(vehicle.serviceHistoryStatus);

  if (
    includesAny(lowerSignal, ["service", "logbook", "log book"]) &&
    SERVICE_HISTORY_NEGATIVE_STATUSES.includes(serviceStatus)
  ) {
    return true;
  }

  if (
    includesAny(lowerSignal, ["rego", "registration", "registered"]) &&
    !vehicle.regoMentioned
  ) {
    return true;
  }

  return false;
}

function riskSignalContradictsVehicle(
  signal: EvidenceSignal,
  vehicle: VehicleInput
): boolean {
  if (signal.category === "service_history") {
    return SERVICE_HISTORY_KNOWN_STATUSES.includes(
      normalise(vehicle.serviceHistoryStatus)
    );
  }

  return false;
}

function missingInformationContradictsVehicle(
  item: string,
  vehicle: VehicleInput,
  positiveSignals: string[],
  riskSignals: EvidenceSignal[]
): boolean {
  const lowerItem = item.toLowerCase();

  if (includesAny(lowerItem, ["mileage", "kilomet"])) {
    return vehicle.mileage !== null;
  }

  if (includesAny(lowerItem, ["price", "asking"])) {
    return vehicle.price !== null;
  }

  if (includesAny(lowerItem, ["year", "model year", "build year"])) {
    return vehicle.year !== null;
  }

  if (includesAny(lowerItem, ["rego", "registration"])) {
    return vehicle.regoMentioned || hasRiskCategory(riskSignals, "rego");
  }

  if (includesAny(lowerItem, ["service", "logbook", "log book"])) {
    return (
      !isUnknownServiceHistory(vehicle.serviceHistoryStatus) ||
      hasPositiveSignal(positiveSignals, ["service", "logbook", "log book"]) ||
      hasRiskCategory(riskSignals, "service_history")
    );
  }

  if (includesAny(lowerItem, ["transmission", "gearbox"])) {
    return !isUnknownText(vehicle.transmission);
  }

  if (lowerItem.includes("fuel")) {
    return !isUnknownText(vehicle.fuelType);
  }

  if (lowerItem.includes("body")) {
    return !isUnknownText(vehicle.bodyStyle);
  }

  if (includesAny(lowerItem, ["rwc", "roadworthy"])) {
    return (
      hasPositiveSignal(positiveSignals, ["rwc", "roadworthy"]) ||
      hasRiskCategory(riskSignals, "rwc")
    );
  }

  return false;
}

function uniqueStrings(items: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i].trim();
    const key = item.toLowerCase();

    if (!item || seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(item);
  }

  return result;
}

function uniqueRiskSignals(signals: EvidenceSignal[]): EvidenceSignal[] {
  const seen = new Set<string>();
  const result: EvidenceSignal[] = [];

  for (let i = 0; i < signals.length; i++) {
    const signal = signals[i];
    const key = `${signal.category}:${signal.evidenceText.toLowerCase()}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(signal);
  }

  return result;
}

function hasPositiveSignal(signals: string[], keywords: string[]): boolean {
  return signals.some((signal) => {
    const lowerSignal = signal.toLowerCase();

    return keywords.some((keyword) => lowerSignal.includes(keyword));
  });
}

function hasRiskCategory(
  signals: EvidenceSignal[],
  category: EvidenceCategory
): boolean {
  return signals.some((signal) => signal.category === category);
}

function isUnknownServiceHistory(value: string): boolean {
  const lowerValue = normalise(value);

  return (
    isUnknownText(value) ||
    SERVICE_HISTORY_NEGATIVE_STATUSES.includes(lowerValue)
  );
}

function isUnknownText(value: string): boolean {
  const lowerValue = normalise(value);

  return (
    lowerValue.length === 0 ||
    lowerValue === "unknown" ||
    lowerValue === "not mentioned" ||
    lowerValue === "unclear"
  );
}

function includesAny(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function normalise(value: string): string {
  return value.trim().toLowerCase();
}
