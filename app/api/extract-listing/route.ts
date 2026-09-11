import OpenAI from "openai";
import { NextResponse } from "next/server";

import { extractEvidenceFallback } from "@/lib/evidenceExtractor";
import { reconcileEvidenceWithVehicle } from "@/lib/evidenceReconciliation";
import { extractListingFallback } from "@/lib/fallbackExtractor";
import type {
  EvidenceCategory,
  EvidenceSeverity,
  ExtractionResult,
  ListingEvidence,
  VehicleInput,
} from "@/lib/types";
import { sanitiseVehicleValues } from "@/lib/vehicleValidation";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "missing-openai-api-key",
});

const extractionSchema = {
  type: "object",
  additionalProperties: false,
  required: ["vehicle", "evidence"],
  properties: {
    vehicle: {
      type: "object",
      additionalProperties: false,
      required: [
        "make",
        "model",
        "year",
        "mileage",
        "price",
        "transmission",
        "fuelType",
        "bodyStyle",
        "sellerType",
        "serviceHistoryStatus",
        "regoMentioned",
        "sellerDescription",
      ],
      properties: {
        make: { type: "string" },
        model: { type: "string" },
        year: { type: ["number", "null"] },
        mileage: { type: ["number", "null"] },
        price: { type: ["number", "null"] },
        transmission: { type: "string" },
        fuelType: { type: "string" },
        bodyStyle: { type: "string" },
        sellerType: { type: "string" },
        serviceHistoryStatus: { type: "string" },
        regoMentioned: { type: "boolean" },
        sellerDescription: { type: "string" },
      },
    },
    evidence: {
      type: "object",
      additionalProperties: false,
      required: [
        "positiveSignals",
        "riskSignals",
        "missingInformation",
        "sellerClaims",
      ],
      properties: {
        positiveSignals: {
          type: "array",
          items: { type: "string" },
        },
        riskSignals: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["category", "evidenceText", "severity", "explanation"],
            properties: {
              category: {
                type: "string",
                enum: [
                  "engine",
                  "transmission",
                  "rego",
                  "rwc",
                  "service_history",
                  "accident",
                  "seller_pressure",
                  "price",
                  "mileage",
                  "other",
                ],
              },
              evidenceText: { type: "string" },
              severity: {
                type: "string",
                enum: ["low", "medium", "high"],
              },
              explanation: { type: "string" },
            },
          },
        },
        missingInformation: {
          type: "array",
          items: { type: "string" },
        },
        sellerClaims: {
          type: "array",
          items: { type: "string" },
        },
      },
    },
  },
};

export async function POST(request: Request) {
  let rawListingText = "";

  try {
    const body = await request.json().catch(() => ({}));
    rawListingText = String(body.rawListingText ?? "");

    if (rawListingText.trim().length === 0) {
      return NextResponse.json(
        buildFallbackResult(
          rawListingText,
          "No listing text provided. Used fallback extractor."
        )
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        buildFallbackResult(
          rawListingText,
          "OPENAI_API_KEY is missing. Used fallback extractor."
        )
      );
    }

    const model = process.env.OPENAI_MODEL || "gpt-5-nano";

    const response = await client.responses.create({
      model,
      input: [
        {
          role: "system",
          content:
            "You extract structured vehicle information and listing evidence from Australian used car marketplace listings. Return JSON only. Do not calculate a score, make a purchase recommendation, or decide whether the car is good value. Extract only vehicle data and listing evidence. Interpret informal seller wording semantically: log book/logbook records can indicate service history, rego until a month/date indicates rego is mentioned, and phrases like driven/done/travelled 212k mean 212000 km. Treat seller statements such as drives well, no issues, reliable engine, reliable gearbox, and good car as sellerClaims, not verified mechanical facts. If information is unclear, use Unknown or null. Only include evidence that is actually present or clearly missing from the listing.",
        },
        {
          role: "user",
          content: `Extract vehicle details and listing evidence from this used car listing. Be flexible with Australian used-car shorthand and casual phrasing, but do not infer facts that are not in the listing. Return JSON matching this schema exactly:\n\n${JSON.stringify(
            extractionSchema
          )}\n\nListing:\n${rawListingText}`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "used_car_listing_extraction",
          strict: true,
          schema: extractionSchema,
        },
      },
    });

    const outputText = response.output_text;

    if (!outputText) {
      return NextResponse.json(
        buildFallbackResult(
          rawListingText,
          "OpenAI returned no output. Used fallback extractor."
        )
      );
    }

    const parsed = JSON.parse(outputText);
    const vehicle = normaliseVehicle(parsed.vehicle, rawListingText);
    const evidence = normaliseEvidence(parsed.evidence);
    const fallbackVehicle = extractListingFallback(rawListingText);
    const fallbackEvidence = extractEvidenceFallback(rawListingText);

    if (!isValidExtraction(vehicle, evidence)) {
      return NextResponse.json(
        buildFallbackResult(
          rawListingText,
          "OpenAI response could not be validated. Used fallback extractor."
        )
      );
    }

    const mergedVehicle = mergeVehicles(vehicle, fallbackVehicle);
    const mergedEvidence = reconcileEvidenceWithVehicle(
      mergeEvidence(evidence, fallbackEvidence),
      mergedVehicle
    );

    const result: ExtractionResult = {
      vehicle: mergedVehicle,
      evidence: mergedEvidence,
      extractionNote: `OpenAI extraction succeeded using ${model}; deterministic fallback signals were merged.`,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("OpenAI extraction route failed:", error);

    return NextResponse.json(
      buildFallbackResult(
        rawListingText,
        "OpenAI extraction failed inside API route. Used fallback extractor."
      )
    );
  }
}

function buildFallbackResult(
  rawListingText: string,
  extractionNote: string
): ExtractionResult {
  const vehicle = extractListingFallback(rawListingText);
  const evidence = extractEvidenceFallback(rawListingText);

  return {
    vehicle,
    evidence: reconcileEvidenceWithVehicle(evidence, vehicle),
    extractionNote,
  };
}

function mergeVehicles(
  openAiVehicle: VehicleInput,
  fallbackVehicle: VehicleInput
): VehicleInput {
  return sanitiseVehicleValues({
    ...openAiVehicle,
    make: mergeTextField(openAiVehicle.make, fallbackVehicle.make),
    model: mergeTextField(openAiVehicle.model, fallbackVehicle.model),
    year: openAiVehicle.year ?? fallbackVehicle.year,
    mileage: openAiVehicle.mileage ?? fallbackVehicle.mileage,
    price: openAiVehicle.price ?? fallbackVehicle.price,
    transmission: mergeTextField(
      openAiVehicle.transmission,
      fallbackVehicle.transmission
    ),
    fuelType: mergeTextField(openAiVehicle.fuelType, fallbackVehicle.fuelType),
    bodyStyle: mergeTextField(openAiVehicle.bodyStyle, fallbackVehicle.bodyStyle),
    sellerType: mergeTextField(
      openAiVehicle.sellerType,
      fallbackVehicle.sellerType
    ),
    serviceHistoryStatus: mergeServiceHistoryStatus(
      openAiVehicle.serviceHistoryStatus,
      fallbackVehicle.serviceHistoryStatus
    ),
    regoMentioned: openAiVehicle.regoMentioned || fallbackVehicle.regoMentioned,
    sellerDescription: openAiVehicle.rawListingText,
    rawListingText: openAiVehicle.rawListingText,
    extractionMethod: "openai",
  });
}

function mergeEvidence(
  openAiEvidence: ListingEvidence,
  fallbackEvidence: ListingEvidence
): ListingEvidence {
  return {
    positiveSignals: uniqueStrings([
      ...openAiEvidence.positiveSignals,
      ...fallbackEvidence.positiveSignals,
    ]),
    riskSignals: uniqueRiskSignals([
      ...openAiEvidence.riskSignals,
      ...fallbackEvidence.riskSignals,
    ]),
    missingInformation: uniqueStrings([
      ...openAiEvidence.missingInformation,
      ...fallbackEvidence.missingInformation,
    ]),
    sellerClaims: uniqueStrings([
      ...openAiEvidence.sellerClaims,
      ...fallbackEvidence.sellerClaims,
    ]),
  };
}

function normaliseVehicle(
  vehicle: unknown,
  rawListingText: string
): VehicleInput {
  const input = vehicle as Partial<VehicleInput>;

  return sanitiseVehicleValues({
    make: normaliseText(input?.make),
    model: normaliseText(input?.model),
    year: normaliseNumber(input?.year),
    mileage: normaliseNumber(input?.mileage),
    price: normaliseNumber(input?.price),
    transmission: normaliseText(input?.transmission),
    fuelType: normaliseText(input?.fuelType),
    bodyStyle: normaliseText(input?.bodyStyle),
    sellerType: normaliseText(input?.sellerType),
    serviceHistoryStatus: normaliseText(input?.serviceHistoryStatus),
    regoMentioned: Boolean(input?.regoMentioned),
    sellerDescription:
      normaliseText(input?.sellerDescription) === "Unknown"
        ? rawListingText
        : normaliseText(input?.sellerDescription),
    rawListingText,
    extractionMethod: "openai",
  });
}

function normaliseEvidence(evidence: unknown): ListingEvidence {
  const input = evidence as Partial<ListingEvidence>;

  return {
    positiveSignals: normaliseStringArray(input?.positiveSignals),
    riskSignals: normaliseRiskSignals(input?.riskSignals),
    missingInformation: normaliseStringArray(input?.missingInformation),
    sellerClaims: normaliseStringArray(input?.sellerClaims),
  };
}

function isValidExtraction(
  vehicle: VehicleInput,
  evidence: ListingEvidence
): boolean {
  return (
    typeof vehicle.make === "string" &&
    typeof vehicle.model === "string" &&
    typeof vehicle.rawListingText === "string" &&
    Array.isArray(evidence.positiveSignals) &&
    Array.isArray(evidence.riskSignals) &&
    Array.isArray(evidence.missingInformation) &&
    Array.isArray(evidence.sellerClaims)
  );
}

function normaliseText(value: unknown): string {
  if (typeof value !== "string") {
    return "Unknown";
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return "Unknown";
  }

  return trimmed;
}

function normaliseNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/[$,\s]/g, ""));

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function normaliseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function normaliseRiskSignals(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const signal = item as {
        category?: EvidenceCategory;
        evidenceText?: string;
        severity?: EvidenceSeverity;
        explanation?: string;
      };

      return {
        category: normaliseEvidenceCategory(signal?.category),
        evidenceText: normaliseText(signal?.evidenceText),
        severity: normaliseEvidenceSeverity(signal?.severity),
        explanation: normaliseText(signal?.explanation),
      };
    })
    .filter((signal) => signal.evidenceText !== "Unknown");
}

function normaliseEvidenceCategory(value: unknown): EvidenceCategory {
  const allowed: EvidenceCategory[] = [
    "engine",
    "transmission",
    "rego",
    "rwc",
    "service_history",
    "accident",
    "seller_pressure",
    "price",
    "mileage",
    "other",
  ];

  if (typeof value !== "string") {
    return "other";
  }

  if (allowed.includes(value as EvidenceCategory)) {
    return value as EvidenceCategory;
  }

  return "other";
}

function normaliseEvidenceSeverity(value: unknown): EvidenceSeverity {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }

  return "medium";
}

function mergeTextField(primary: string, fallback: string): string {
  if (isUnknownText(primary) && !isUnknownText(fallback)) {
    return fallback;
  }

  return primary;
}

function mergeServiceHistoryStatus(
  openAiStatus: string,
  fallbackStatus: string
): string {
  if (isFullServiceHistory(fallbackStatus)) {
    return fallbackStatus;
  }

  if (
    isUnknownServiceHistory(openAiStatus) &&
    !isUnknownServiceHistory(fallbackStatus)
  ) {
    return fallbackStatus;
  }

  return openAiStatus;
}

function uniqueStrings(items: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i].trim();
    const key = item.toLowerCase();

    if (!item || seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(item);
  }

  return result;
}

function uniqueRiskSignals(signals: ListingEvidence["riskSignals"]) {
  const seen = new Set<string>();
  const result: ListingEvidence["riskSignals"] = [];

  for (let i = 0; i < signals.length; i++) {
    const signal = signals[i];
    const key = `${signal.category}:${signal.evidenceText.toLowerCase()}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(signal);
  }

  return result;
}

function isUnknownText(value: string): boolean {
  const lowerValue = value.trim().toLowerCase();

  return (
    lowerValue.length === 0 ||
    lowerValue === "unknown" ||
    lowerValue === "not mentioned" ||
    lowerValue === "unclear"
  );
}

function isUnknownServiceHistory(value: string): boolean {
  const lowerValue = value.trim().toLowerCase();

  return (
    isUnknownText(value) ||
    lowerValue === "no service history mentioned" ||
    lowerValue === "service history not mentioned"
  );
}

function isFullServiceHistory(value: string): boolean {
  return value.trim().toLowerCase().includes("full service history");
}
