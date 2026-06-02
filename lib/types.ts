
//types.ts는 데이터가 따라야 하는 약속/규칙

export type VehicleInput = {
  make: string;
  model: string;
  year: number | null;
  mileage: number | null;
  price: number | null;
  transmission: string;
  fuelType: string;
  bodyStyle: string;
  sellerType: string;
  serviceHistoryStatus: string;
  regoMentioned: boolean;
  sellerDescription: string;
  rawListingText: string;
  extractionMethod: "mock" | "regex" | "openai" | "manual";
};

export type Recommendation =
  | "Worth Shortlisting"
  | "Ask Before Inspection"
  | "Inspect Carefully"
  | "Do Not Proceed Yet"
  | "Avoid";

export type ConfidenceBand =
  | "Strong Candidate"
  | "Good but Check"
  | "Caution"
  | "High Caution"
  | "Avoid for Now";

export type RiskResult = {
  recommendation: Recommendation;

  // Internal risk penalty. Higher means more risk.
  riskPenaltyScore: number;

  // User-facing score. Higher means lower risk / better buying confidence.
  buyingConfidenceScore: number;

  confidenceBand: ConfidenceBand;

  riskReasons: string[];
  missingInformation: string[];
  sellerRedFlags: string[];
  knownIssueWarnings: string[];
  requiredVerificationChecks: string[];
};

export type SourceQuality =
  | "official-recall"
  | "expert-used-car-review"
  | "repair-pattern"
  | "owner-report"
  | "reviewer-used-car-review";

export type KnownIssue = {
  id: string;

  make: string;
  model: string;
  generation?: string;
  yearFrom: number;
  yearTo: number;

  area: string;
  issue: string;

  whyItMatters: string;
  howToInspect: string[];
  sellerQuestions: string[];

  severity: "Low" | "Medium" | "High";
  confidence: "Low" | "Medium" | "High";

  sourceQuality: SourceQuality;
  sourceSummary: string;
  sourceName: string;
  sourceUrl: string;

  verificationStatus: "Verified by source" | "Needs further verification";
  wordingCaution: string;

  appliesToFuelTypes?: string[];
  appliesToTransmissions?: string[];
  appliesToBodyStyles?: string[];
};