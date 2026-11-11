export const SITE_URL = "https://soalphaville.camacari.website";

/** A page's identity excludes tracking parameters, filters, hashes and preview hosts. */
export function canonicalUrl(path = "/"): string {
  const url = new URL(path, `${SITE_URL}/`);
  const pathname = url.pathname.replace(/\/+$/, "") || "/";
  return `${SITE_URL}${pathname}`;
}

export function isPrivatePath(path: string): boolean {
  return /^\/(admin|dashboard|auth)(\/|$)/.test(path) ||
    path === "/imoveis/novo" || /^\/imoveis\/[^/]+\/editar\/?$/.test(path);
}

export function propertyListingSchema(property: {
  id: string; title: string; description: string | null; property_type: string;
  city: string | null; state: string | null; address: string | null;
  zip_code: string | null; price: number | null; status: string;
  area: number | null; bedrooms: number | null; bathrooms: number | null;
  property_code: string | null; created_at?: string; updated_at?: string;
}, images: string[], description: string) {
  const url = canonicalUrl(`/imoveis/${property.id}`);
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${url}#listing`,
    name: property.title,
    description: property.description || description,
    url,
    ...(images.length && { image: images.slice(0, 8) }),
    ...(property.created_at && { datePosted: property.created_at }),
    ...(property.updated_at && { dateModified: property.updated_at }),
    mainEntity: {
      "@type": property.property_type === "casa" ? "House" :
        property.property_type === "apartamento" ? "Apartment" : "Place",
      name: property.title,
      ...(property.property_code && { identifier: property.property_code }),
      address: {
        "@type": "PostalAddress",
        streetAddress: property.address || undefined,
        addressLocality: property.city || undefined,
        addressRegion: property.state || undefined,
        addressCountry: "BR",
        postalCode: property.zip_code || undefined,
      },
      ...(property.area && { floorSize: { "@type": "QuantitativeValue", value: property.area, unitCode: "MTK" } }),
      ...(property.bedrooms && { numberOfBedrooms: property.bedrooms }),
      ...(property.bathrooms && { numberOfBathroomsTotal: property.bathrooms }),
    },
    ...(property.price && {
      offers: {
        "@type": "Offer", price: property.price, priceCurrency: "BRL", url,
        availability: property.status === "disponivel" ? "https://schema.org/InStock" :
          property.status === "reservado" ? "https://schema.org/Reserved" : "https://schema.org/SoldOut",
      },
    }),
  };
}