# AutoRisk Insight - Project State

## Project Overview

AutoRisk Insight is a Next.js + TypeScript project for used car risk analysis in Australia.

The app is designed to help used car buyers paste a marketplace listing from platforms such as Facebook Marketplace, Gumtree, or Carsales, extract key vehicle details, review and edit the extracted information, match model-specific inspection priorities, and generate a quick risk report.

The project is not intended to replace PPSR checks, official recall checks, legal advice, or professional mechanical inspections. It is designed as a decision-support tool for early-stage used car screening.

## Recent Update

- The UI now has a stronger automotive / used-car inspection visual identity.
- A speedometer/gauge-style inline SVG brand mark was added next to `AutoRisk Insight`.
- Hero copy was updated to make the product feel like a pre-purchase listing check: "Before you inspect the car, inspect the listing first."
- The colour palette was refined toward charcoal/deep navy, white cards, a light grey background, subtle borders, and green / amber / orange / red risk-state accents.
- The current staged flow remains `InputView` -> `ReviewView` -> `ResultView`, with the textarea hidden after analysis.
- The Result View remains decision-focused with score, recommendation, summary, and next steps visible while detailed report sections stay collapsed or secondary.
- This was a UI-only change and did not modify business logic, risk scoring logic, extraction logic, known issue matching, known issue data, or TypeScript data models.

## Project Goal

The goal is to build an AI-assisted and rule-based used car risk analysis tool.

The core user flow is:

1. User pastes a raw used car listing.
2. The app extracts vehicle information into a structured VehicleInput.
3. The user reviews and edits the extracted details.
4. The app matches the vehicle against source-backed model-specific inspection priorities.
5. The app runs a rule-based quick risk scan.
6. The app displays a quick risk report and inspection guidance.

## Current Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React state management with useState
- Mock extractor for MVP
- Rule-based risk engine
- Source-backed known issues / inspection priority dataset

OpenAI API is not connected yet. The current MVP uses mock and rule-based logic first.

## Current File Structure

Current important files:

- app/page.tsx
- components/BrandMark.tsx
- components/InputView.tsx
- components/ReviewView.tsx
- components/ResultView.tsx
- components/ScoreRing.tsx
- components/VehicleSummaryCard.tsx
- lib/types.ts
- lib/mockExtractor.ts
- lib/riskEngine.ts
- lib/knownIssueMatcher.ts
- data/knownIssues.ts
- PROJECT_STATE.md

## Current Implementation Status

### 1. app/page.tsx

Current role:

- Orchestrates the staged AutoRisk Insight flow.
- Shows `InputView`, `ReviewView`, or `ResultView` depending on current state.
- Stores the input in rawListingText.
- Uses extractListingMock() to extract vehicle details.
- Lets the user review and edit extracted vehicle information in `ReviewView`.
- Displays a compact Buying Confidence decision card in `ResultView` after running the risk scan.
- Keeps detailed extracted data, inspection priorities, and full risk details collapsed or secondary by default.
- Uses Tailwind CSS for UI styling in component files.

Current flow in page.tsx:

1. User pastes a listing.
2. User clicks Check This Listing.
3. extractListingMock(rawListingText) creates VehicleInput.
4. User reviews and edits extracted details.
5. User clicks Run Listing Check.
6. analyseQuickRisk(...) creates RiskResult.
7. A compact decision-card/dashboard result is displayed.

Current important states:

- rawListingText: stores the raw pasted marketplace listing.
- extractedVehicle: stores the extracted and reviewed VehicleInput.
- riskResult: stores the output from the quick risk engine.
- matchedIssues: stores matched KnownIssue inspection priorities for the reviewed vehicle.

### 2. lib/types.ts

Current role:

Defines the shared data structures used across the project.

Important types:

- VehicleInput
- Recommendation
- RiskLevel
- RiskResult
- KnownIssue
- SourceQuality

Current design direction:

VehicleInput is the structured vehicle data extracted from a listing.

RiskResult is the output of the quick risk engine.

KnownIssue is not treated as a confirmed defect. It is treated as a source-backed model-specific inspection priority.

Important design decision:

KnownIssues are inspection priorities, not confirmed faults.

### 3. lib/mockExtractor.ts

Current role:

Converts raw marketplace listing text into a VehicleInput object.

Current extracted fields include:

- make
- model
- year
- mileage
- price
- transmission
- fuelType
- sellerType
- serviceHistoryStatus
- regoMentioned
- sellerDescription
- rawListingText
- extractionMethod

Current limitations:

- It is still a basic mock/regex-style extractor.
- It may confuse price and year in some cases.
- It does not yet deeply extract fuel type, body style, seller type, or detailed service history.
- It is acceptable for MVP flow testing but should later be improved or replaced with OpenAI structured extraction.

### 4. lib/riskEngine.ts

Current role:

Takes a VehicleInput and generates a RiskResult.

Current risk factors include:

- Unknown make/model/year
- Old vehicle year
- High mileage
- Missing price
- Unknown transmission
- Missing service history
- Rego not mentioned
- Seller red flags such as:
  - selling as is
  - no rwc
  - engine light
  - urgent sale
  - cash only

Current output includes:

- recommendation
- riskScore
- riskLevel
- riskReasons
- missingInformation
- sellerRedFlags

Important future improvement:

riskEngine should eventually accept both VehicleInput and KnownIssue[] so that it can use known issues as context.

However, known issues should not strongly increase risk score by themselves.

### 5. data/knownIssues.ts

Current role:

Stores source-backed model-specific inspection priorities for 10 used car models.

Current dataset direction:

The file contains inspection priority data for common used cars in Australia, including models such as:

- Toyota Corolla
- Toyota Yaris
- Honda Jazz
- Honda Civic
- Mazda 2
- Mazda 3
- Hyundai i30
- Hyundai Getz
- Kia Cerato
- Kia Rio

Each known issue entry includes:

- id
- make
- model
- generation
- yearFrom
- yearTo
- area
- issue
- whyItMatters
- howToInspect
- sellerQuestions
- severity
- confidence
- sourceQuality
- sourceSummary
- sourceName
- sourceUrl
- verificationStatus
- wordingCaution
- optional conditions such as:
  - appliesToFuelTypes
  - appliesToTransmissions
  - appliesToBodyStyles

Important design decision:

The data should be displayed as Model-Specific Inspection Priorities, not as Confirmed Known Faults.

The app should avoid saying that a specific vehicle definitely has a fault unless the listing or user-provided evidence supports it.

### 6. lib/knownIssueMatcher.ts

Current or planned role:

Matches the reviewed VehicleInput against knownIssues.ts.

Expected matching logic:

1. Match by make.
2. Match by model.
3. Match by year range.
4. Optionally match by fuel type.
5. Optionally match by transmission.
6. Optionally match by body style.
7. Return KnownIssue[].

Important matching principle:

The matcher should avoid overmatching.

Examples:

- Manual clutch issue should not appear strongly for an automatic vehicle.
- Diesel DPF issue should not appear strongly for a confirmed petrol vehicle.
- Hatchback recall issue should not appear strongly for a confirmed sedan.
- If fuel type, transmission, or body style is unknown, the app may still show the item, but it should be worded cautiously.

## Important Design Decisions So Far

### 1. Use a single main conversation for now

For the current MVP stage, the project is easier to manage in one ChatGPT conversation because frontend, risk logic, data design, and architecture are still tightly connected.

Splitting into multiple chats too early may create confusion.

Potential future split after MVP:

- Main Brain / Architecture
- Code Implementation
- UI Design
- AI Integration
- Portfolio / README

For now, one conversation is preferred.

### 2. Keep knownIssues separate from confirmed vehicle risk

KnownIssues should not automatically make a car high risk.

Correct interpretation:

KnownIssues = inspection priorities.

Incorrect interpretation:

KnownIssues = this vehicle definitely has these faults.

### 3. knownIssues and riskEngine relationship

Accuracy-first approach:

- knownIssues alone:
  - display as inspection priorities
  - very small or no direct score impact

- knownIssues + missing service history:
  - moderate uncertainty warning

- knownIssues + matching symptom in listing:
  - stronger risk warning

- knownIssues + official recall:
  - required VIN verification

- knownIssues + confirmed unresolved issue:
  - recommendation escalation

The best long-term structure is:

VehicleInput → knownIssueMatcher → matchedIssues

VehicleInput + matchedIssues → riskEngine → RiskResult

But inside riskEngine, knownIssues should be treated as context, not direct proof of fault.

## Current Risk Logic Direction

The risk system should eventually separate risk into different concepts:

### Base Listing Risk

Risk from:

- year
- mileage
- service history
- rego
- price
- seller wording

### Information Uncertainty

Risk from:

- missing information
- vague seller description
- unclear service history
- unknown transmission
- unknown fuel type

### Evidence-Based Warnings

Risk from actual symptoms in the listing, such as:

- engine light
- rough shifting
- overheating
- shudder
- knocking
- misfire
- no RWC
- selling as is

### Inspection Priorities

Model-specific areas to check based on knownIssues.

### Required Verification Checks

Checks such as:

- PPSR
- VIN
- recall
- rego
- service records

This is more accurate than putting everything into one simple score.

## Current MVP Flow Target

The first MVP should complete this flow:

1. Paste listing.
2. Extract VehicleInput.
3. Review/Edit extracted details.
4. Match model-specific inspection priorities.
5. Run quick risk scan.
6. Show Quick Risk Report.

This should be completed before adding OpenAI, database, login, screenshot upload, or deployment.

## Features Not Yet Implemented

Not implemented yet:

- OpenAI API extraction
- OpenAI final report generation
- Screenshot upload / OCR / vision
- Deep Check page
- PPSR input
- Rego verification input
- Service history deep analysis
- Saved listings
- Compare listings
- LocalStorage
- Database
- Login
- Deployment
- README
- Portfolio write-up

## Next Planned Work

Recommended next steps:

1. Test the MVP with several real marketplace listings.
2. Tune score thresholds and wording based on real listing behaviour.
3. Polish the UI for mobile readability, spacing, and clearer scan states.
4. Improve or replace README with current MVP setup and usage notes.
5. Prepare and deploy the app to Vercel.

## Current Accuracy Principle

The project should prioritise cautious and honest analysis.

The app should say:

- This is an inspection priority.
- This should be verified.
- This may require further checking.
- This is a risk signal if the symptom is present.

The app should avoid saying:

- This car has this fault.
- This model is bad.
- This vehicle is safe.
- You should definitely buy this car.

## Current Development Rule

Before adding new major features, complete the current MVP flow.

Avoid adding too many features at once.

Preferred development order:

1. Make the current flow work.
2. Test with real listings.
3. Fix extractor issues.
4. Improve risk logic.
5. Add Deep Check.
6. Add OpenAI extraction.
7. Add save/compare.
8. Polish UI.
9. Write README and portfolio explanation.
