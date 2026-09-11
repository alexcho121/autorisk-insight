// Shared domain contracts for extracted listings, evidence, and scoring.

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
  extractionMethod: "fallback" | "regex" | "openai" | "manual";
};

export type BudgetRange =
  | "not_sure"
  | "under_5000"
  | "5000_8000"
  | "8000_11000"
  | "11000_15000";

export type BuyerProfile = {
  budgetRange: BudgetRange;
};

export type EvidenceCategory =
  | "engine"
  | "transmission"
  | "rego"
  | "rwc"
  | "service_history"
  | "accident"
  | "seller_pressure"
  | "price"
  | "mileage"
  | "other";

export type EvidenceSeverity = "low" | "medium" | "high";

export type EvidenceSignal = {
  category: EvidenceCategory;
  evidenceText: string;
  severity: EvidenceSeverity;
  explanation: string;
};

export type ListingEvidence = {
  positiveSignals: string[];
  riskSignals: EvidenceSignal[];
  missingInformation: string[];
  sellerClaims: string[];
};

export type ExtractionResult = {
  vehicle: VehicleInput;
  evidence: ListingEvidence;
  extractionNote: string;
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

  // Clean user-facing result.
  summary: string;
  topReasons: string[];
  nextSteps: string[];

  // Detailed / secondary information.
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
