import { describe, expect, it } from "vitest";

import { extractEvidenceFallback } from "./evidenceExtractor";
import { reconcileEvidenceWithVehicle } from "./evidenceReconciliation";
import { extractListingFallback } from "./fallbackExtractor";
import { analyseQuickRisk } from "./riskEngine";
import { ListingEvidence, VehicleInput } from "./types";

describe("reconcileEvidenceWithVehicle", () => {
  it("removes stale service-history evidence after a manual correction", () => {
    const evidence: ListingEvidence = {
      positiveSignals: [],
      riskSignals: [
        {
          category: "service_history",
          evidenceText: "No service history mentioned.",
          severity: "medium",
          explanation:
            "The listing suggests there may be no clear service history.",
        },
      ],
      missingInformation: ["Service history is not clearly mentioned."],
      sellerClaims: [],
    };

    const editedVehicle = buildVehicle({
      serviceHistoryStatus: "Full service history mentioned",
      extractionMethod: "manual",
    });

    const reconciled = reconcileEvidenceWithVehicle(evidence, editedVehicle);
    const result = analyseQuickRisk(editedVehicle, [], evidence);

    expect(reconciled.riskSignals).toHaveLength(0);
    expect(reconciled.missingInformation).not.toContain(
      "Service history is not clearly mentioned."
    );
    expect(result.riskReasons).not.toContain(
      "The listing suggests there may be no clear service history."
    );
    expect(result.missingInformation).not.toContain(
      "Service history is not clearly mentioned."
    );
    expect(result.topReasons).toContain("Full service history is mentioned.");
  });

  it("keeps negative rego evidence when no rego is merely mentioned", () => {
    const text = "2009 Toyota Corolla no rego, urgent sale.";
    const vehicle = extractListingFallback(text);
    const evidence = extractEvidenceFallback(text);

    const reconciled = reconcileEvidenceWithVehicle(evidence, vehicle);

    expect(vehicle.regoMentioned).toBe(true);
    expect(reconciled.riskSignals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: "rego",
          evidenceText: "No rego or expired rego is mentioned.",
        }),
      ])
    );
  });
});

function buildVehicle(overrides: Partial<VehicleInput> = {}): VehicleInput {
  const text =
    "2014 Toyota Corolla, 135000 km, full service history, rego, RWC supplied.";

  return {
    make: "Toyota",
    model: "Corolla",
    year: 2014,
    mileage: 135000,
    price: 9200,
    transmission: "Automatic",
    fuelType: "Petrol",
    bodyStyle: "Hatchback",
    sellerType: "Private seller",
    serviceHistoryStatus: "Service history mentioned",
    regoMentioned: true,
    sellerDescription: text,
    rawListingText: text,
    extractionMethod: "fallback",
    ...overrides,
  };
}
