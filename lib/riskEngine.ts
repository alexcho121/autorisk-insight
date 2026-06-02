import {
  KnownIssue,
  Recommendation,
  RiskResult,
  VehicleInput,
} from "./types";

export function analyseQuickRisk(
  vehicle: VehicleInput,
  matchedIssues: KnownIssue[] = []
): RiskResult {
  let riskPenaltyScore = 0;

  const riskReasons: string[] = [];
  const missingInformation: string[] = [];
  const sellerRedFlags: string[] = [];
  const knownIssueWarnings: string[] = [];
  const requiredVerificationChecks: string[] = [];

  if (vehicle.make === "Unknown") {
    riskPenaltyScore += 10;
    missingInformation.push("Vehicle make is not clearly mentioned.");
  }

  if (vehicle.model === "Unknown") {
    riskPenaltyScore += 10;
    missingInformation.push("Vehicle model is not clearly mentioned.");
  }

  if (!vehicle.year) {
    riskPenaltyScore += 10;
    missingInformation.push("Vehicle year is not clearly mentioned.");
  } else if (vehicle.year < 2008) {
    riskPenaltyScore += 20;
    riskReasons.push("The vehicle is relatively old.");
  } else if (vehicle.year < 2012) {
    riskPenaltyScore += 10;
    riskReasons.push("The vehicle is over 10 years old.");
  }

  if (!vehicle.mileage) {
    riskPenaltyScore += 15;
    missingInformation.push("Mileage is not clearly mentioned.");
  } else if (vehicle.mileage > 220000) {
    riskPenaltyScore += 30;
    riskReasons.push("Mileage is very high.");
  } else if (vehicle.mileage > 160000) {
    riskPenaltyScore += 15;
    riskReasons.push("Mileage is moderately high.");
  }

  if (!vehicle.price) {
    riskPenaltyScore += 10;
    missingInformation.push("Price is not clearly mentioned.");
  }

  if (vehicle.transmission === "Unknown") {
    riskPenaltyScore += 5;
    missingInformation.push("Transmission type is not clearly mentioned.");
  }

  if (vehicle.fuelType === "Unknown") {
    missingInformation.push("Fuel type is not clearly mentioned.");
  }

  if (vehicle.bodyStyle === "Unknown") {
    missingInformation.push("Body style is not clearly mentioned.");
  }

  if (vehicle.sellerType === "Unknown") {
    missingInformation.push("Seller type is not clearly identified.");
  }

  if (vehicle.serviceHistoryStatus === "Not mentioned") {
    riskPenaltyScore += 15;
    missingInformation.push("Service history is not mentioned.");
  }

  if (!vehicle.regoMentioned) {
    riskPenaltyScore += 10;
    missingInformation.push("Rego status is not mentioned.");
  }

  const lowerDescription = vehicle.sellerDescription.toLowerCase();

  if (lowerDescription.includes("selling as is")) {
    riskPenaltyScore += 20;
    sellerRedFlags.push("Seller uses 'selling as is'.");
  }

  if (lowerDescription.includes("no rwc")) {
    riskPenaltyScore += 20;
    sellerRedFlags.push("No roadworthy certificate is mentioned.");
  }

  if (lowerDescription.includes("engine light")) {
    riskPenaltyScore += 30;
    sellerRedFlags.push("Engine warning light is mentioned.");
  }

  if (lowerDescription.includes("urgent sale")) {
    riskPenaltyScore += 10;
    sellerRedFlags.push("Urgent sale may require extra caution.");
  }

  if (lowerDescription.includes("cash only")) {
    riskPenaltyScore += 10;
    sellerRedFlags.push("Cash-only sale may require extra caution.");
  }

  const knownIssueContextPenalty =
    calculateKnownIssueContextPenalty(matchedIssues);

  if (knownIssueContextPenalty > 0) {
    riskPenaltyScore += knownIssueContextPenalty;

    knownIssueWarnings.push(
      `This vehicle has ${matchedIssues.length} model-specific inspection priority item(s). These are not confirmed faults, but they should be checked before purchase.`
    );
  }

  const recallIssueCount = countRecallIssues(matchedIssues);

  if (recallIssueCount > 0) {
    riskPenaltyScore += 5;

    requiredVerificationChecks.push(
      "Official recall status should be checked by VIN before purchase."
    );
  }

  if (
    hasMaintenanceSensitiveIssue(matchedIssues) &&
    vehicle.serviceHistoryStatus === "Not mentioned"
  ) {
    riskPenaltyScore += 10;

    knownIssueWarnings.push(
      "This vehicle has maintenance-sensitive inspection priorities, but service history is not clearly mentioned."
    );
  }

  const symptomWarnings = detectKnownIssueSymptoms(
    lowerDescription,
    matchedIssues
  );

  for (let i = 0; i < symptomWarnings.length; i++) {
    riskPenaltyScore += 20;
    sellerRedFlags.push(symptomWarnings[i]);
    knownIssueWarnings.push(symptomWarnings[i]);
  }

  if (missingInformation.length >= 3) {
    requiredVerificationChecks.push(
      "Ask the seller to confirm the missing vehicle details before inspection."
    );
  }

  if (vehicle.serviceHistoryStatus === "Not mentioned") {
    requiredVerificationChecks.push(
      "Ask for service records, logbooks, or recent maintenance receipts."
    );
  }

  const finalRiskPenaltyScore = Math.min(riskPenaltyScore, 100);
  const buyingConfidenceScore = 100 - finalRiskPenaltyScore;

  return {
    recommendation: getRecommendation(
      buyingConfidenceScore,
      missingInformation,
      sellerRedFlags,
      requiredVerificationChecks
    ),
    riskPenaltyScore: finalRiskPenaltyScore,
    buyingConfidenceScore,
    confidenceBand: getConfidenceBand(buyingConfidenceScore),
    riskReasons: removeDuplicateStrings(riskReasons),
    missingInformation: removeDuplicateStrings(missingInformation),
    sellerRedFlags: removeDuplicateStrings(sellerRedFlags),
    knownIssueWarnings: removeDuplicateStrings(knownIssueWarnings),
    requiredVerificationChecks: removeDuplicateStrings(
      requiredVerificationChecks
    ),
  };
}

function getRecommendation(
  buyingConfidenceScore: number,
  missingInformation: string[],
  sellerRedFlags: string[],
  requiredVerificationChecks: string[]
): Recommendation {
  if (buyingConfidenceScore <= 30) {
    return "Avoid";
  }

  if (sellerRedFlags.length >= 3) {
    return "Avoid";
  }

  if (buyingConfidenceScore <= 45) {
    return "Do Not Proceed Yet";
  }

  if (sellerRedFlags.length >= 2) {
    return "Do Not Proceed Yet";
  }

  if (buyingConfidenceScore <= 65) {
    return "Inspect Carefully";
  }

  if (
    missingInformation.length >= 3 ||
    requiredVerificationChecks.length >= 2
  ) {
    return "Ask Before Inspection";
  }

  return "Worth Shortlisting";
}

function getConfidenceBand(buyingConfidenceScore: number) {
  if (buyingConfidenceScore >= 81) {
    return "Strong Candidate";
  }

  if (buyingConfidenceScore >= 66) {
    return "Good but Check";
  }

  if (buyingConfidenceScore >= 46) {
    return "Caution";
  }

  if (buyingConfidenceScore >= 31) {
    return "High Caution";
  }

  return "Avoid for Now";
}

function calculateKnownIssueContextPenalty(
  matchedIssues: KnownIssue[]
): number {
  if (matchedIssues.length === 0) {
    return 0;
  }

  let penalty = 0;

  for (let i = 0; i < matchedIssues.length; i++) {
    const issue = matchedIssues[i];

    if (issue.severity === "High") {
      penalty += 2;
    } else if (issue.severity === "Medium") {
      penalty += 1;
    }
  }

  return Math.min(penalty, 5);
}

function countRecallIssues(matchedIssues: KnownIssue[]): number {
  let count = 0;

  for (let i = 0; i < matchedIssues.length; i++) {
    const issue = matchedIssues[i];

    if (
      issue.sourceQuality === "official-recall" ||
      issue.area.toLowerCase().includes("recall")
    ) {
      count++;
    }
  }

  return count;
}

function hasMaintenanceSensitiveIssue(matchedIssues: KnownIssue[]): boolean {
  for (let i = 0; i < matchedIssues.length; i++) {
    const issue = matchedIssues[i];

    const combinedText = (
      issue.area +
      " " +
      issue.issue +
      " " +
      issue.whyItMatters
    ).toLowerCase();

    if (
      combinedText.includes("service") ||
      combinedText.includes("timing belt") ||
      combinedText.includes("oil") ||
      combinedText.includes("cooling") ||
      combinedText.includes("maintenance") ||
      combinedText.includes("dpf") ||
      combinedText.includes("diesel")
    ) {
      return true;
    }
  }

  return false;
}

function detectKnownIssueSymptoms(
  lowerDescription: string,
  matchedIssues: KnownIssue[]
): string[] {
  const warnings: string[] = [];

  for (let i = 0; i < matchedIssues.length; i++) {
    const issue = matchedIssues[i];

    const area = issue.area.toLowerCase();
    const issueText = issue.issue.toLowerCase();

    if (
      isTransmissionRelated(area, issueText) &&
      containsAny(lowerDescription, [
        "transmission issue",
        "gear issue",
        "rough shift",
        "rough shifting",
        "delayed shift",
        "slipping",
        "shudder",
        "gearbox",
        "clutch slipping",
      ])
    ) {
      warnings.push(
        `The listing mentions possible transmission-related symptoms that overlap with a model-specific inspection priority: ${issue.area}.`
      );
    }

    if (
      isEngineRelated(area, issueText) &&
      containsAny(lowerDescription, [
        "engine light",
        "check engine",
        "misfire",
        "rough idle",
        "rattle",
        "ticking",
        "knocking",
        "overheating",
        "oil leak",
        "smoke",
      ])
    ) {
      warnings.push(
        `The listing mentions possible engine-related symptoms that overlap with a model-specific inspection priority: ${issue.area}.`
      );
    }

    if (
      isSuspensionRelated(area, issueText) &&
      containsAny(lowerDescription, [
        "suspension noise",
        "knocking noise",
        "rattle",
        "thump",
        "clunk",
        "front end noise",
        "uneven tyre wear",
      ])
    ) {
      warnings.push(
        `The listing mentions possible suspension or front-end symptoms that overlap with a model-specific inspection priority: ${issue.area}.`
      );
    }

    if (
      isRecallRelated(issue) &&
      containsAny(lowerDescription, [
        "recall not done",
        "recall outstanding",
        "airbag light",
        "airbag warning",
        "fuel pump issue",
        "child lock issue",
      ])
    ) {
      warnings.push(
        "The listing mentions recall-related terms. Official recall status should be verified by VIN before purchase."
      );
    }
  }

  return removeDuplicateStrings(warnings);
}

function isTransmissionRelated(area: string, issueText: string): boolean {
  return (
    area.includes("transmission") ||
    area.includes("cvt") ||
    area.includes("clutch") ||
    area.includes("gearbox") ||
    issueText.includes("shudder") ||
    issueText.includes("shifting") ||
    issueText.includes("gear")
  );
}

function isEngineRelated(area: string, issueText: string): boolean {
  return (
    area.includes("engine") ||
    area.includes("ignition") ||
    area.includes("timing") ||
    area.includes("cooling") ||
    area.includes("dpf") ||
    issueText.includes("misfire") ||
    issueText.includes("rattle") ||
    issueText.includes("oil") ||
    issueText.includes("overheating")
  );
}

function isSuspensionRelated(area: string, issueText: string): boolean {
  return (
    area.includes("suspension") ||
    area.includes("front") ||
    issueText.includes("rattle") ||
    issueText.includes("thump") ||
    issueText.includes("bush")
  );
}

function isRecallRelated(issue: KnownIssue): boolean {
  return (
    issue.sourceQuality === "official-recall" ||
    issue.area.toLowerCase().includes("recall")
  );
}

function containsAny(text: string, keywords: string[]): boolean {
  for (let i = 0; i < keywords.length; i++) {
    if (text.includes(keywords[i])) {
      return true;
    }
  }

  return false;
}

function removeDuplicateStrings(items: string[]): string[] {
  const uniqueItems: string[] = [];

  for (let i = 0; i < items.length; i++) {
    if (!uniqueItems.includes(items[i])) {
      uniqueItems.push(items[i]);
    }
  }

  return uniqueItems;
}