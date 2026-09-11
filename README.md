# AutoRisk Insight

AutoRisk Insight is a small Next.js app for screening used-car listings. It helps a buyer review a listing before deciding whether to inspect the car or ask the seller more questions.

The app is not a replacement for a mechanic, PPSR check, or official registration check. It is a first-pass tool for spotting missing details and common warning signs.

## Main Features

- Extracts vehicle details from pasted listing text.
- Uses OpenAI for extraction, with a deterministic fallback when AI is off or unavailable.
- Lets the user review and edit extracted details before scoring.
- Matches the vehicle against known model-specific inspection priorities.
- Produces a rule-based buying confidence score with reasons and next steps.

## Tech Stack

- Next.js
- React
- TypeScript
- OpenAI API

## How It Works

The user pastes listing text and selects a budget range. The app extracts vehicle details, validates obvious values, and falls back to local extraction when needed. It then matches known issue data for the make, model, year, and other details. The final buying confidence score is calculated by deterministic rules, not by AI. The result shows the score, key reasons, missing information, and inspection priorities.

## Key Implementation

- Rule-based scoring is kept separate from AI extraction.
- Fallback extraction handles common marketplace wording such as mileage, rego, service history, and seller pressure.
- Manual edits are treated as the source of truth before scoring.
- Evidence is reconciled so stale extraction signals do not contradict edited vehicle details.
- Known issues are shown as inspection priorities, not confirmed faults.

## Run Locally

Install dependencies:

```bash
npm install
```

Create a local environment file if you want to use AI extraction:

```env
OPENAI_API_KEY=your_api_key_here
NEXT_PUBLIC_USE_AI_EXTRACTION=true
```

To use only the local fallback extractor, set:

```env
NEXT_PUBLIC_USE_AI_EXTRACTION=false
```

Run the app:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Run checks:

```bash
npm test
npm run lint
npm run build
```
