import { KnownIssue } from "@/lib/types";

export const knownIssues: KnownIssue[] = [
  // =========================================================
  // Toyota Corolla
  // =========================================================
  {
    id: "toyota-corolla-2007-2013-alternator-eps",
    make: "Toyota",
    model: "Corolla",
    generation: "ZRE150 / ZRE152",
    yearFrom: 2007,
    yearTo: 2013,
    area: "Charging system / electric power steering",
    issue:
      "Alternator wear may reduce charging output and can affect electric power steering assistance.",
    whyItMatters:
      "A weak alternator can cause battery warning lights, charging issues, and reduced steering assistance. This can lead to unexpected repair cost after purchase.",
    howToInspect: [
      "Check whether the battery warning light appears on the dashboard.",
      "During the test drive, check whether steering assistance feels consistent.",
      "Ask whether the alternator or battery has been replaced recently.",
      "If possible, ask a mechanic to perform a charging-system voltage test.",
    ],
    sellerQuestions: [
      "Has the alternator ever been replaced?",
      "Have you had any battery warning light or steering warning issues?",
      "Has the battery recently been replaced because of charging problems?",
    ],
    severity: "High",
    confidence: "Medium",
    sourceQuality: "repair-pattern",
    sourceSummary:
      "AutoGuru lists alternator replacement as a common repair request for Toyota Corolla ZRE150/ZRE152 2007–2013 and notes reduced alternator output can affect electric power steering assistance.",
    sourceName: "AutoGuru Toyota Corolla 2007–2013 common repairs",
    sourceUrl:
      "https://www.autoguru.com.au/car-advice/articles/toyota-corolla-2007-to-2013-5-most-common-repairs",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Present as an inspection priority, not as a guaranteed Corolla fault.",
  },
  {
    id: "toyota-corolla-2007-2013-ignition-coil",
    make: "Toyota",
    model: "Corolla",
    generation: "ZRE150 / ZRE152",
    yearFrom: 2007,
    yearTo: 2013,
    area: "Ignition system",
    issue:
      "Ignition coil failure may cause misfiring, rough running, flashing engine light, or increased fuel consumption.",
    whyItMatters:
      "Misfires can indicate ignition problems and may require diagnosis, coil replacement, or spark plug replacement.",
    howToInspect: [
      "Start the engine and listen for rough idle.",
      "Check whether the engine warning light is on or flashing.",
      "During the test drive, check for hesitation under acceleration.",
      "Ask whether ignition coils or spark plugs have been replaced.",
    ],
    sellerQuestions: [
      "Has the car ever had a misfire?",
      "Have any ignition coils been replaced?",
      "When were the spark plugs last changed?",
    ],
    severity: "Medium",
    confidence: "Medium",
    sourceQuality: "repair-pattern",
    sourceSummary:
      "AutoGuru lists ignition coil failure as a common repair request for Corolla ZRE150/ZRE152 and describes symptoms including misfiring, flashing engine light, and increased fuel consumption.",
    sourceName: "AutoGuru Toyota Corolla 2007–2013 common repairs",
    sourceUrl:
      "https://www.autoguru.com.au/car-advice/articles/toyota-corolla-2007-to-2013-5-most-common-repairs",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Use only as a symptom-based check. Do not state that the vehicle has ignition coil failure unless symptoms are present.",
  },
  {
    id: "toyota-corolla-2007-2013-headlight-switch",
    make: "Toyota",
    model: "Corolla",
    generation: "ZRE150 / ZRE152",
    yearFrom: 2007,
    yearTo: 2013,
    area: "Lighting / switchgear",
    issue:
      "Headlight combination switch operation should be checked for intermittent or failed function.",
    whyItMatters:
      "Lighting faults can affect safety, roadworthy condition, and may require switchgear replacement.",
    howToInspect: [
      "Turn headlights, high beam, indicators, and park lights on and off several times.",
      "Check whether the stalk feels loose, sticky, or inconsistent.",
      "Walk around the car and confirm all exterior lights operate correctly.",
    ],
    sellerQuestions: [
      "Have there been any issues with the headlights or indicator stalk?",
      "Has the headlight switch ever been replaced?",
    ],
    severity: "Medium",
    confidence: "Medium",
    sourceQuality: "repair-pattern",
    sourceSummary:
      "AutoGuru describes headlight combination switch replacement as a repair item for this Corolla generation.",
    sourceName: "AutoGuru Toyota Corolla 2007–2013 common repairs",
    sourceUrl:
      "https://www.autoguru.com.au/car-advice/articles/toyota-corolla-2007-to-2013-5-most-common-repairs",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Present as a quick functional check rather than a model-wide defect.",
  },

  // =========================================================
  // Toyota Yaris
  // =========================================================
  {
    id: "toyota-yaris-2012-2020-clear-coat",
    make: "Toyota",
    model: "Yaris",
    generation: "XP130",
    yearFrom: 2012,
    yearTo: 2020,
    area: "Paint / exterior condition",
    issue:
      "Clear coat cracking, perforation, or peeling should be checked on exposed panels.",
    whyItMatters:
      "Paint deterioration can reduce resale value and may require expensive cosmetic repair.",
    howToInspect: [
      "Inspect roof, bonnet, boot, and upper door surfaces in daylight.",
      "Look for cloudy patches, pin holes, cracking, or peeling clear coat.",
      "Check whether the car has lived outside for long periods.",
    ],
    sellerQuestions: [
      "Has any paint correction or respray work been done?",
      "Has the car usually been parked outside?",
    ],
    severity: "Medium",
    confidence: "Medium",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales notes owner reports of clear coat cracking and perforation on Toyota Yaris 2012–2020 examples, potentially leading to sections peeling away.",
    sourceName: "Carsales Toyota Yaris 2012–2020 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-a-used-toyota-yaris-2012-20-139319/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Use as an exterior inspection priority, especially for cars stored outdoors.",
  },
  {
    id: "toyota-yaris-2012-2020-cv-joint",
    make: "Toyota",
    model: "Yaris",
    generation: "XP130",
    yearFrom: 2012,
    yearTo: 2020,
    area: "Front driveline / CV joints",
    issue:
      "Clicking sounds when turning and accelerating may indicate CV joint wear.",
    whyItMatters:
      "A worn CV joint can lead to repair cost and may worsen if ignored.",
    howToInspect: [
      "During a slow test drive, turn tightly left and right while gently accelerating.",
      "Listen for clicking sounds from the front end.",
      "Inspect CV boots for splits or grease leaks if possible.",
    ],
    sellerQuestions: [
      "Have the CV joints or driveshafts ever been replaced?",
      "Have you noticed clicking when turning?",
    ],
    severity: "Medium",
    confidence: "Medium",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales advises listening for clicking sounds from the front end while turning and accelerating on used Toyota Yaris 2012–2020 examples.",
    sourceName: "Carsales Toyota Yaris 2012–2020 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-a-used-toyota-yaris-2012-20-139319/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Do not diagnose CV joint failure without a test drive symptom or mechanic inspection.",
  },
  {
    id: "toyota-yaris-2012-2016-takata-check",
    make: "Toyota",
    model: "Yaris",
    generation: "XP130 early models",
    yearFrom: 2012,
    yearTo: 2016,
    area: "Recall / airbags",
    issue:
      "Early examples should have recall status checked using VIN, especially for airbag-related recall history.",
    whyItMatters:
      "Outstanding safety recalls should be resolved before purchase. Recall status can vary by VIN and market.",
    howToInspect: [
      "Ask the seller for the VIN.",
      "Check official recall status before purchase.",
      "Ask for service records showing recall work if applicable.",
    ],
    sellerQuestions: [
      "Do you have the VIN available?",
      "Has the car had any recall work completed?",
      "Can you provide records from Toyota or a dealer?",
    ],
    severity: "High",
    confidence: "Medium",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales advises checking early Yaris hatchbacks and sedans built until MY16 for potentially affected Takata airbag components using VIN.",
    sourceName: "Carsales Toyota Yaris 2012–2020 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-a-used-toyota-yaris-2012-20-139319/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Always tell the user to verify recall status officially by VIN. Do not assume a specific vehicle is affected.",
  },

  // =========================================================
  // Honda Jazz
  // =========================================================
  {
    id: "honda-jazz-2002-2008-cvt-shudder",
    make: "Honda",
    model: "Jazz",
    generation: "GD",
    yearFrom: 2002,
    yearTo: 2008,
    area: "CVT transmission",
    issue:
      "CVT shudder under acceleration or slow engagement into Drive/Reverse should be treated as a major warning sign.",
    whyItMatters:
      "CVT repairs can be expensive, and severe shudder or delayed engagement can indicate a high-risk purchase.",
    howToInspect: [
      "From a stop, accelerate gently and check for shudder.",
      "Shift from P to D and R and check for delay.",
      "Test drive after the car is warm and cold if possible.",
      "Avoid the car if shudder is obvious unless inspected professionally.",
    ],
    sellerQuestions: [
      "Has the CVT fluid been changed with the correct Honda fluid?",
      "Has the transmission ever shuddered or delayed when selecting Drive?",
    ],
    severity: "High",
    confidence: "High",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales warns that CVT shudder under acceleration or slow response when shifted into Drive or Reverse can mean serious repair costs on early Honda Jazz models.",
    sourceName: "Carsales Honda Jazz GD 2002–2008 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-used-honda-jazz-gd-2002-08-33086/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Only apply this as a high-priority issue when the car has CVT/automatic symptoms or transmission type is unknown.",
    appliesToTransmissions: ["Automatic", "CVT", "Unknown"],
  },
  {
    id: "honda-jazz-2002-2008-valvetrain-oilways",
    make: "Honda",
    model: "Jazz",
    generation: "GD",
    yearFrom: 2002,
    yearTo: 2008,
    area: "Engine maintenance / valvetrain",
    issue:
      "Poor servicing can promote oil-way blockage, camshaft wear, valve-train noise, or timing-chain rattle.",
    whyItMatters:
      "Small Honda engines are durable when maintained, but neglected oil changes can create internal engine wear.",
    howToInspect: [
      "Ask for service records showing regular oil changes.",
      "Listen for ticking, tapping, or rattling from the top of the engine on cold start.",
      "Check oil condition and look for signs of neglected servicing.",
    ],
    sellerQuestions: [
      "How often was the oil changed?",
      "Do you have service records?",
      "Has the engine ever had valve adjustment or timing-chain work?",
    ],
    severity: "High",
    confidence: "High",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales notes that poor servicing can block oil-ways and promote camshaft and valve-train wear in early Honda Jazz models.",
    sourceName: "Carsales Honda Jazz GD 2002–2008 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-used-honda-jazz-gd-2002-08-33086/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Present as a maintenance-history priority rather than a guaranteed mechanical fault.",
  },
  {
    id: "honda-jazz-2002-2008-rear-wheel-bearing",
    make: "Honda",
    model: "Jazz",
    generation: "GD",
    yearFrom: 2002,
    yearTo: 2008,
    area: "Rear wheel bearings",
    issue:
      "Constant-speed rumbling noise from the rear may indicate rear wheel bearing wear.",
    whyItMatters:
      "Wheel bearing noise affects safety, comfort, and can require replacement.",
    howToInspect: [
      "Test drive with the radio off.",
      "Listen for a constant rumble that changes with road speed.",
      "Ask a mechanic to inspect rear wheel bearings if noise is present.",
    ],
    sellerQuestions: [
      "Have the rear wheel bearings ever been replaced?",
      "Do you notice any humming or rumbling at speed?",
    ],
    severity: "Medium",
    confidence: "High",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales notes rear wheel-bearing noise in early Honda Jazz examples and recommends checking service records and test driving with the radio off.",
    sourceName: "Carsales Honda Jazz GD 2002–2008 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-used-honda-jazz-gd-2002-08-33086/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Only report as a possible issue if noise is present or records are unclear.",
  },
  {
    id: "honda-jazz-2005-2007-power-window-headlight-recalls",
    make: "Honda",
    model: "Jazz",
    generation: "GD",
    yearFrom: 2005,
    yearTo: 2007,
    area: "Electrical / recall history",
    issue:
      "Power-window switch and headlight wiring recall history should be checked on relevant early examples.",
    whyItMatters:
      "Outstanding electrical recall work can affect safety and roadworthy condition.",
    howToInspect: [
      "Ask for VIN and check Honda recall status.",
      "Test all windows and headlight functions.",
      "Inspect headlamp covers for frosting or poor light output.",
    ],
    sellerQuestions: [
      "Has the car had any Honda recall work completed?",
      "Do all power windows and headlights work correctly?",
    ],
    severity: "High",
    confidence: "High",
    sourceQuality: "official-recall",
    sourceSummary:
      "Carsales notes 2011 recall activity for 2005–2007 Jazz power-window switch replacement and 2002–2005 headlight wiring; Honda Australia also provides a VIN recall checker.",
    sourceName: "Carsales Honda Jazz GD / Honda Australia recall checker",
    sourceUrl: "https://www.honda.com.au/recall",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Tell the user to confirm recall status by VIN. Do not assume the specific vehicle is affected.",
  },

  // =========================================================
  // Honda Civic
  // =========================================================
  {
    id: "honda-civic-2006-2012-takata-airbag",
    make: "Honda",
    model: "Civic",
    generation: "8th generation",
    yearFrom: 2006,
    yearTo: 2012,
    area: "Recall / airbags",
    issue:
      "Takata airbag recall status must be checked by VIN before purchase.",
    whyItMatters:
      "Takata airbag defects are serious safety issues. Outstanding recall work should be resolved before buying.",
    howToInspect: [
      "Ask the seller for the VIN.",
      "Check Honda Australia recall status.",
      "Look for dealer service records showing airbag recall completion.",
    ],
    sellerQuestions: [
      "Has the Takata airbag recall been completed?",
      "Can you provide proof of recall completion?",
      "Can I check the VIN before inspection?",
    ],
    severity: "High",
    confidence: "High",
    sourceQuality: "official-recall",
    sourceSummary:
      "Carsales warns that Civics of this age may be affected by Takata airbag recall work, and Honda Australia provides VIN/rego recall checking.",
    sourceName: "Carsales Honda Civic 2006–2012 / Honda Australia recall checker",
    sourceUrl: "https://www.honda.com.au/recall",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Do not state that every Civic is affected. Always require VIN-based confirmation.",
  },
  {
    id: "honda-civic-2006-2012-service-oil",
    make: "Honda",
    model: "Civic",
    generation: "8th generation",
    yearFrom: 2006,
    yearTo: 2012,
    area: "Engine maintenance",
    issue:
      "High-revving Honda engines should have evidence of frequent oil and filter changes.",
    whyItMatters:
      "Good lubrication history is important for engine longevity. Missing records increase uncertainty on higher-kilometre examples.",
    howToInspect: [
      "Ask for service history and oil change intervals.",
      "Look for regular six-month or mileage-based oil changes.",
      "Listen for abnormal engine noise on cold start.",
    ],
    sellerQuestions: [
      "How often was the engine oil changed?",
      "Do you have service receipts?",
      "Has the car mainly been used for short trips or highway driving?",
    ],
    severity: "Medium",
    confidence: "High",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales advises that observing service schedules may not be enough for high-revving Honda engines and recommends checking that oil and filters have been changed regularly.",
    sourceName: "Carsales Honda Civic 2006–2012 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-used-honda-civic-2006-12-111838/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Use as a maintenance-confidence check, not a claim of engine damage.",
  },
  {
    id: "honda-civic-2006-2012-cv-driveshaft-power-steering",
    make: "Honda",
    model: "Civic",
    generation: "8th generation",
    yearFrom: 2006,
    yearTo: 2012,
    area: "Driveshaft / power steering",
    issue:
      "Higher-kilometre cars should be checked for CV clicks, damaged driveshaft boots, leaks, and power steering seal issues.",
    whyItMatters:
      "Driveline and steering repairs can add meaningful cost after purchase.",
    howToInspect: [
      "Check rubber driveshaft boots for splits or grease leaks.",
      "Turn tightly during a slow test drive and listen for CV clicking.",
      "Inspect for fluid leaks around steering components.",
    ],
    sellerQuestions: [
      "Have the CV joints or driveshafts been replaced?",
      "Has the power steering system had any leaks?",
      "Have any front-end components been repaired?",
    ],
    severity: "Medium",
    confidence: "High",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales advises checking Civics over 100,000km for driveshaft universal joints, power steering seals, leaks, damaged boots, and CV clicks.",
    sourceName: "Carsales Honda Civic 2006–2012 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-used-honda-civic-2006-12-111838/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Prioritise this issue for higher-kilometre vehicles or where symptoms are present.",
  },

  // =========================================================
  // Mazda 2
  // =========================================================
  {
    id: "mazda-2-2014-2019-clutch-shudder",
    make: "Mazda",
    model: "Mazda 2",
    generation: "DJ / DL",
    yearFrom: 2014,
    yearTo: 2019,
    area: "Clutch / manual transmission",
    issue:
      "Clutch shudder may be noticeable when moving away on a hill or when the transmission is cold.",
    whyItMatters:
      "Clutch shudder can point to clutch wear or driveline issues and may require repair.",
    howToInspect: [
      "If manual, test the car from cold.",
      "Move away slowly on a slight incline if safe.",
      "Check for vibration, judder, or poor clutch take-up.",
    ],
    sellerQuestions: [
      "Has the clutch ever been replaced?",
      "Do you notice shudder when moving off on hills?",
    ],
    severity: "Medium",
    confidence: "High",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales lists clutch shudder as a used Mazda2 DJ/DL check point, especially when moving away on a hill or when cold.",
    sourceName: "Carsales Mazda2 DJ/DL 2014–2019 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-a-used-mazda2-dj-dl-series-2014-19-147434/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Only apply to manual examples or when transmission type is unknown.",
    appliesToTransmissions: ["Manual", "Unknown"],
  },
  {
    id: "mazda-2-2017-2019-fuel-pump-recall",
    make: "Mazda",
    model: "Mazda 2",
    generation: "DJ / DL",
    yearFrom: 2017,
    yearTo: 2019,
    area: "Recall / fuel pump",
    issue:
      "Fuel pump recall completion should be checked on potentially affected 2017–2019 examples.",
    whyItMatters:
      "The low-pressure fuel pump impeller may deform and cause stalling, increasing crash risk.",
    howToInspect: [
      "Ask for the VIN.",
      "Check Mazda official recall status.",
      "Ask whether the fuel pump recall has been completed.",
    ],
    sellerQuestions: [
      "Has the fuel pump recall been completed?",
      "Can you provide VIN so I can check official recall status?",
    ],
    severity: "High",
    confidence: "High",
    sourceQuality: "official-recall",
    sourceSummary:
      "The Australian Vehicle Recalls database lists Mazda2 DJ/DL among vehicles affected by a low-pressure fuel pump impeller recall that can cause the fuel pump to stop working and the vehicle to stall.",
    sourceName: "Australian Vehicle Recalls REC-005009 / Mazda recalls",
    sourceUrl: "https://www.vehiclerecalls.gov.au/recalls/rec-005009",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Do not assume the vehicle is affected without checking VIN. Present as a recall-status check.",
  },
  {
    id: "mazda-2-2007-2013-safety-equipment-check",
    make: "Mazda",
    model: "Mazda 2",
    generation: "DE",
    yearFrom: 2007,
    yearTo: 2013,
    area: "Safety equipment / model year",
    issue:
      "Earlier examples should be checked for safety equipment level, especially stability and traction control availability.",
    whyItMatters:
      "Safety equipment differs by model year and trim. This affects buyer suitability, especially for first-car buyers.",
    howToInspect: [
      "Confirm exact year, trim, and safety equipment.",
      "Check whether stability control and traction control are fitted.",
      "Check ANCAP/safety rating context for the specific year.",
    ],
    sellerQuestions: [
      "What exact trim level is this Mazda2?",
      "Does it have stability control and traction control?",
      "Can you provide the VIN or build plate photo?",
    ],
    severity: "Medium",
    confidence: "Medium",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales notes that Mazda2 gained stability and traction controls in 2012 and then qualified for a five-star ANCAP rating.",
    sourceName: "Carsales Mazda2 2007–2013 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-used-mazda-2-2007-2013-100175/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "This is a safety-equipment verification item, not a mechanical fault.",
  },

  // =========================================================
  // Mazda 3
  // =========================================================
  {
    id: "mazda-3-2009-2013-panel-sill-damage",
    make: "Mazda",
    model: "Mazda 3",
    generation: "BL",
    yearFrom: 2009,
    yearTo: 2013,
    area: "Body / accident damage",
    issue:
      "Check for poor panel alignment, broken bumper clips, sill crushing, and exhaust damage.",
    whyItMatters:
      "Hidden body or underside damage can indicate careless use, poor repairs, or accident history.",
    howToInspect: [
      "Inspect front and rear bumper alignment.",
      "Check bumper clips and panel gaps.",
      "Look under the centre of the car for sill crushing or exhaust damage.",
    ],
    sellerQuestions: [
      "Has the car ever been in an accident?",
      "Has any bumper or sill repair been done?",
    ],
    severity: "Medium",
    confidence: "High",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales advises checking Mazda3 BL examples for panel alignment, bumper clips, sill crushing, and exhaust damage.",
    sourceName: "Carsales Mazda3 2009–2013 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-used-mazda-3-2009-13-104907/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Present as a body inspection item, not a statement of accident history.",
  },
  {
    id: "mazda-3-2009-2013-hatch-strut-recall",
    make: "Mazda",
    model: "Mazda 3",
    generation: "BL hatchback",
    yearFrom: 2009,
    yearTo: 2013,
    area: "Recall / hatch struts",
    issue:
      "For hatchback models, check whether hatch strut recall work has been completed.",
    whyItMatters:
      "Corroded or failed hatch struts can create safety risk if the hatch is not supported properly.",
    howToInspect: [
      "Confirm whether the car is a hatchback.",
      "Open the hatch and check whether it stays up securely.",
      "Ask for recall repair records or check official recall status.",
    ],
    sellerQuestions: [
      "Has any hatch strut recall work been completed?",
      "Do you have dealer records for recall repairs?",
    ],
    severity: "High",
    confidence: "High",
    sourceQuality: "official-recall",
    sourceSummary:
      "Carsales notes that BL hatchbacks were recalled for poorly painted hatch struts that could corrode and fail.",
    sourceName: "Carsales Mazda3 2009–2013 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-used-mazda-3-2009-13-104907/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Only apply to hatchback examples and always verify by official recall status.",
    appliesToBodyStyles: ["Hatch", "Hatchback", "Unknown"],
  },
  {
    id: "mazda-3-2009-2013-front-end-suspension-engine-mount",
    make: "Mazda",
    model: "Mazda 3",
    generation: "BL",
    yearFrom: 2009,
    yearTo: 2013,
    area: "Front suspension / engine mounts",
    issue:
      "Front-end thumps or rattles may point to worn suspension bushes or premature engine mount failure.",
    whyItMatters:
      "Suspension or engine mount wear can affect comfort, handling, and repair cost.",
    howToInspect: [
      "Drive over small bumps at low speed and listen for thumps or rattles.",
      "Check for vibration at idle or when shifting between D and R.",
      "Look for uneven tyre wear.",
      "Ask for a mechanic inspection if noise is present.",
    ],
    sellerQuestions: [
      "Have suspension bushes or engine mounts been replaced?",
      "Do you notice front-end knocking or vibration?",
    ],
    severity: "Medium",
    confidence: "High",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales notes front-end thumps/rattles from as low as 40,000km can point to worn suspension bushes or premature engine mount failure on Mazda3 BL examples.",
    sourceName: "Carsales Mazda3 2009–2013 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-used-mazda-3-2009-13-104907/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Use as a symptom-based inspection priority.",
  },
  {
    id: "mazda-3-2009-2013-brake-pulsing",
    make: "Mazda",
    model: "Mazda 3",
    generation: "BL",
    yearFrom: 2009,
    yearTo: 2013,
    area: "Brakes",
    issue:
      "Squealing discs or pulsing through the brake pedal under light braking should be checked.",
    whyItMatters:
      "Brake work may be routine, but it affects safety and should be factored into negotiation.",
    howToInspect: [
      "Brake gently from different speeds.",
      "Feel for pulsing through the pedal.",
      "Listen for squealing or scraping.",
      "Check brake service records if available.",
    ],
    sellerQuestions: [
      "When were the brake pads and discs last replaced?",
      "Have you noticed brake vibration or squealing?",
    ],
    severity: "Medium",
    confidence: "High",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales notes squealing discs and pulsing through the pedal under light braking may indicate brake work is needed on used Mazda3 BL examples.",
    sourceName: "Carsales Mazda3 2009–2013 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-used-mazda-3-2009-13-104907/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Present as a cost/safety check rather than a guaranteed fault.",
  },

  // =========================================================
  // Hyundai i30
  // =========================================================
  {
    id: "hyundai-i30-2007-2012-interior-trim-seals",
    make: "Hyundai",
    model: "i30",
    generation: "FD",
    yearFrom: 2007,
    yearTo: 2012,
    area: "Interior trim / rubber seals",
    issue:
      "Interior scuffs, loose console sections, seat trim wear, and split door seals should be checked.",
    whyItMatters:
      "Interior wear can reveal neglect, heavy use, or poor ownership history.",
    howToInspect: [
      "Check centre console and dashboard panels for looseness or rattles.",
      "Inspect seat trim around tight frame points.",
      "Check rubber door seals for splits.",
    ],
    sellerQuestions: [
      "Was the car used commercially or by multiple drivers?",
      "Have any interior trim parts been repaired or replaced?",
    ],
    severity: "Low",
    confidence: "High",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales notes interior quality issues in Hyundai i30 2007–2012 examples, including scuffed plastics, loose console sections, seat trim wear, and split door seals.",
    sourceName: "Carsales Hyundai i30 2007–2012 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-used-hyundai-i30-2007-12-39001/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Use as ownership-condition evidence, not as a mechanical fault.",
  },
  {
    id: "hyundai-i30-2007-2012-hatch-struts",
    make: "Hyundai",
    model: "i30",
    generation: "FD",
    yearFrom: 2007,
    yearTo: 2012,
    area: "Rear hatch struts",
    issue:
      "Rear hatch struts should be checked to ensure they hold the hatch securely.",
    whyItMatters:
      "Weak hatch struts are usually not expensive, but a falling hatch can injure the user.",
    howToInspect: [
      "Open the hatch fully and confirm it holds its own weight.",
      "Gently move the hatch and check whether it sags.",
      "Check for strut oil leakage or weak lift action.",
    ],
    sellerQuestions: [
      "Have the hatch struts ever been replaced?",
      "Does the hatch stay open by itself?",
    ],
    severity: "Low",
    confidence: "High",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales notes premature failure of rear hatch struts as an i30 check point and recommends checking that the struts hold the panel weight.",
    sourceName: "Carsales Hyundai i30 2007–2012 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-used-hyundai-i30-2007-12-39001/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Present as a practical inspection item rather than a serious mechanical fault.",
    appliesToBodyStyles: ["Hatch", "Hatchback", "Unknown"],
  },
  {
    id: "hyundai-i30-2007-2012-clear-coat",
    make: "Hyundai",
    model: "i30",
    generation: "FD",
    yearFrom: 2007,
    yearTo: 2012,
    area: "Paint / clear coat",
    issue:
      "Clear-coat defects may appear as pin holes, discoloured patches, or lifting coating.",
    whyItMatters:
      "Paint deterioration can reduce vehicle value and may indicate long-term outdoor exposure.",
    howToInspect: [
      "Inspect roof, bonnet, and horizontal panels in good daylight.",
      "Look for pin holes, cloudy patches, or clear coat lifting.",
      "Check whether the car has been stored outdoors.",
    ],
    sellerQuestions: [
      "Has the car had any paint repairs?",
      "Has it mostly been parked outside?",
    ],
    severity: "Medium",
    confidence: "High",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales advises inspecting Hyundai i30 horizontal panels and body creases for clear-coat defects such as pin holes or discoloured patches.",
    sourceName: "Carsales Hyundai i30 2007–2012 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-used-hyundai-i30-2007-12-39001/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Use as an exterior condition check.",
  },

  // =========================================================
  // Hyundai Getz
  // =========================================================
  {
    id: "hyundai-getz-2002-2008-accident-damage",
    make: "Hyundai",
    model: "Getz",
    generation: "TB",
    yearFrom: 2002,
    yearTo: 2008,
    area: "Body / accident damage",
    issue:
      "Check bumper alignment, door and bonnet alignment, and inner mudguards for signs of crash damage.",
    whyItMatters:
      "Small cars can show structural or panel damage after even relatively minor impacts. Poor repairs can affect safety and resale value.",
    howToInspect: [
      "Look for uneven bumper alignment.",
      "Check door, bonnet, and boot gaps.",
      "Inspect inner mudguards for kinks, creases, or repair marks.",
    ],
    sellerQuestions: [
      "Has the car ever been in an accident?",
      "Has any panel or bumper repair been done?",
    ],
    severity: "High",
    confidence: "High",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales warns that small cars like the Getz can fare poorly even in minor impacts and recommends checking alignment and inner mudguards for evidence of a heavy hit.",
    sourceName: "Carsales Hyundai Getz 2002–2008 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-used-hyundai-getz-2002-2008-25521/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Use as a body-condition inspection item, not as proof of accident history.",
  },
  {
    id: "hyundai-getz-2002-2008-timing-belt",
    make: "Hyundai",
    model: "Getz",
    generation: "TB",
    yearFrom: 2002,
    yearTo: 2008,
    area: "Timing belt / engine maintenance",
    issue:
      "Timing belt replacement history must be checked, especially near 90,000km intervals.",
    whyItMatters:
      "A missed timing belt change can cause serious engine damage.",
    howToInspect: [
      "Check the service book for timing belt replacement.",
      "Ask for an invoice showing belt replacement.",
      "If close to 90,000km or a multiple of it, factor replacement cost into the price.",
    ],
    sellerQuestions: [
      "When was the timing belt last replaced?",
      "Do you have an invoice for the timing belt job?",
      "Was the water pump replaced at the same time?",
    ],
    severity: "High",
    confidence: "High",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales states that Hyundai Getz camshaft timing belts must be replaced every 90,000km to avoid serious engine damage.",
    sourceName: "Carsales Hyundai Getz 2002–2008 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-used-hyundai-getz-2002-2008-25521/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Prioritise this for cars near or beyond 90,000km intervals.",
  },
  {
    id: "hyundai-getz-2002-2011-neglect-ageing",
    make: "Hyundai",
    model: "Getz",
    generation: "TB",
    yearFrom: 2002,
    yearTo: 2011,
    area: "General age / maintenance condition",
    issue:
      "Because most Getz examples are now old and cheap, neglect and deferred maintenance should be checked carefully.",
    whyItMatters:
      "Even simple, reliable cars become risky if previous owners skipped maintenance.",
    howToInspect: [
      "Check service history and receipts.",
      "Look for oil leaks, coolant condition, tyre age, and brake condition.",
      "Check all basic functions including lights, windows, A/C, and central locking.",
    ],
    sellerQuestions: [
      "Do you have service receipts?",
      "When were tyres, brakes, battery, and timing belt last replaced?",
      "Has the car had any overheating or oil leak issues?",
    ],
    severity: "Medium",
    confidence: "Medium",
    sourceQuality: "reviewer-used-car-review",
    sourceSummary:
      "Redriven describes the Getz as reliable and cheap to repair but notes that neglected examples can have issues because they are ageing.",
    sourceName: "Redriven Hyundai Getz used review",
    sourceUrl:
      "https://redriven.com/reviews/hyundai/getz/used-hyundai-getz-review/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Use as a general condition priority, not a specific mechanical diagnosis.",
  },

  // =========================================================
  // Kia Cerato
  // =========================================================
  {
    id: "kia-cerato-2004-2012-service-history",
    make: "Kia",
    model: "Cerato",
    generation: "LD / TD",
    yearFrom: 2004,
    yearTo: 2012,
    area: "Service history / ownership",
    issue:
      "Complete service history and lower-owner history should be prioritised.",
    whyItMatters:
      "For older budget cars, service history is often more important than badge reputation.",
    howToInspect: [
      "Check service book and receipts.",
      "Compare odometer readings across service records.",
      "Prefer one- or two-owner cars where possible.",
    ],
    sellerQuestions: [
      "How many owners has the car had?",
      "Do you have full service history?",
      "Can I see receipts for major repairs?",
    ],
    severity: "Medium",
    confidence: "High",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales notes that finding a one- or two-owner Cerato with complete service history is worthwhile for peace of mind.",
    sourceName: "Carsales Kia Cerato 2004–2012 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-used-kia-cerato-2004-12-108372/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Use as a buyer confidence factor rather than a defect.",
  },
  {
    id: "kia-cerato-2004-2012-valvetrain-timing-chain",
    make: "Kia",
    model: "Cerato",
    generation: "LD / TD",
    yearFrom: 2004,
    yearTo: 2012,
    area: "Engine / valvetrain",
    issue:
      "Cold-start rattles or tapping noises may indicate valvetrain wear or loose timing chain.",
    whyItMatters:
      "Engine noise on cold start can indicate repair risk and should be assessed before purchase.",
    howToInspect: [
      "Ask to hear the car started from cold.",
      "Listen for rattles or tapping noises.",
      "Check service history for oil change intervals.",
    ],
    sellerQuestions: [
      "Can I hear the engine start from cold?",
      "Has the timing chain or valvetrain ever been repaired?",
      "How often was the oil changed?",
    ],
    severity: "High",
    confidence: "High",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales recommends hearing Cerato examples started from cold and listening for rattles or tapping that may signify valve-train wear or a loose timing chain.",
    sourceName: "Carsales Kia Cerato 2004–2012 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-used-kia-cerato-2004-12-108372/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Use only as a symptom-based warning. Do not diagnose internal engine wear without inspection.",
  },
  {
    id: "kia-cerato-2004-2012-cooling-system",
    make: "Kia",
    model: "Cerato",
    generation: "LD / TD",
    yearFrom: 2004,
    yearTo: 2012,
    area: "Cooling system / water pump",
    issue:
      "Coolant condition, water pump history, and overheating symptoms should be checked.",
    whyItMatters:
      "Cooling system neglect can lead to overheating and engine damage.",
    howToInspect: [
      "Check coolant level and colour.",
      "Look around the filler neck for oily scum.",
      "During idle with A/C on, watch for overheating.",
      "Ask whether the water pump has been replaced.",
    ],
    sellerQuestions: [
      "Has the water pump ever been replaced?",
      "Has the car ever overheated?",
      "When was the coolant last flushed?",
    ],
    severity: "High",
    confidence: "High",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales advises checking Cerato coolant level and filler neck for oily scum and notes water pump replacement around 100,000km or with timing belt on pre-2009 models.",
    sourceName: "Carsales Kia Cerato 2004–2012 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-used-kia-cerato-2004-12-108372/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Prioritise this on older or high-kilometre examples.",
  },
  {
    id: "kia-cerato-2004-2012-auto-transmission",
    make: "Kia",
    model: "Cerato",
    generation: "LD / TD",
    yearFrom: 2004,
    yearTo: 2012,
    area: "Automatic transmission",
    issue:
      "Slow selection of Drive/Reverse or rough shifts should trigger professional inspection.",
    whyItMatters:
      "Automatic transmission problems can be expensive relative to the value of an older budget car.",
    howToInspect: [
      "Shift from P to D and R while stationary and check for delay.",
      "Test up-shifts and down-shifts during a road test.",
      "Avoid cars with harsh or delayed engagement unless inspected professionally.",
    ],
    sellerQuestions: [
      "Has the automatic transmission been serviced?",
      "Does it ever delay selecting Drive or Reverse?",
      "Have you noticed rough shifting?",
    ],
    severity: "High",
    confidence: "High",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales notes four-speed automatic Ceratos can lag on up-shifts and recommends professional inspection if changes are not smooth or selection of Drive/Reverse is slow.",
    sourceName: "Carsales Kia Cerato 2004–2012 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-used-kia-cerato-2004-12-108372/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Only prioritise this for automatic examples or unknown transmission type.",
    appliesToTransmissions: ["Automatic", "Unknown"],
  },
  {
    id: "kia-cerato-2013-2018-airbag-warning-software",
    make: "Kia",
    model: "Cerato",
    generation: "YD",
    yearFrom: 2013,
    yearTo: 2018,
    area: "Airbag warning / software",
    issue:
      "Airbag warning symbols on the dash should be inspected by an authorised dealer.",
    whyItMatters:
      "Airbag warning lights can indicate safety-system faults and should not be ignored.",
    howToInspect: [
      "Check dashboard warning lights on start-up.",
      "Confirm that the airbag warning light turns off normally.",
      "Ask for dealer records if airbag warning work was done.",
    ],
    sellerQuestions: [
      "Has the airbag warning light ever appeared?",
      "Has a Kia dealer inspected or updated the software?",
    ],
    severity: "High",
    confidence: "High",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales notes that some 2016–2018 Ceratos displayed airbag warning symbols due to a software problem and that any car still showing such a warning needs authorised dealer inspection.",
    sourceName: "Carsales Kia Cerato 2013–2018 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-a-used-kia-cerato-2013-2018-138619/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Do not clear or ignore airbag warnings. Treat as a safety inspection priority.",
  },
  {
    id: "kia-cerato-2013-2018-valvetrain-sludge",
    make: "Kia",
    model: "Cerato",
    generation: "YD",
    yearFrom: 2013,
    yearTo: 2018,
    area: "Engine / oil sludge / valvetrain",
    issue:
      "Chattering or ticking at start-up may indicate valvetrain sludge or poor oil-change history.",
    whyItMatters:
      "Extended service intervals or short-trip use can degrade oil faster and affect variable valve timing operation.",
    howToInspect: [
      "Start the engine from cold and listen for chattering or ticking.",
      "Check oil-change history.",
      "Ask whether the car was mainly used for short journeys.",
    ],
    sellerQuestions: [
      "How often was the oil changed?",
      "Was the car mainly used for short trips?",
      "Has there been any ticking noise on start-up?",
    ],
    severity: "High",
    confidence: "High",
    sourceQuality: "expert-used-car-review",
    sourceSummary:
      "Carsales notes chattering or ticking at start-up can be symptomatic of valvetrain sludge, especially where services were extended or the car was used mainly for short journeys.",
    sourceName: "Carsales Kia Cerato 2013–2018 used buying guide",
    sourceUrl:
      "https://www.carsales.com.au/editorial/details/buying-a-used-kia-cerato-2013-2018-138619/",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Present as a symptom-based check and service-history concern.",
  },

  // =========================================================
  // Kia Rio
  // =========================================================
  {
    id: "kia-rio-2016-2017-rear-door-child-lock-recall",
    make: "Kia",
    model: "Rio",
    generation: "YB",
    yearFrom: 2016,
    yearTo: 2017,
    area: "Recall / rear door child lock",
    issue:
      "Rear door child lock recall status should be checked on 2016–2017 Rio examples.",
    whyItMatters:
      "The rear door lock assembly cable may be out of specification, meaning a child lock can appear active but still allow the rear door to open from inside.",
    howToInspect: [
      "Ask for the VIN.",
      "Check official Vehicle Recalls or Kia recall status.",
      "Test rear door child locks carefully before purchase.",
    ],
    sellerQuestions: [
      "Has the rear door child lock recall been completed?",
      "Can I check the VIN against official recall records?",
      "Do the rear child locks work correctly?",
    ],
    severity: "High",
    confidence: "High",
    sourceQuality: "official-recall",
    sourceSummary:
      "The Australian Vehicle Recalls database lists a 2016–2017 Kia Rio recall where rear door lock assembly cable length may allow a rear door to open from inside even with child lock active.",
    sourceName: "Australian Vehicle Recalls Kia Rio 2016–2017",
    sourceUrl: "https://www.vehiclerecalls.gov.au/recalls/rec-000784",
    verificationStatus: "Verified by source",
    wordingCaution:
      "Only apply to potentially affected vehicles and require VIN confirmation.",
  },
  {
    id: "kia-rio-2011-2017-transmission-engine-road-test",
    make: "Kia",
    model: "Rio",
    generation: "UB",
    yearFrom: 2011,
    yearTo: 2017,
    area: "Road test / drivetrain behaviour",
    issue:
      "Because model-specific fault evidence is limited, prioritise careful road testing for engine smoothness, shift quality, and warning lights.",
    whyItMatters:
      "The Rio is generally a simple light car, so overall condition and service history matter more than assuming a specific mechanical defect.",
    howToInspect: [
      "Cold start the car and listen for rough idle or abnormal noises.",
      "Check manual or automatic shift quality during a normal test drive.",
      "Check dashboard warning lights.",
      "Review service history and confirm regular maintenance.",
    ],
    sellerQuestions: [
      "Do you have full service history?",
      "Has the car had any stalling, warning light, or transmission issue?",
      "Was it mostly used for city driving?",
    ],
    severity: "Medium",
    confidence: "Low",
    sourceQuality: "reviewer-used-car-review",
    sourceSummary:
      "Available source-backed Rio-specific defect data is weaker than for the other models, so this entry is intentionally a general condition and road-test priority rather than a claimed known fault.",
    sourceName: "Kia Rio review / Kia official recall context",
    sourceUrl: "https://www.kia.com/au/owners/recall-information.html",
    verificationStatus: "Needs further verification",
    wordingCaution:
      "Do not present this as a known Rio defect. Present it as a general inspection priority until stronger model-specific evidence is added.",
  },
];