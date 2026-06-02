"use client";

import { ChangeEvent, useState } from "react";
import InputView from "@/components/InputView";
import ResultView from "@/components/ResultView";
import ReviewView from "@/components/ReviewView";
import { findKnownIssues } from "@/lib/knownIssueMatcher";
import { extractListingMock } from "@/lib/mockExtractor";
import { analyseQuickRisk } from "@/lib/riskEngine";
import { KnownIssue, RiskResult, VehicleInput } from "@/lib/types";

export default function HomePage() {
  const [rawListingText, setRawListingText] = useState("");
  const [extractedVehicle, setExtractedVehicle] =
    useState<VehicleInput | null>(null);
  const [riskResult, setRiskResult] = useState<RiskResult | null>(null);
  const [matchedIssues, setMatchedIssues] = useState<KnownIssue[]>([]);

  function handleListingTextChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setRawListingText(event.target.value);

    event.target.style.height = "auto";

    const nextHeight = Math.min(event.target.scrollHeight, 280);
    event.target.style.height = `${nextHeight}px`;
  }

  function handleAnalyseClick() {
    if (rawListingText.trim().length === 0) {
      alert("Please paste a listing first.");
      return;
    }

    const vehicle = extractListingMock(rawListingText);
    const issues = findKnownIssues(vehicle);

    setExtractedVehicle(vehicle);
    setMatchedIssues(issues);
    setRiskResult(null);

    console.log("Extracted vehicle:", vehicle);
    console.log("Matched inspection priorities:", issues);
  }

  function handleVehicleFieldChange(
    field: keyof VehicleInput,
    value: string | number | boolean | null
  ) {
    if (!extractedVehicle) {
      return;
    }

    const updatedVehicle = {
      ...extractedVehicle,
      [field]: value,
    };

    setExtractedVehicle(updatedVehicle);
    setMatchedIssues(findKnownIssues(updatedVehicle));
    setRiskResult(null);
  }

  function handleRunRiskScan() {
    if (!extractedVehicle) {
      return;
    }

    const result = analyseQuickRisk(extractedVehicle, matchedIssues);

    setRiskResult(result);

    console.log("Risk result:", result);
  }

  function handleStartOver() {
    setRawListingText("");
    setExtractedVehicle(null);
    setRiskResult(null);
    setMatchedIssues([]);
  }

  if (!extractedVehicle) {
    return (
      <InputView
        rawListingText={rawListingText}
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
