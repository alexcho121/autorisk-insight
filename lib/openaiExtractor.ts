// lib/openaiExtractor.ts
// Frontend extraction layer.
// If AI extraction is enabled, call the API route.
// If AI extraction is disabled or fails, use fallback extraction.

import { extractEvidenceFallback } from "./evidenceExtractor";
import { reconcileEvidenceWithVehicle } from "./evidenceReconciliation";
import { extractListingFallback } from "./fallbackExtractor";
import { ExtractionResult } from "./types";

export async function extractListingWithAI(
  rawListingText: string
): Promise<ExtractionResult> {
  const useAI = process.env.NEXT_PUBLIC_USE_AI_EXTRACTION === "true";

  if (!useAI) {
    return buildClientFallback(
      rawListingText,
      "AI extraction disabled. Used fallback extractor."
    );
  }

  try {
    const response = await fetch("/api/extract-listing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rawListingText }),
    });

    if (!response.ok) {
      return buildClientFallback(
        rawListingText,
        "API route failed. Used fallback extractor."
      );
    }

    const data = (await response.json()) as ExtractionResult;

    if (!data.vehicle || !data.evidence) {
      return buildClientFallback(
        rawListingText,
        "Invalid API extraction response. Used fallback extractor."
      );
    }

    return data;
  } catch (error) {
    console.error("AI extraction request failed:", error);

    return buildClientFallback(
      rawListingText,
      "AI extraction request failed. Used fallback extractor."
    );
  }
}

function buildClientFallback(
  rawListingText: string,
  extractionNote: string
): ExtractionResult {
  const vehicle = extractListingFallback(rawListingText);

  return {
    vehicle,
    evidence: reconcileEvidenceWithVehicle(
      extractEvidenceFallback(rawListingText),
      vehicle
    ),
    extractionNote,
  };
}
