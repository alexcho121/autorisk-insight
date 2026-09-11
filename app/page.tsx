"use client";

import { ChangeEvent, useState } from "react";
import InputView from "@/components/InputView";
import ResultView from "@/components/ResultView";
import ReviewView from "@/components/ReviewView";
import { reconcileEvidenceWithVehicle } from "@/lib/evidenceReconciliation";
import { findKnownIssues } from "@/lib/knownIssueMatcher";
import { extractListingWithAI } from "@/lib/openaiExtractor";
import { analyseQuickRisk } from "@/lib/riskEngine";
import { sanitiseVehicleValues } from "@/lib/vehicleValidation";
import {
  BudgetRange,
  BuyerProfile,
  KnownIssue,
  ListingEvidence,
  RiskResult,
  VehicleInput,
} from "@/lib/types";

export default function HomePage() {
  const [rawListingText, setRawListingText] = useState("");
  const [extractedVehicle, setExtractedVehicle] =
    useState<VehicleInput | null>(null);
  const [extractedEvidence, setExtractedEvidence] =
    useState<ListingEvidence | null>(null);
  const [riskResult, setRiskResult] = useState<RiskResult | null>(null);
  const [matchedIssues, setMatchedIssues] = useState<KnownIssue[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile>({
    budgetRange: "not_sure",
  });

  function handleListingTextChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setRawListingText(event.target.value);

    event.target.style.height = "auto";

    const nextHeight = Math.min(event.target.scrollHeight, 280);
    event.target.style.height = `${nextHeight}px`;
  }

  function handleBudgetRangeChange(budgetRange: BudgetRange) {
    setBuyerProfile({
      budgetRange,
    });

    setRiskResult(null);
  }

  async function handleAnalyseClick() {
    if (rawListingText.trim().length === 0) {
      alert("Please paste a listing first.");
      return;
    }

    setIsExtracting(true);

    try {
      const extraction = await extractListingWithAI(rawListingText);

      const vehicle = extraction.vehicle;

      if (!vehicle) {
        console.error("No vehicle returned from extraction.");
        alert("Extraction failed. No vehicle data returned.");
        return;
      }

      setExtractedVehicle(vehicle);
      setExtractedEvidence(extraction.evidence);
      setRiskResult(null);

      try {
        const issues = findKnownIssues(vehicle);
        setMatchedIssues(issues);
      } catch (error) {
        console.error("Known issue matching failed:", error);
        setMatchedIssues([]);
      }
    } catch (error) {
      console.error("handleAnalyseClick failed:", error);
      alert("Something went wrong while reading the listing. Check the console.");
    } finally {
      setIsExtracting(false);
    }
  }

  function handleVehicleFieldChange(
    field: keyof VehicleInput,
    value: string | number | boolean | null
  ) {
    if (!extractedVehicle) {
      return;
    }

    const updatedVehicle = sanitiseVehicleValues({
      ...extractedVehicle,
      [field]: value,
      extractionMethod: "manual" as const,
    });

    setExtractedVehicle(updatedVehicle);
    setExtractedEvidence((currentEvidence) => {
      if (!currentEvidence) {
        return currentEvidence;
      }

      return reconcileEvidenceWithVehicle(currentEvidence, updatedVehicle);
    });
    setRiskResult(null);

    try {
      setMatchedIssues(findKnownIssues(updatedVehicle));
    } catch (error) {
      console.error("Known issue matching failed after manual edit:", error);
      setMatchedIssues([]);
    }
  }

  function handleRunRiskScan() {
    if (!extractedVehicle) {
      return;
    }

    const result = analyseQuickRisk(
      extractedVehicle,
      matchedIssues,
      extractedEvidence
        ? reconcileEvidenceWithVehicle(extractedEvidence, extractedVehicle)
        : null,
      buyerProfile
    );

    setRiskResult(result);
  }

  function handleStartOver() {
    setRawListingText("");
    setExtractedVehicle(null);
    setExtractedEvidence(null);
    setRiskResult(null);
    setMatchedIssues([]);
    setIsExtracting(false);
  }

  if (!extractedVehicle) {
    return (
      <InputView
        rawListingText={rawListingText}
        budgetRange={buyerProfile.budgetRange}
        isExtracting={isExtracting}
        onBudgetRangeChange={handleBudgetRangeChange}
        onListingTextChange={handleListingTextChange}
        onAnalyseClick={handleAnalyseClick}
      />
    );
  }

  if (!riskResult) {
    return (
      <ReviewView
        vehicle={extractedVehicle}
        onVehicleFieldChange={handleVehicleFieldChange}
        onRunRiskScan={handleRunRiskScan}
        onStartOver={handleStartOver}
      />
    );
  }

  return (
    <ResultView
      vehicle={extractedVehicle}
      riskResult={riskResult}
      matchedIssues={matchedIssues}
      onStartOver={handleStartOver}
    />
  );
}
