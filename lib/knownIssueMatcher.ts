// lib/knownIssueMatcher.ts
// Match extracted vehicle details to source-backed inspection priorities.
// Known issues are not confirmed faults for a specific listing.

import { knownIssues } from "@/data/knownIssues";
import { KnownIssue, VehicleInput } from "./types";

export function findKnownIssues(vehicle: VehicleInput): KnownIssue[] {
  if (isUnknown(vehicle.make) || isUnknown(vehicle.model)) {
    return [];
  }

  const matchedIssues = knownIssues.filter((issue) => {
    const makeMatches = normalise(issue.make) === normalise(vehicle.make);
    const modelMatches = normalise(issue.model) === normalise(vehicle.model);

    if (!makeMatches || !modelMatches) {
      return false;
    }

    if (vehicle.year !== null) {
      const yearMatches =
        vehicle.year >= issue.yearFrom && vehicle.year <= issue.yearTo;

      if (!yearMatches) {
        return false;
      }
    }

    const fuelMatches = matchesOptionalCondition(
      vehicle.fuelType,
      issue.appliesToFuelTypes
    );

    const transmissionMatches = matchesOptionalCondition(
      vehicle.transmission,
      issue.appliesToTransmissions
    );

    const bodyStyleMatches = matchesOptionalCondition(
      vehicle.bodyStyle,
      issue.appliesToBodyStyles
    );

    return fuelMatches && transmissionMatches && bodyStyleMatches;
  });

  return sortKnownIssues(matchedIssues);
}

function matchesOptionalCondition(
  vehicleValue: string,
  allowedValues?: string[]
): boolean {
  if (!allowedValues || allowedValues.length === 0) {
    return true;
  }

  const normalisedVehicleValue = normalise(vehicleValue);

  // If listing does not clearly mention fuel/transmission/body style,
  // keep the item as a cautious inspection priority.
  if (normalisedVehicleValue === "unknown" || normalisedVehicleValue === "") {
    return true;
  }

  return allowedValues.some((allowedValue) => {
    return normalise(allowedValue) === normalisedVehicleValue;
  });
}

function sortKnownIssues(issues: KnownIssue[]): KnownIssue[] {
  const severityWeight = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const confidenceWeight = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  return [...issues].sort((a, b) => {
    const severityDiff = severityWeight[b.severity] - severityWeight[a.severity];

    if (severityDiff !== 0) {
      return severityDiff;
    }

    return confidenceWeight[b.confidence] - confidenceWeight[a.confidence];
  });
}

function isUnknown(value: string): boolean {
  return value.trim().length === 0 || normalise(value) === "unknown";
}

function normalise(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
}
