# AutoRisk Insight

AutoRisk Insight is a Next.js + TypeScript MVP for budget-aware screening of Australian used-car listings.

It is designed for affordable used-car listings up to around $15,000. A buyer selects a budget range, pastes a raw marketplace listing, reviews the extracted vehicle details, and receives a Buying Confidence Score with short reasons, next steps, and model-specific inspection priorities.

AutoRisk Insight is an early-stage screening tool, not a final purchase recommendation. It helps buyers decide whether a listing is worth asking about, inspecting, or spending more time on.

## What It Does

Used-car listings are often incomplete, vague, or written in messy marketplace language. AutoRisk Insight turns raw listing text into a structured review flow:

* Extract vehicle details such as make, model, year, price, mileage, transmission, fuel type, registration mention, and service history.
* Detect listing evidence, seller claims, missing information, and hard red flags.
* Let the user review and edit extracted details before scoring.
* Match model-specific inspection priorities from a source-backed dataset.
* Calculate a transparent, budget-aware Buying Confidence Score.
* Show a compact result with a recommendation, top reasons, next steps, and secondary detailed report.

## Budget-Aware Screening

The scoring engine considers the selected budget range because expectations change by price band. A high-mileage older car may be normal under $5,000, while the same signals are more concerning in the $11,000-$15,000 range.

Current budget ranges:

* Not sure yet
* Under $5,000
* $5,000-$8,000
* $8,000-$11,000
* $11,000-$15,000

Hard red flags still matter in every budget range, including engine light, overheating, transmission symptoms, no rego, no RWC, selling as-is, cash-only wording, and urgent sale pressure.

## AI Extraction + Fallback Merge

OpenAI is used for extraction and evidence detection only. It does not calculate the final score.

When `NEXT_PUBLIC_USE_AI_EXTRACTION=true`, the frontend extraction layer calls `app/api/extract-listing/route.ts`, which asks OpenAI for structured vehicle details and listing evidence. When AI is disabled or unavailable, the app uses fallback extraction from deterministic local logic.

AI extraction and fallback extraction are merged to avoid missing clear signals. For example:

* `Driven 212k` should become mileage `212000`.
* `Full log book available` should count as service history.
* `Rego until October` should count as rego mentioned.
* `no issues` should be treated as a seller claim, not verified proof.

The final Buying Confidence Score is produced by rule-based scoring in `lib/riskEngine.ts`, so the result remains explainable and independent of AI output.

## User Flow

1. User selects a budget range.
2. User pastes a used-car listing.
3. The extraction layer runs.
4. If AI extraction is enabled, `app/api/extract-listing/route.ts` calls OpenAI.
5. If AI is disabled or unavailable, fallback extraction is used.
6. OpenAI extraction and fallback extraction are merged to improve accuracy.
7. User reviews and edits extracted vehicle details.
8. `knownIssueMatcher.ts` finds model-specific inspection priorities.
9. `riskEngine.ts` calculates a budget-aware Buying Confidence Score.
10. `ResultView` shows the score, recommendation, summary, top reasons, next steps, and secondary detailed report.

## Key Features

* Raw marketplace listing paste input.
* Budget range selection for realistic expectations.
* AI-assisted extraction with deterministic fallback extraction.
* Merged extraction layer for stronger mileage, rego, service history, and seller-claim detection.
* Review/edit step before scoring.
* Rule-based scoring with clear reasons.
* Compact Buying Confidence Score result card.
* Practical next steps before contacting a seller or booking an inspection.
* Model-specific inspection priorities from `data/knownIssues.ts`.
* Cautious wording that separates listing evidence, seller claims, missing information, and not confirmed faults.

## Tech Stack

* Next.js App Router
* React
* TypeScript
* Tailwind CSS
* OpenAI SDK
* Server API route for structured extraction
* Rule-based fallback extraction
* Rule-based scoring engine
* Source-backed known issue dataset

## Project Structure

```txt
app/
  api/
    extract-listing/
      route.ts
  layout.tsx
  page.tsx
  globals.css

components/
  BrandMark.tsx
  InputView.tsx
  ReviewView.tsx
  ResultView.tsx
  ScoreRing.tsx
  VehicleSummaryCard.tsx

lib/
  openaiExtractor.ts
  fallbackExtractor.ts
  evidenceReconciliation.ts
  evidenceExtractor.ts
  knownIssueMatcher.ts
  riskEngine.ts
  types.ts

data/
  knownIssues.ts
```

## Setup

Install dependencies:

```bash
npm install
```

Create `.env.local` in the project root:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5.4-nano
NEXT_PUBLIC_USE_AI_EXTRACTION=false
```

Run locally:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Environment behavior:

* `NEXT_PUBLIC_USE_AI_EXTRACTION=true` enables AI extraction through the API route.
* `NEXT_PUBLIC_USE_AI_EXTRACTION=false` uses fallback extraction.
* `OPENAI_API_KEY` must stay server-side.
* `.env.local` must not be committed.
* Vercel environment variables must be configured separately from local `.env.local`.

## Test Listing Examples

### Stronger Listing

```txt
2016 Toyota Corolla automatic petrol sedan
125,000km
$13,500
full service history
rego until December
drives well
private sale
```

Expected behavior: stronger Buying Confidence Score, positive service history signal, rego mention, reasonable mileage for the selected budget, and verification-focused next steps.

### Risky Listing

```txt
2009 Mazda 3 automatic
245,000km
$3,800
no rwc
no rego
engine light on
urgent sale
cash only
selling as is
```

Expected behavior: low Buying Confidence Score, hard red flags surfaced clearly, and next steps that caution against spending time or money without verification.

### Messy Listing

```txt
2012 Honda Civic auto. Driven 212k. Full log book available.
Rego until October. No issues, only selling because upgraded.
$7,200 ono.
```

Expected behavior: mileage normalized to `212000`, service history and rego detected, and `no issues` treated as a seller claim rather than proof.

### Missing-Information Listing

```txt
Toyota Corolla
good condition
drives well
message me for details
```

Expected behavior: cautious score, missing-information reasons, and next steps asking for year, mileage, price, service history, registration, and roadworthy certificate details.

## Limitations

* The app does not verify PPSR, VIN, registration, recall status, accident history, finance owing, stolen status, or service records.
* It does not replace a professional mechanical inspection.
* AI extraction depends on OpenAI API availability, billing, model access, and environment configuration.
* Fallback extraction can misread vague, long, or noisy marketplace text.
* Seller claims are not verified proof.
* Known issues are model-specific inspection priorities, not confirmed faults.
* The Buying Confidence Score is a screening signal, not an absolute judgement of car quality.

## Disclaimer

AutoRisk Insight is an early-stage screening tool for budget-aware used-car listing review. It does not provide legal, financial, safety, or mechanical advice and does not replace PPSR checks, official recall checks, registration verification, service record verification, or a professional inspection.
