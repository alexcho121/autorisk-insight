# AutoRisk Insight - Project State

This is the handoff document for future ChatGPT/Codex sessions working on AutoRisk Insight. Read this file and `README.md` before changing the project.

## Product Summary

AutoRisk Insight is a Next.js + TypeScript MVP for budget-aware screening of Australian used-car listings.

The product focuses on affordable listings up to around $15,000. Users select a budget range, paste a raw marketplace listing, review/edit extracted vehicle details, then receive a Buying Confidence Score with short reasons, next steps, and model-specific inspection priorities.

Positioning:

* It is an early-stage screening tool.
* It is not a final purchase recommendation.
* It helps buyers decide whether a listing is worth asking about, inspecting, or spending more time on.
* It should use cautious, evidence-based language.

Core rule:

```txt
OpenAI is used for extraction and evidence detection only.
Fallback extraction keeps the app usable without AI.
AI and fallback extraction are merged to avoid missing clear signals.
The final Buying Confidence Score is rule-based and explainable.
```

## Current Status

The MVP flow is implemented locally:

* Budget range selection.
* Raw listing input.
* Extraction layer with OpenAI path and fallback path.
* API route for OpenAI structured extraction.
* Fallback vehicle extraction.
* Fallback evidence extraction.
* Merge behavior between OpenAI extraction and deterministic fallback extraction.
* Review/edit screen before scoring.
* Known issue matching for model-specific inspection priorities.
* Budget-aware rule-based scoring.
* Compact result screen with Buying Confidence Score, recommendation, summary, top reasons, next steps, vehicle summary, and secondary details.

Known gaps:

* OpenAI extraction still depends on real API key, billing, and model access.
* No screenshot upload, OCR, or vision flow.
* No PPSR, VIN, rego, recall, finance owing, stolen status, or accident-history verification.
* No saved listings, comparisons, accounts, or database.
* No production deployment notes beyond environment variable setup.
* Score thresholds should be tuned against more real Australian listings under $15,000.

## Current User Flow

1. User selects a budget range.
2. User pastes a used-car listing.
3. The extraction layer runs.
4. If AI extraction is enabled, `app/api/extract-listing/route.ts` calls OpenAI.
5. If AI is disabled or unavailable, fallback extraction is used.
6. OpenAI extraction and fallback extraction are merged to improve accuracy.
7. User reviews and edits extracted vehicle details.
8. `knownIssueMatcher.ts` finds model-specific inspection priorities.
9. `riskEngine.ts` calculates a budget-aware Buying Confidence Score.
10. `ResultView` shows a compact result card with score, recommendation, summary, top reasons, next steps, and secondary detailed report.

Screen progression:

```txt
InputView -> ReviewView -> ResultView
```

## Budget Ranges

Current budget ranges:

* Not sure yet
* Under $5,000
* $5,000-$8,000
* $8,000-$11,000
* $11,000-$15,000

Budget range affects age and mileage expectations. A 15-year-old car with high mileage may be more acceptable under $5,000 than in the $11,000-$15,000 range.

Use budget range for budget-aware screening, not absolute car quality judgement.

## Architecture

```txt
app/
  api/
    extract-listing/
      route.ts
  page.tsx
  layout.tsx
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
  mockExtractor.ts
  evidenceExtractor.ts
  knownIssueMatcher.ts
  riskEngine.ts
  types.ts

data/
  knownIssues.ts
```

## Important File Roles

### `app/page.tsx`

Main client-side orchestrator for the staged flow.

Responsibilities:

* Stores raw listing text.
* Stores selected budget range.
* Stores extracted/reviewed vehicle data.
* Stores listing evidence.
* Stores matched known issues.
* Stores final risk result.
* Switches between `InputView`, `ReviewView`, and `ResultView`.
* Starts extraction.
* Runs model-specific inspection priority matching.
* Runs final scoring.
* Resets the flow.

Known issue matching should not block the result flow. If matching fails, continue with an empty inspection priority list.

### `components/InputView.tsx`

Budget and listing input screen.

Responsibilities:

* Shows the budget range options.
* Accepts raw marketplace listing text.
* Calls the extraction handler.
* Shows loading/disabled state while extraction runs.

### `components/ReviewView.tsx`

Review/edit screen.

Responsibilities:

* Displays extracted vehicle fields.
* Lets the user correct vehicle details before scoring.
* Preserves raw listing text and extraction metadata.
* Calls the final scan handler.
* Allows start-over navigation.

The review step is important because extraction can be wrong, especially for messy marketplace text.

### `components/ResultView.tsx`

Final decision screen.

Responsibilities:

* Shows the Buying Confidence Score.
* Shows confidence band, recommendation, summary, top reasons, and next steps.
* Shows `VehicleSummaryCard`.
* Shows model-specific inspection priorities as secondary guidance.
* Shows detailed report information without making the screen feel like a long AI report.
* Uses cautious language around seller claims, missing information, and not confirmed faults.

### `components/ScoreRing.tsx`

Visual score display.

Responsibilities:

* Displays the Buying Confidence Score.
* Uses score/confidence band styling.
* Supports the compact result-card layout.

### `components/VehicleSummaryCard.tsx`

Compact vehicle summary.

Responsibilities:

* Shows the reviewed vehicle identity and key listing details.
* Helps the user confirm the result applies to the correct vehicle.

### `lib/openaiExtractor.ts`

Frontend extraction layer.

Responsibilities:

* Reads `NEXT_PUBLIC_USE_AI_EXTRACTION`.
* Calls `/api/extract-listing` when AI extraction is enabled.
* Runs fallback extraction when AI is disabled or unavailable.
* Merges OpenAI extraction with deterministic fallback extraction.
* Returns a consistent extraction result to the app.

Important: OpenAI extraction must remain extraction-only. It should not calculate the Buying Confidence Score.

### `app/api/extract-listing/route.ts`

Server API route for OpenAI structured extraction.

Responsibilities:

* Uses `process.env.OPENAI_API_KEY`.
* Uses `process.env.OPENAI_MODEL`.
* Accepts raw listing text and relevant request context.
* Requests structured vehicle details and listing evidence from OpenAI.
* Returns vehicle data, listing evidence, and an extraction note.
* Handles errors safely so fallback extraction can be used.

Security rule: never expose `OPENAI_API_KEY` to browser code and never rename it with a `NEXT_PUBLIC_` prefix.

### `lib/mockExtractor.ts`

Deterministic fallback vehicle extractor.

Responsibilities:

* Extracts likely make, model, year, mileage, price, transmission, fuel type, body style, seller type, service history status, and rego mention.
* Normalizes common listing language such as `Driven 212k` into `212000`.
* Keeps the app usable when AI extraction is disabled or unavailable.

### `lib/evidenceExtractor.ts`

Deterministic fallback evidence extractor.

Responsibilities:

* Detects positive signals.
* Detects risk signals.
* Detects missing information.
* Extracts seller claims.
* Flags hard red flags such as no RWC, no rego, engine light, overheating, transmission symptoms, urgent sale, cash only, and selling as-is.
* Treats `no issues` as a seller claim, not verified proof.

### `lib/knownIssueMatcher.ts`

Model-specific inspection priority matcher.

Responsibilities:

* Matches reviewed vehicle details against `data/knownIssues.ts`.
* Uses make, model, year range, fuel type, transmission, and body style where available.
* Avoids clearly mismatched records.
* Allows cautious matching where some attributes are unknown.

Matched known issues are model-specific inspection priorities. They are not confirmed faults unless the listing itself states matching symptoms.

### `lib/riskEngine.ts`

Final rule-based scoring engine.

Responsibilities:

* Accepts reviewed vehicle details, budget context, listing evidence, and matched known issues.
* Calculates the final Buying Confidence Score.
* Produces recommendation, confidence band, summary, top reasons, next steps, detailed risk reasons, seller red flags, missing information, known issue warnings, and required verification checks.
* Keeps scoring explainable and deterministic.

Important: do not move final scoring into OpenAI. AI can assist extraction, but the score must remain rule-based scoring.

### `lib/types.ts`

Shared TypeScript data contracts.

Responsibilities:

* Defines core shapes such as `VehicleInput`, `ListingEvidence`, `EvidenceSignal`, `ExtractionResult`, `RiskResult`, and `KnownIssue`.
* Should be inspected before changing cross-component contracts.

### `data/knownIssues.ts`

Source-backed known issue dataset.

Responsibilities:

* Stores model-specific inspection priority records.
* Includes applicability fields such as make, model, year range, fuel type, transmission, and body style where relevant.
* Includes inspection guidance, seller questions, source information, confidence/severity metadata, and wording caution.

## Extraction Logic

The extraction layer has two sources:

* AI extraction from OpenAI through `app/api/extract-listing/route.ts`.
* Fallback extraction from `mockExtractor.ts` and `evidenceExtractor.ts`.

Current behavior:

* `NEXT_PUBLIC_USE_AI_EXTRACTION=true` attempts AI extraction.
* `NEXT_PUBLIC_USE_AI_EXTRACTION=false` skips AI extraction.
* If AI is unavailable or fails, fallback extraction should still return a usable result.
* OpenAI extraction and fallback extraction are merged so obvious deterministic signals are not lost.

Examples that should work:

* `Driven 212k` should become mileage `212000`.
* `Full log book available` should count as service history.
* `Rego until October` should count as rego mentioned.
* `no issues` should appear as a seller claim, not verified proof.

The user can correct extraction mistakes in `ReviewView` before scoring.

## Scoring Logic Direction

The Buying Confidence Score is a budget-aware screening signal based on listing information, missing information, seller red flags, reviewed vehicle details, and model-specific inspection priorities.

It should reward or preserve confidence for:

* Clear year, make, model, price, and mileage.
* Service history or log book mention.
* Rego mention.
* Reasonable age and mileage for the selected budget range.
* Transparent seller wording.

It should reduce confidence for:

* Missing key information.
* High mileage or age relative to the selected budget.
* No registration.
* No roadworthy certificate where expected.
* Engine light.
* Overheating.
* Transmission issues.
* Selling as-is.
* Cash-only wording.
* Urgent sale pressure.
* Vague or suspicious seller wording.

Known issues should have limited score impact unless the listing includes matching symptoms. They should mainly guide inspection questions.

The score is not an absolute car quality judgement and should never be presented as proof that a car is safe, unsafe, good, or bad.

## Known Issue Handling

Use these terms:

* model-specific inspection priorities
* inspection priorities
* not confirmed faults
* ask the seller
* check during inspection

Avoid:

* confirmed issue
* this car has the fault
* this model is bad
* guaranteed problem

Known issue records should be surfaced as targeted checks. For example, if a known issue applies to a model/year range, the UI can recommend asking about that area or having it inspected.

## Environment Variables

Local development uses `.env.local`:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5.4-nano
NEXT_PUBLIC_USE_AI_EXTRACTION=false
```

Behavior:

* `NEXT_PUBLIC_USE_AI_EXTRACTION=true` enables AI extraction through the API route.
* `NEXT_PUBLIC_USE_AI_EXTRACTION=false` uses fallback extraction.
* `OPENAI_API_KEY` must stay server-side.
* `.env.local` must not be committed.
* Vercel environment variables must be configured separately in Vercel.
* Restart the dev server after changing environment variables.

## Troubleshooting Notes

### AI extraction is not running

Check:

* `.env.local` exists.
* `NEXT_PUBLIC_USE_AI_EXTRACTION=true`.
* `OPENAI_API_KEY` is set.
* `OPENAI_MODEL` is set to a model the account can access.
* OpenAI billing/API access is available.
* The dev server was restarted after changing env vars.

Fallback mode is expected when `NEXT_PUBLIC_USE_AI_EXTRACTION=false`.

### API key appears in browser code

This is wrong. `OPENAI_API_KEY` belongs only in server-only code such as `app/api/extract-listing/route.ts`. Do not expose it through `NEXT_PUBLIC_`.

### Extraction misses an obvious signal

Check:

* Whether AI or fallback extraction was used.
* Whether the raw listing contains noisy marketplace page text.
* Whether fallback parsing handles the wording.
* Whether merge logic is preserving deterministic fallback signals.
* Whether the user can correct the field in `ReviewView`.

### Score feels too harsh or too generous

Check:

* Selected budget range.
* Age and mileage thresholds for that range.
* Whether hard red flags are double-counted.
* Whether missing information is being treated as uncertainty rather than proof of a problem.
* Whether known issues are affecting the score too strongly.

### Known issues sound like confirmed faults

Change the wording. They must be described as model-specific inspection priorities and not confirmed faults.

### App does not progress to the next screen

Check:

* `app/page.tsx` state transitions.
* Extraction errors in the browser console and Next.js terminal.
* Whether fallback extraction returns a valid result.
* Whether known issue matching is throwing and blocking progress.

## Test Listings

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

Expected:

* Higher Buying Confidence Score.
* Service history detected.
* Rego mention detected.
* Mileage treated against selected budget.
* Next steps still include verification.

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

Expected:

* Low Buying Confidence Score.
* Engine light, no RWC, no rego, urgent sale, cash-only, and selling as-is detected.
* Recommendation cautions the user before spending time or money.

### Merge/Normalization Listing

```txt
2012 Honda Civic auto. Driven 212k. Full log book available.
Rego until October. No issues, only selling because upgraded.
$7,200 ono.
```

Expected:

* Mileage normalized to `212000`.
* Service history detected from log book wording.
* Rego mention detected.
* `no issues` captured as a seller claim, not verified evidence.

### Missing-Information Listing

```txt
Toyota Corolla
good condition
drives well
message me for details
```

Expected:

* Cautious Buying Confidence Score.
* Missing year, mileage, price, service history, rego, and RWC surfaced.
* Next steps ask for missing basics before inspection.

## Recommended Next Steps

1. Run fallback-mode tests with the examples above.
2. Test OpenAI extraction with a real API key and available model.
3. Tune budget-aware scoring thresholds using real Australian listings under $15,000.
4. Improve extraction for long marketplace pages with unrelated text.
5. Expand `data/knownIssues.ts` with more source-backed inspection priorities.
6. Verify mobile layout for InputView, ReviewView, and ResultView.
7. Add portfolio screenshots and deployment link to `README.md`.
8. Configure Vercel environment variables before deployment.
9. Consider saved listings or comparison only after the core screening flow is stable.

## Development Guidance

When continuing the project:

* Keep changes targeted.
* Preserve `InputView -> ReviewView -> ResultView`.
* Preserve the review/edit step before scoring.
* Keep OpenAI limited to extraction and evidence detection.
* Keep final scoring rule-based and explainable.
* Keep known issues as model-specific inspection priorities.
* Use cautious wording around seller claims and not confirmed faults.
* Do not commit `.env.local`.

Before changing data contracts, inspect:

* `lib/types.ts`
* `app/page.tsx`
* `components/InputView.tsx`
* `components/ReviewView.tsx`
* `components/ResultView.tsx`
* `lib/openaiExtractor.ts`
* `app/api/extract-listing/route.ts`
* `lib/riskEngine.ts`

Useful commands:

```bash
npm run dev
npm run build
npm run lint
```

## Handoff Prompt

Paste this into a new ChatGPT/Codex conversation:

```txt
You are working on my Next.js + TypeScript project called AutoRisk Insight.

Read README.md and PROJECT_STATE.md first.

AutoRisk Insight is a budget-aware used-car listing screening MVP for Australian buyers. It focuses on affordable listings up to around $15,000. Users select a budget range, paste a raw marketplace listing, review/edit extracted vehicle details, and receive a Buying Confidence Score with short reasons, next steps, and model-specific inspection priorities.

Important rules:
- Use "Buying Confidence Score".
- Use "budget-aware screening".
- Use "extraction layer" and "fallback extraction" when discussing parsing.
- Treat seller claims as unverified claims.
- Treat known issues as model-specific inspection priorities, not confirmed faults.
- Describe the app as an early-stage screening tool, not a final purchase recommendation.
- OpenAI is used only for extraction and evidence detection.
- The final score must remain rule-based scoring.
- If AI extraction is disabled or unavailable, fallback extraction should still work.
- OpenAI extraction and fallback extraction should be merged so clear deterministic signals are preserved.

Please inspect the current source before making changes, keep edits targeted, and preserve the existing MVP flow: InputView -> ReviewView -> ResultView.
```

## Disclaimer

AutoRisk Insight does not replace PPSR checks, official recall checks, registration verification, legal advice, service record verification, finance owing checks, stolen vehicle checks, service record verification, or a professional mechanical inspection. It is an early-stage screening tool for budget-aware listing review.
