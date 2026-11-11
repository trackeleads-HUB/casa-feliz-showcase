import { describe, expect, it } from "vitest";
import { canonicalUrl, isPrivatePath, propertyListingSchema } from "./seo";

describe("SEO page identity", () => {
  it("uses the primary domain even on preview or the former domain", () => {
    expect(canonicalUrl("https://soalphaville.lovable.app/imoveis/abc?utm_source=google#fotos"))
      .toBe("https://soalphaville.camacari.website/imoveis/abc");
    expect(canonicalUrl("/imoveis?local=Camaçari")).toBe("https://soalphaville.camacari.website/imoveis");
  });
  it("excludes administration and property editing from indexing", () => {
    for (const path of ["/auth", "/admin/ia", "/dashboard", "/imoveis/novo", "/imoveis/abc/editar"]) {
      expect(isPrivatePath(path)).toBe(true);
    }
    expect(isPrivatePath("/imoveis/abc")).toBe(false);
  });
  it("uses the property's actual location and BRL offer inside a listing", () => {
    const schema = propertyListingSchema({
      id: "abc", title: "Casa", property_type: "casa", description: null,
      city: "Camaçari", state: "BA", address: null, zip_code: null,
      price: 8000, status: "disponivel", area: 200, bedrooms: 4, bathrooms: 3,
      property_code: "AB-01",
    }, [], "Casa em Camaçari");
    expect(schema.mainEntity.address.addressLocality).toBe("Camaçari");
    expect(schema.mainEntity.address.addressRegion).toBe("BA");
    expect(schema.mainEntity.identifier).toBe("AB-01");
    expect(schema.offers).toMatchObject({ price: 8000, priceCurrency: "BRL", availability: "https://schema.org/InStock" });
  });
});