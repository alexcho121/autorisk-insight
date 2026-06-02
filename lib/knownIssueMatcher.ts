
// matcher는 knownissues.ts에서 조건에 맞는 항목만 찾아서
// 맞는 inspection prioirity 목록을 반환

import { knownIssues } from "@/data/knownIssues";
import { KnownIssue, VehicleInput } from "./types";

export function findKnownIssues(vehicle: VehicleInput): KnownIssue[] {  //vehicle input을 받아서 knownIssue[]를 반환.
  if (!vehicle.year) {
    return [];
  }

  return knownIssues.filter((issue) => {
    const makeMatches = normalise(issue.make) === normalise(vehicle.make);  // nomalise-대소문자 같게 판단
    const modelMatches = isModelMatch(vehicle.model, issue.model);

    const yearMatches =
      vehicle.year !== null &&
      vehicle.year >= issue.yearFrom &&
      vehicle.year <= issue.yearTo;

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

    return (
      makeMatches &&
      modelMatches &&
      yearMatches &&
      fuelMatches &&
      transmissionMatches &&
      bodyStyleMatches
    );
  });
}

function normalise(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function isModelMatch(vehicleModel: string, issueModel: string): boolean {
  const normalisedVehicleModel = normalise(vehicleModel);
  const normalisedIssueModel = normalise(issueModel);

  if (normalisedVehicleModel === "unknown") {
    return false;
  }

  if (normalisedVehicleModel === normalisedIssueModel) {
    return true;
  }

  if (normalisedVehicleModel.includes(normalisedIssueModel)) {
    return true;
  }

  if (normalisedIssueModel.includes(normalisedVehicleModel)) {
    return true;
  }

  return false;
}

function matchesOptionalCondition(
  vehicleValue: string,
  allowedValues?: string[]
): boolean {
  if (!allowedValues || allowedValues.length === 0) {
    return true;
  }

  const normalisedVehicleValue = normalise(vehicleValue);

  if (normalisedVehicleValue === "unknown") {
    return allowedValues.some((allowedValue) => {
      return normalise(allowedValue) === "unknown";
    });
  }

  return allowedValues.some((allowedValue) => {
    return normalise(allowedValue) === normalisedVehicleValue;
  });
}