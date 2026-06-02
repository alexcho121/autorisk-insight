# AutoRisk Insight

AutoRisk Insight is a Next.js + TypeScript MVP that helps used car buyers screen marketplace listings before contacting the seller or booking an inspection.

The app is designed for Australian used car listings from platforms such as Facebook Marketplace, Gumtree, and Carsales. Users can paste a raw listing, review the extracted vehicle details, and receive a Buying Confidence Score with practical next steps and model-specific inspection priorities.

## Why I Built This

Buying a used car can be difficult because marketplace listings often contain incomplete, messy, or overly promotional information. Important details such as service history, rego status, mileage, price, and seller wording can strongly affect whether a listing is worth checking further.

This project explores how unstructured listing text can be converted into a simple decision-support flow for early-stage used car screening.

## Key Features

* Paste a raw used car listing
* Extract basic vehicle details into structured fields
* Review and edit extracted vehicle information
* Display a detected vehicle summary card
* Show vehicle information as compact chips/pills
* Match model-specific inspection priorities
* Generate a Buying Confidence Score
* Display a circular score ring
* Provide a recommendation and top next steps
* Keep detailed inspection and risk information collapsed by default

## Current User Flow

1. Paste a used car listing.
2. The app extracts key vehicle details.
3. The user reviews and edits the extracted information.
4. The app matches the vehicle against model-specific inspection priorities.
5. The app generates a Buying Confidence Score.
6. The user sees a compact result card with recommendation, summary, and next steps.

## Tech Stack

* Next.js App Router
* TypeScript
* React
* Tailwind CSS
* Rule-based risk engine
* Mock listing extractor
* Source-backed inspection priority dataset

## Project Structure

```txt
app/
  page.tsx
  layout.tsx

components/
  BrandMark.tsx
  InputView.tsx
  ReviewView.tsx
  ResultView.tsx
  ScoreRing.tsx
  VehicleSummaryCard.tsx

lib/
  mockExtractor.ts
  riskEngine.ts
  knownIssueMatcher.ts
  types.ts

data/
  knownIssues.ts
```

## Core Logic

### 1. Listing Extraction

The current MVP uses a mock/rule-based extractor to convert raw listing text into a structured `VehicleInput`.

Example fields:

* Make
* Model
* Year
* Mileage
* Price
* Transmission
* Fuel type
* Body style
* Seller type
* Service history status
* Rego mention

### 2. Review Step

The app does not assume the extracted information is always correct. Users can review and edit the detected vehicle information before running the scan.

### 3. Inspection Priority Matching

The app matches the reviewed vehicle details against a dataset of model-specific inspection priorities.

These are treated as inspection priorities, not confirmed faults.

### 4. Buying Confidence Score

The app uses a rule-based risk engine to generate a Buying Confidence Score.

A higher score means the listing appears more promising based on the available information.

Score bands:

```txt
81–100   Strong Candidate
66–80    Good but Check
46–65    Caution
31–45    High Caution
0–30     Avoid for Now
```

## Important Design Principle

AutoRisk Insight does not tell users to buy or reject a car with certainty.

It is an early screening assistant that helps users decide whether a listing is worth checking further.

The app avoids saying:

* This car definitely has a fault.
* This car is definitely safe.
* You should definitely buy this car.

Instead, it focuses on:

* Missing information
* Seller red flags
* Inspection priorities
* Required verification checks
* Practical next steps

## Current Limitations

This is an MVP and still has limitations.

* The current extractor is rule-based and can misread messy listings.
* Full Carsales page text may include finance ads, reviews, footer links, or unrelated vehicle information.
* The app does not currently use OpenAI API extraction.
* The app does not verify PPSR, rego, VIN, recall status, or service history.
* The app does not replace a professional mechanical inspection.
* The known issues dataset is used for inspection guidance, not diagnosis.

## Planned Improvements

* Add OpenAI structured extraction for more accurate listing parsing
* Add validation and normalisation after AI extraction
* Improve handling of long Carsales/Gumtree/Facebook listing text
* Add stronger evidence-based extraction notes
* Add optional screenshot/image input
* Add saved listings
* Add listing comparison
* Improve README with screenshots and deployment link

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Build the project:

```bash
npm run build
```

## Disclaimer

AutoRisk Insight is an early-stage screening tool. It does not replace PPSR checks, official recall checks, rego verification, legal advice, or a professional mechanical inspection.
