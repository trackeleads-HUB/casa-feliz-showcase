// Gera public/sitemap.xml com todas as rotas estáticas + imóveis disponíveis.
// Roda automaticamente antes de `vite dev` e `vite build` (predev/prebuild).
import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://soalphaville.lovable.app";
const SUPABASE_URL = "https://sgwwbujfmulklhguspae.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnd3didWpmbXVsa2xoZ3VzcGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NjI2NTksImV4cCI6MjA4ODEzODY1OX0.ep_eFnvt17sa8Y5fKHGrVAYdBN9AeyAXgtpz8LOe2N0";

interface Entry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: Entry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/imoveis", changefreq: "daily", priority: "0.9" },
  { path: "/anunciar", changefreq: "monthly", priority: "0.7" },
  { path: "/politica-de-privacidade", changefreq: "yearly", priority: "0.3" },
  { path: "/termos-de-uso", changefreq: "yearly", priority: "0.3" },
];

async function fetchProperties(): Promise<Entry[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/properties?select=id,updated_at&status=eq.disponivel&order=updated_at.desc&limit=1000`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (!res.ok) {
      console.warn(`[sitemap] Falha ao buscar imóveis (${res.status})`);
      return [];
    }
    const data: { id: string; updated_at: string }[] = await res.json();
    return data.map((p) => ({
      path: `/imoveis/${p.id}`,
      lastmod: new Date(p.updated_at).toISOString().split("T")[0],
      changefreq: "weekly",
      priority: "0.8",
    }));
  } catch (err) {
    console.warn("[sitemap] erro ao buscar imóveis:", err);
    return [];
  }
}

function buildXml(entries: Entry[]) {
  const urls = entries
    .map((e) =>
      [
        `  <url>`,
        `    <loc>${BASE_URL}${e.path}</loc>`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
        e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
        e.priority ? `    <priority>${e.priority}</priority>` : null,
        `  </url>`,
      ]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

(async () => {
  const properties = await fetchProperties();
  const all = [...staticEntries, ...properties];
  writeFileSync(resolve("public/sitemap.xml"), buildXml(all));
  console.log(`[sitemap] gerado com ${all.length} URLs (${properties.length} imóveis).`);
})();
