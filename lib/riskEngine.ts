// Budget-aware Buying Confidence Score.
// AI/fallback evidence supports the explanation; final scoring remains rule-based.

import {
  BudgetRange,
  BuyerProfile,
  ConfidenceBand,
  KnownIssue,
  ListingEvidence,
  Recommendation,
  RiskResult,
  VehicleInput,
} from "./types";
import { reconcileEvidenceWithVehicle } from "./evidenceReconciliation";

type BudgetExpectation = {
  typicalMaxAge: number;
  cautionAge: number;
  typicalMaxMileage: number;
  cautionMileage: number;
  strictness: number;
};

export function analyseQuickRisk(
  vehicle: VehicleInput,
  matchedIssues: KnownIssue[] = [],
  evidence: ListingEvidence | null = null,
  buyerProfile: BuyerProfile = { budgetRange: "not_sure" }
): RiskResult {
  let riskPenaltyScore = 0;

  const riskReasons: string[] = [];
  const missingInformation: string[] = [];
  const sellerRedFlags: string[] = [];
  const knownIssueWarnings: string[] = [];
  const requiredVerificationChecks: string[] = [
    "Run a PPSR check before purchase.",
    "Verify VIN, rego status, and written service records.",
    "Get a professional mechanical inspection before buying.",
  ];

  const positiveReasons: string[] = [];
  const cautionReasons: string[] = [];

  const appliedPenaltyKeys = new Set<string>();
  const handledEvidenceCategories = new Set<string>();
  const scoreCaps: number[] = [];

  const currentYear = new Date().getFullYear();
  const rawDescription = vehicle.sellerDescription || vehicle.rawListingText || "";
  const lowerDescription = rawDescription.toLowerCase();
  const reconciledEvidence = evidence
    ? reconcileEvidenceWithVehicle(evidence, vehicle)
    : null;

  const budgetExpectation = getBudgetExpectation(buyerProfile.budgetRange);
  const budgetLabel = getBudgetRangeLabel(buyerProfile.budgetRange);

  function addPenalty(
    key: string,
    amount: number,
    message: string,
    options?: {
      missing?: boolean;
      sellerFlag?: boolean;
      riskReason?: boolean;
      evidenceCategory?: string;
      capScoreAt?: number;
    }
  ) {
    if (appliedPenaltyKeys.has(key)) {
      return;
    }

    appliedPenaltyKeys.add(key);
    riskPenaltyScore += amount;

    if (options?.missing) {
      missingInformation.push(message);
    }

    if (options?.sellerFlag) {
      sellerRedFlags.push(message);
    }

    if (options?.riskReason) {
      riskReasons.push(message);
    }

    cautionReasons.push(message);

    if (options?.evidenceCategory) {
      handledEvidenceCategories.add(options.evidenceCategory);
    }

    if (options?.capScoreAt !== undefined) {
      scoreCaps.push(options.capScoreAt);
    }
  }

  function addPositive(message: string) {
    positiveReasons.push(message);
  }

  // 1. Basic identity checks
  if (isUnknown(vehicle.make)) {
    addPenalty("missing_make", 10, "Vehicle make is not clearly identified.", {
      missing: true,
    });
  }

  if (isUnknown(vehicle.model)) {
    addPenalty("missing_model", 10, "Vehicle model is not clearly identified.", {
      missing: true,
    });
  }

  // 2. Budget-aware vehicle age
  if (vehicle.year === null) {
    addPenalty(
      "missing_year",
      Math.round(10 * budgetExpectation.strictness),
      "Vehicle year is not clearly stated.",
      {
        missing: true,
      }
    );
  } else {
    const vehicleAge = currentYear - vehicle.year;

    if (vehicleAge > budgetExpectation.cautionAge) {
      addPenalty(
        "age_high_for_budget",
        Math.round(18 * budgetExpectation.strictness),
        `The vehicle is older than expected for the ${budgetLabel} budget range.`,
        {
          riskReason: true,
        }
      );
    } else if (vehicleAge > budgetExpectation.typicalMaxAge) {
      addPenalty(
        "age_caution_for_budget",
        Math.round(9 * budgetExpectation.strictness),
        `Vehicle age is a caution point for the ${budgetLabel} budget range.`,
        {
          riskReason: true,
        }
      );
    } else {
      addPositive(
        `Vehicle age looks reasonable for the ${budgetLabel} budget range.`
      );
    }
  }

  // 3. Budget-aware mileage
  if (vehicle.mileage === null) {
    addPenalty(
      "missing_mileage",
      Math.round(15 * budgetExpectation.strictness),
      "Mileage is not clearly stated.",
      {
        missing: true,
      }
    );
  } else if (vehicle.mileage > budgetExpectation.cautionMileage) {
    addPenalty(
      "mileage_high_for_budget",
      Math.round(25 * budgetExpectation.strictness),
      `Mileage is very high for the ${budgetLabel} budget range.`,
      {
        riskReason: true,
      }
    );
  } else if (vehicle.mileage > budgetExpectation.typicalMaxMileage) {
    addPenalty(
      "mileage_caution_for_budget",
      Math.round(13 * budgetExpectation.strictness),
      `Mileage is a caution point for the ${budgetLabel} budget range.`,
      {
        riskReason: true,
      }
    );
  } else {
    addPositive(
      `Mileage looks reasonable for the ${budgetLabel} budget range.`
    );
  }

  // 4. Price checks
  if (vehicle.price === null) {
    addPenalty("missing_price", 8, "Price is not clearly stated.", {
      missing: true,
    });
  } else if (vehicle.price < 1500) {
    addPenalty(
      "price_unusually_low",
      12,
      "The price appears unusually low and should be checked carefully.",
      {
        riskReason: true,
        capScoreAt: 72,
      }
    );
  } else if (vehicle.price > 15000) {
    addPenalty(
      "price_above_target_budget",
      6,
      "This app is mainly designed for affordable used-car listings up to around $15,000.",
      {
        riskReason: true,
      }
    );
  } else {
    addPositive("Price is clearly stated.");
  }

  const priceSuspicion = detectPriceSuspicion(vehicle);

  if (priceSuspicion) {
    addPenalty("price_suspicious_for_vehicle", 12, priceSuspicion, {
      riskReason: true,
      capScoreAt: 72,
    });
  }

  // 5. Transmission / fuel / body style
  if (isUnknown(vehicle.transmission)) {
    addPenalty(
      "missing_transmission",
      5,
      "Transmission type is not clearly stated.",
      {
        missing: true,
      }
    );
  }

  if (isUnknown(vehicle.fuelType)) {
    missingInformation.push("Fuel type is not clearly stated.");
  }

  if (isUnknown(vehicle.bodyStyle)) {
    missingInformation.push("Body style is not clearly stated.");
  }

  // 6. Service history
  if (vehicle.serviceHistoryStatus === "Full service history mentioned") {
    addPositive("Full service history is mentioned.");
  } else if (vehicle.serviceHistoryStatus === "Service history mentioned") {
    addPositive("Service history is mentioned.");
  } else if (vehicle.serviceHistoryStatus === "No service history mentioned") {
    addPenalty(
      "no_service_history",
      Math.round(20 * budgetExpectation.strictness),
      "The listing suggests there may be no clear service history.",
      {
        riskReason: true,
        evidenceCategory: "service_history",
      }
    );
  } else {
    addPenalty(
      "missing_service_history",
      Math.round(12 * budgetExpectation.strictness),
      "Service history is not clearly mentioned.",
      {
        missing: true,
        evidenceCategory: "service_history",
      }
    );
  }

  // 7. Rego and RWC
  const noRegoMentioned = hasAny(lowerDescription, [
    "no rego",
    "rego expired",
    "expired rego",
  ]);

  if (noRegoMentioned) {
    addPenalty(
      "no_rego",
      16,
      "The listing suggests rego may be missing or expired.",
      {
        sellerFlag: true,
        evidenceCategory: "rego",
        capScoreAt: 60,
      }
    );
  } else if (vehicle.regoMentioned) {
    addPositive("Rego is mentioned in the listing.");
  } else {
    addPenalty(
      "missing_rego",
      8,
      "Rego status is not clearly mentioned.",
      {
        missing: true,
        evidenceCategory: "rego",
      }
    );
  }

  const noRwcMentioned = hasAny(lowerDescription, [
    "no rwc",
    "without rwc",
    "no roadworthy",
    "without roadworthy",
  ]);

  if (noRwcMentioned) {
    addPenalty(
      "no_rwc",
      12,
      "RWC status is a caution point and should be confirmed before inspection.",
      {
        sellerFlag: true,
        evidenceCategory: "rwc",
        capScoreAt: 72,
      }
    );
  } else if (
    hasAny(lowerDescription, [
      "rwc supplied",
      "rwc included",
      "roadworthy supplied",
      "roadworthy included",
      "comes with rwc",
      "with rwc",
    ])
  ) {
    addPositive("RWC is mentioned as available or included.");
  } else {
    missingInformation.push("RWC status is not clearly mentioned.");
  }

  // 8. Seller and mechanical red flags
  if (hasAny(lowerDescription, ["selling as is", "sold as is", "as-is"])) {
    addPenalty("selling_as_is", 18, "The listing uses as-is sale wording.", {
      sellerFlag: true,
      evidenceCategory: "seller_pressure",
      capScoreAt: 58,
    });
  }

  if (
    hasAny(lowerDescription, ["engine light", "check engine", "warning light"])
  ) {
    addPenalty(
      "engine_light",
      30,
      "The listing mentions a warning light or engine light.",
      {
        sellerFlag: true,
        evidenceCategory: "engine",
        capScoreAt: 40,
      }
    );
  }

  if (
    hasAny(lowerDescription, [
      "transmission slipping",
      "rough shifting",
      "gearbox issue",
      "gearbox problem",
      "transmission issue",
      "transmission problem",
      "shudder",
    ])
  ) {
    addPenalty(
      "transmission_symptom",
      26,
      "The listing mentions a possible transmission or gearbox concern.",
      {
        sellerFlag: true,
        evidenceCategory: "transmission",
        capScoreAt: 45,
      }
    );
  }

  if (hasAny(lowerDescription, ["overheating", "over heats", "overheat"])) {
    addPenalty(
      "overheating",
      28,
      "The listing mentions a possible overheating concern.",
      {
        sellerFlag: true,
        evidenceCategory: "engine",
        capScoreAt: 42,
      }
    );
  }

  if (hasAny(lowerDescription, ["urgent sale", "must sell"])) {
    addPenalty(
      "urgent_sale",
      5,
      "The seller uses urgency wording, so avoid rushing the decision.",
      {
        sellerFlag: true,
        evidenceCategory: "seller_pressure",
      }
    );
  }

  if (hasAny(lowerDescription, ["cash only"])) {
    addPenalty("cash_only", 6, "The listing uses cash-only wording.", {
      sellerFlag: true,
      evidenceCategory: "seller_pressure",
    });
  }

  if (appliedPenaltyKeys.has("no_rwc") && appliedPenaltyKeys.has("urgent_sale")) {
    scoreCaps.push(68);
  }

  if (appliedPenaltyKeys.has("cash_only") && appliedPenaltyKeys.has("urgent_sale")) {
    scoreCaps.push(66);
  }

  // 9. AI/fallback evidence
  if (reconciledEvidence) {
    for (let i = 0; i < reconciledEvidence.positiveSignals.length; i++) {
      positiveReasons.push(cleanSentence(reconciledEvidence.positiveSignals[i]));
    }

    for (let i = 0; i < reconciledEvidence.missingInformation.length; i++) {
      const item = cleanSentence(reconciledEvidence.missingInformation[i]);

      if (!includesSimilar(missingInformation, item)) {
        missingInformation.push(item);
      }
    }

    for (let i = 0; i < reconciledEvidence.riskSignals.length; i++) {
      const signal = reconciledEvidence.riskSignals[i];

      if (handledEvidenceCategories.has(signal.category)) {
        continue;
      }

      const reason = cleanSentence(signal.explanation || signal.evidenceText);

      if (signal.severity === "high") {
        addPenalty(`evidence_${signal.category}`, 18, reason, {
          sellerFlag: true,
          evidenceCategory: signal.category,
          capScoreAt: getEvidenceScoreCap(signal.category),
        });
      } else if (signal.severity === "medium") {
        addPenalty(`evidence_${signal.category}`, 10, reason, {
          sellerFlag: true,
          evidenceCategory: signal.category,
          capScoreAt: getEvidenceScoreCap(signal.category),
        });
      } else {
        addPenalty(`evidence_${signal.category}`, 5, reason, {
          sellerFlag: true,
          evidenceCategory: signal.category,
        });
      }
    }
  }

  // 10. Known issues: small score impact, mostly inspection guidance
  if (matchedIssues.length > 0) {
    const highSeverityCount = matchedIssues.filter(
      (issue) => issue.severity === "High"
    ).length;

    const mediumSeverityCount = matchedIssues.filter(
      (issue) => issue.severity === "Medium"
    ).length;

    const knownIssuePenalty = Math.min(
      highSeverityCount * 2 + mediumSeverityCount,
      5
    );

    riskPenaltyScore += knownIssuePenalty;

    knownIssueWarnings.push(
      `${matchedIssues.length} model-specific inspection priority item(s) matched this vehicle. These are not confirmed faults.`
    );

    cautionReasons.push(
      "There are model-specific inspection priorities to check."
    );
  }

  // 11. Final score and caps
  riskPenaltyScore = Math.min(Math.max(riskPenaltyScore, 0), 100);

  let buyingConfidenceScore = 100 - riskPenaltyScore;

  if (scoreCaps.length > 0) {
    buyingConfidenceScore = Math.min(buyingConfidenceScore, Math.min(...scoreCaps));
  }

  buyingConfidenceScore = Math.min(Math.max(buyingConfidenceScore, 0), 100);
  riskPenaltyScore = 100 - buyingConfidenceScore;

  const confidenceBand = getConfidenceBand(buyingConfidenceScore);
  const recommendation = getRecommendation(buyingConfidenceScore);

  const topReasons = buildTopReasons(positiveReasons, cautionReasons);
  const nextSteps = buildNextSteps(vehicle, reconciledEvidence, matchedIssues);
  const summary = buildSummary(buyingConfidenceScore, buyerProfile.budgetRange);

  return {
    recommendation,
    riskPenaltyScore,
    buyingConfidenceScore,
    confidenceBand,
    summary,
    topReasons,
    nextSteps,
    riskReasons: uniqueList(riskReasons),
    missingInformation: uniqueList(missingInformation),
    sellerRedFlags: uniqueList(sellerRedFlags),
    knownIssueWarnings: uniqueList(knownIssueWarnings),
    requiredVerificationChecks,
  };
}

function getConfidenceBand(score: number): ConfidenceBand {
  if (score >= 81) {
    return "Strong Candidate";
  }

  if (score >= 66) {
    return "Good but Check";
  }

  if (score >= 46) {
    return "Caution";
  }

  if (score >= 31) {
    return "High Caution";
  }

  return "Avoid for Now";
}

function getRecommendation(score: number): Recommendation {
  if (score >= 81) {
    return "Worth Shortlisting";
  }

  if (score >= 66) {
    return "Ask Before Inspection";
  }

  if (score >= 46) {
    return "Inspect Carefully";
  }

  if (score >= 31) {
    return "Do Not Proceed Yet";
  }

  return "Avoid";
}

function buildSummary(score: number, budgetRange: BudgetRange): string {
  const budgetLabel = getBudgetRangeLabel(budgetRange);

  if (score >= 81) {
    return `This listing looks promising for the ${budgetLabel} budget range, but key details should still be verified before purchase.`;
  }

  if (score >= 66) {
    return `This listing looks reasonably promising for the ${budgetLabel} budget range, but a few details should be confirmed before booking an inspection.`;
  }

  if (score >= 46) {
    return `This listing may still be a realistic candidate for the ${budgetLabel} budget range, but it needs careful checks before proceeding.`;
  }

  if (score >= 31) {
    return `This listing has several caution signals even for the ${budgetLabel} budget range. Ask questions first and avoid committing before proper verification.`;
  }

  return `This listing has strong risk signals or too much uncertainty for the ${budgetLabel} budget range. It is safer to avoid it for now unless the seller can provide strong evidence.`;
}

function buildTopReasons(
  positiveReasons: string[],
  cautionReasons: string[]
): string[] {
  const reasons: string[] = [];

  const uniqueCautions = uniqueList(cautionReasons);
  const uniquePositives = uniqueList(positiveReasons);

  for (let i = 0; i < uniqueCautions.length && reasons.length < 4; i++) {
    reasons.push(uniqueCautions[i]);
  }

  for (let i = 0; i < uniquePositives.length && reasons.length < 5; i++) {
    reasons.push(uniquePositives[i]);
  }

  if (reasons.length === 0) {
    reasons.push("The score is based on the information available in the listing.");
  }

  return reasons.slice(0, 5);
}

function buildNextSteps(
  vehicle: VehicleInput,
  evidence: ListingEvidence | null,
  matchedIssues: KnownIssue[]
): string[] {
  const nextSteps: string[] = [];

  if (
    vehicle.serviceHistoryStatus === "Not mentioned" ||
    vehicle.serviceHistoryStatus === "No service history mentioned"
  ) {
    nextSteps.push("Ask the seller for written service records.");
  } else {
    nextSteps.push("Ask the seller to provide the service records before inspection.");
  }

  if (!vehicle.regoMentioned) {
    nextSteps.push("Confirm current rego status before booking an inspection.");
  } else {
    nextSteps.push("Verify rego, VIN, and PPSR before purchase.");
  }

  const hasRwcRisk =
    evidence?.riskSignals.some((signal) => signal.category === "rwc") ?? false;

  if (hasRwcRisk) {
    nextSteps.push("Confirm whether a current RWC will be provided.");
  } else {
    nextSteps.push("Ask whether a current RWC is available.");
  }

  if (matchedIssues.length > 0) {
    nextSteps.push("Use the model-specific inspection priorities during the test drive.");
  }

  return uniqueList(nextSteps).slice(0, 3);
}

function getBudgetExpectation(budgetRange: BudgetRange): BudgetExpectation {
  const expectations: Record<BudgetRange, BudgetExpectation> = {
    not_sure: {
      typicalMaxAge: 14,
      cautionAge: 18,
      typicalMaxMileage: 180000,
      cautionMileage: 240000,
      strictness: 1.0,
    },
    under_5000: {
      typicalMaxAge: 20,
      cautionAge: 24,
      typicalMaxMileage: 230000,
      cautionMileage: 290000,
      strictness: 0.7,
    },
    "5000_8000": {
      typicalMaxAge: 17,
      cautionAge: 21,
      typicalMaxMileage: 215000,
      cautionMileage: 270000,
      strictness: 0.85,
    },
    "8000_11000": {
      typicalMaxAge: 15,
      cautionAge: 19,
      typicalMaxMileage: 190000,
      cautionMileage: 245000,
      strictness: 1.0,
    },
    "11000_15000": {
      typicalMaxAge: 12,
      cautionAge: 16,
      typicalMaxMileage: 160000,
      cautionMileage: 220000,
      strictness: 1.15,
    },
  };

  return expectations[budgetRange];
}

function getBudgetRangeLabel(budgetRange: BudgetRange): string {
  if (budgetRange === "under_5000") {
    return "under $5,000";
  }

  if (budgetRange === "5000_8000") {
    return "$5,000–$8,000";
  }

  if (budgetRange === "8000_11000") {
    return "$8,000–$11,000";
  }

  if (budgetRange === "11000_15000") {
    return "$11,000–$15,000";
  }

  return "unsure";
}

function detectPriceSuspicion(vehicle: VehicleInput): string | null {
  if (vehicle.price === null || vehicle.year === null || vehicle.mileage === null) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  const age = currentYear - vehicle.year;

  if (age <= 5 && vehicle.mileage < 90000 && vehicle.price < 9000) {
    return "The price appears unusually low for a newer, lower-mileage vehicle. Verify PPSR, VIN, and seller details carefully.";
  }

  if (age <= 8 && vehicle.mileage < 130000 && vehicle.price < 6500) {
    return "The price appears unusually low for the age and mileage. Check for accident history, finance owing, or repair needs.";
  }

  return null;
}

function getEvidenceScoreCap(category: string): number | undefined {
  if (category === "engine") {
    return 42;
  }

  if (category === "transmission") {
    return 45;
  }

  if (category === "rego") {
    return 60;
  }

  if (category === "rwc") {
    return 72;
  }

  if (category === "seller_pressure") {
    return 68;
  }

  return undefined;
}

function hasAny(text: string, keywords: string[]): boolean {
  for (let i = 0; i < keywords.length; i++) {
    if (text.includes(keywords[i])) {
      return true;
    }
  }

  return false;
}

function isUnknown(value: string): boolean {
  return value.trim().length === 0 || value.toLowerCase() === "unknown";
}

function cleanSentence(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (
    trimmed.endsWith(".") ||
    trimmed.endsWith("!") ||
    trimmed.endsWith("?")
  ) {
    return trimmed;
  }

  return `${trimmed}.`;
}

function uniqueList(items: string[]): string[] {
  const result: string[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = cleanSentence(items[i]);

    if (item.length === 0) {
      continue;
    }

    if (!includesSimilar(result, item)) {
      result.push(item);
    }
  }

  return result;
}

function includesSimilar(items: string[], target: string): boolean {
  const normalisedTarget = normaliseForCompare(target);

  return items.some((item) => normaliseForCompare(item) === normalisedTarget);
}

function normaliseForCompare(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").replace(/[.!?]$/, "").trim();
}
