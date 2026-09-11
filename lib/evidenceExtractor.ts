// Deterministic evidence fallback used when OpenAI extraction is unavailable.
// Keep categories stable so riskEngine can avoid duplicate penalties.

import { EvidenceSignal, ListingEvidence } from "./types";

export function extractEvidenceFallback(rawText: string): ListingEvidence {
  const lowerText = rawText.toLowerCase();

  const positiveSignals: string[] = [];
  const riskSignals: EvidenceSignal[] = [];
  const missingInformation: string[] = [];
  const sellerClaims: string[] = [];

  // Service history
  if (
    lowerText.includes("full service history") ||
    lowerText.includes("complete service history") ||
    lowerText.includes("complete logbook") ||
    lowerText.includes("complete log book") ||
    lowerText.includes("full logbook") ||
    lowerText.includes("full log book") ||
    lowerText.includes("full service records")
  ) {
    positiveSignals.push("Full service history is mentioned.");
  } else if (
    lowerText.includes("service history") ||
    lowerText.includes("logbook") ||
    lowerText.includes("log book") ||
    lowerText.includes("service book") ||
    lowerText.includes("service books") ||
    lowerText.includes("serviced regularly") ||
    lowerText.includes("regularly serviced") ||
    lowerText.includes("well serviced") ||
    lowerText.includes("servicing up to date") ||
    lowerText.includes("service records") ||
    lowerText.includes("maintenance records")
  ) {
    positiveSignals.push("Service history is mentioned.");
  } else {
    missingInformation.push("Service history is not clearly mentioned.");
  }

  // Rego
  if (
    lowerText.includes("no rego") ||
    lowerText.includes("rego expired") ||
    lowerText.includes("expired rego")
  ) {
    riskSignals.push({
      category: "rego",
      evidenceText: "No rego or expired rego is mentioned.",
      severity: "medium",
      explanation: "The listing suggests rego may be missing or expired.",
    });
  } else if (
    lowerText.includes("rego") ||
    lowerText.includes("registration") ||
    lowerText.includes("registered")
  ) {
    positiveSignals.push("Rego is mentioned.");
  } else {
    missingInformation.push("Rego status is not clearly mentioned.");
  }

  // RWC
  if (
    lowerText.includes("no rwc") ||
    lowerText.includes("without rwc") ||
    lowerText.includes("no roadworthy") ||
    lowerText.includes("without roadworthy")
  ) {
    riskSignals.push({
      category: "rwc",
      evidenceText: "No RWC mentioned/provided.",
      severity: "medium",
      explanation:
        "The listing suggests a roadworthy certificate may not be provided.",
    });
  } else if (
    lowerText.includes("rwc supplied") ||
    lowerText.includes("rwc included") ||
    lowerText.includes("roadworthy supplied") ||
    lowerText.includes("roadworthy included") ||
    lowerText.includes("comes with rwc") ||
    lowerText.includes("with rwc")
  ) {
    positiveSignals.push("RWC is mentioned as available or included.");
  } else if (
    !lowerText.includes("rwc") &&
    !lowerText.includes("roadworthy")
  ) {
    missingInformation.push("RWC status is not clearly mentioned.");
  }

  // Engine / warning light
  if (
    lowerText.includes("engine light") ||
    lowerText.includes("check engine") ||
    lowerText.includes("warning light")
  ) {
    riskSignals.push({
      category: "engine",
      evidenceText: "Engine warning light is mentioned.",
      severity: "high",
      explanation:
        "The listing mentions a possible engine warning light or warning indicator.",
    });
  }

  // Transmission
  if (
    lowerText.includes("gearbox issue") ||
    lowerText.includes("gearbox problem") ||
    lowerText.includes("transmission issue") ||
    lowerText.includes("transmission problem") ||
    lowerText.includes("rough shifting") ||
    lowerText.includes("transmission slipping") ||
    lowerText.includes("shudder")
  ) {
    riskSignals.push({
      category: "transmission",
      evidenceText: "Transmission or shifting concern is mentioned.",
      severity: "high",
      explanation:
        "The listing mentions wording related to gearbox, transmission, shudder or shifting behaviour.",
    });
  }

  // Overheating
  if (
    lowerText.includes("overheating") ||
    lowerText.includes("over heats") ||
    lowerText.includes("overheat")
  ) {
    riskSignals.push({
      category: "engine",
      evidenceText: "Overheating concern is mentioned.",
      severity: "high",
      explanation:
        "The listing mentions overheating, which can indicate a serious mechanical concern.",
    });
  }

  // Seller pressure
  if (
    lowerText.includes("urgent sale") ||
    lowerText.includes("must sell") ||
    lowerText.includes("cash only")
  ) {
    riskSignals.push({
      category: "seller_pressure",
      evidenceText: "Urgent sale or cash-only wording is mentioned.",
      severity: "medium",
      explanation:
        "Pressure-style seller wording can require extra caution before inspection.",
    });
  }

  // Seller claims
  if (
    lowerText.includes("good condition") ||
    lowerText.includes("drives well") ||
    lowerText.includes("drives really well") ||
    lowerText.includes("runs well") ||
    lowerText.includes("runs great") ||
    lowerText.includes("no issues") ||
    lowerText.includes("no problems") ||
    lowerText.includes("good and reliable") ||
    lowerText.includes("reliable car")
  ) {
    sellerClaims.push("The seller claims the car is in good/running condition.");
  }

  if (
    lowerText.includes("reliable engine") ||
    lowerText.includes("reliable gearbox") ||
    lowerText.includes("engine & gearbox") ||
    lowerText.includes("engine and gearbox")
  ) {
    sellerClaims.push("The seller claims the engine or gearbox is reliable.");
  }

  if (
    lowerText.includes("one owner") ||
    lowerText.includes("single owner")
  ) {
    sellerClaims.push("The seller claims the car has had one owner.");
    positiveSignals.push("One-owner claim is mentioned.");
  }

  return {
    positiveSignals,
    riskSignals,
    missingInformation,
    sellerClaims,
  };
}
