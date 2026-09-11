import { describe, expect, it } from "vitest";

import { extractListingFallback } from "./fallbackExtractor";

describe("extractListingFallback", () => {
  it("extracts realistic shorthand from used-car listings", () => {
    const vehicle = extractListingFallback(
      "2012 Toyota Corolla CVT automatic. Driven 212k. Full log book available. Rego until Dec. $7,500"
    );

    expect(vehicle.make).toBe("Toyota");
    expect(vehicle.model).toBe("Corolla");
    expect(vehicle.year).toBe(2012);
    expect(vehicle.mileage).toBe(212000);
    expect(vehicle.price).toBe(7500);
    expect(vehicle.transmission).toBe("CVT");
    expect(vehicle.serviceHistoryStatus).toBe(
      "Full service history mentioned"
    );
    expect(vehicle.regoMentioned).toBe(true);
    expect(vehicle.extractionMethod).toBe("fallback");
  });
});
