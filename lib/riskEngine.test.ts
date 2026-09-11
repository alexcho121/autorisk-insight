import { describe, expect, it } from "vitest";

import { analyseQuickRisk } from "./riskEngine";
import { VehicleInput } from "./types";

describe("analyseQuickRisk", () => {
  it("produces a strong risk result for no rego, engine light, and urgency", () => {
    const text = "No rego, engine light on, urgent sale. Drives but selling as is.";
    const result = analyseQuickRisk(
      buildVehicle({
        year: 2008,
        mileage: 265000,
        price: 2200,
        serviceHistoryStatus: "No service history mentioned",
        regoMentioned: true,
        sellerDescription: text,
        rawListingText: text,
      })
    );

    expect(result.buyingConfidenceScore).toBeLessThanOrEqual(40);
    expect(result.recommendation).toMatch(/Avoid|Do Not Proceed Yet/);
    expect(result.sellerRedFlags).toEqual(
      expect.arrayContaining([
        "The listing suggests rego may be missing or expired.",
        "The listing mentions a warning light or engine light.",
        "The seller uses urgency wording, so avoid rushing the decision.",
      ])
    );
  });

  it("scores a cleaner Corolla listing stronger than a risky listing", () => {
    const cleanText =
      "2014 Toyota Corolla, 135000 km, full service history, rego, RWC supplied.";
    const riskyText = "No rego, engine light on, urgent sale.";

    const cleanResult = analyseQuickRisk(
      buildVehicle({
        year: 2014,
        mileage: 135000,
        price: 9200,
        serviceHistoryStatus: "Full service history mentioned",
        regoMentioned: true,
        sellerDescription: cleanText,
        rawListingText: cleanText,
      })
    );

    const riskyResult = analyseQuickRisk(
      buildVehicle({
        year: 2008,
        mileage: 265000,
        price: 2200,
        serviceHistoryStatus: "No service history mentioned",
        regoMentioned: true,
        sellerDescription: riskyText,
        rawListingText: riskyText,
      })
    );

    expect(cleanResult.buyingConfidenceScore).toBeGreaterThan(
      riskyResult.buyingConfidenceScore
    );
    expect(cleanResult.confidenceBand).toMatch(/Strong Candidate|Good but Check/);
  });
});

function buildVehicle(overrides: Partial<VehicleInput>): VehicleInput {
  return {
    make: "Toyota",
    model: "Corolla",
    year: 2012,
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
