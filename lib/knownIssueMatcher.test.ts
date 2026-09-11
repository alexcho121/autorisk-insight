import { describe, expect, it } from "vitest";

import { findKnownIssues } from "./knownIssueMatcher";
import { VehicleInput } from "./types";

describe("findKnownIssues", () => {
  it("matches source-backed issues for a known Corolla generation", () => {
    const issues = findKnownIssues(buildVehicle());

    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].make).toBe("Toyota");
    expect(issues[0].model).toBe("Corolla");
  });

  it("keeps transmission-specific CVT issues when CVT is detected", () => {
    const issues = findKnownIssues(
      buildVehicle({
        make: "Honda",
        model: "Jazz",
        year: 2006,
        transmission: "CVT",
      })
    );

    expect(issues.some((issue) => issue.id.includes("cvt"))).toBe(true);
  });
});

function buildVehicle(overrides: Partial<VehicleInput> = {}): VehicleInput {
  return {
    make: "Toyota",
    model: "Corolla",
    year: 2010,
    mileage: 150000,
    price: 7500,
    transmission: "Automatic",
    fuelType: "Petrol",
    bodyStyle: "Hatchback",
    sellerType: "Private seller",
    serviceHistoryStatus: "Service history mentioned",
    regoMentioned: true,
    sellerDescription: "",
    rawListingText: "",
    extractionMethod: "fallback",
    ...overrides,
  };
}
