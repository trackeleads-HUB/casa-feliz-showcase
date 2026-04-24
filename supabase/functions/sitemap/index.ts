import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON = Deno.env.get("SUPABASE_ANON_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
    const { data: settings } = await supabase.from("site_settings").select("key, value").eq("key", "site_url").maybeSingle();
    const siteUrl = (settings?.value || "https://soalphaville.lovable.app").replace(/\/$/, "");

    const staticUrls = [
      { loc: `${siteUrl}/`, priority: "1.0", changefreq: "daily" },
      { loc: `${siteUrl}/imoveis`, priority: "0.9", changefreq: "daily" },
      { loc: `${siteUrl}/anunciar`, priority: "0.7", changefreq: "monthly" },
      { loc: `${siteUrl}/politica-de-privacidade`, priority: "0.3", changefreq: "yearly" },
      { loc: `${siteUrl}/termos-de-uso`, priority: "0.3", changefreq: "yearly" },
    ];

    const { data: properties } = await supabase
      .from("properties")
      .select("id, updated_at")
      .eq("status", "disponivel")
      .order("updated_at", { ascending: false })
      .limit(1000);

    const propertyUrls = (properties || []).map((p) => ({
      loc: `${siteUrl}/imoveis/${p.id}`,
      lastmod: new Date(p.updated_at).toISOString().split("T")[0],
      priority: "0.8",
      changefreq: "weekly",
    }));

    const all = [...staticUrls, ...propertyUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map(
    (u: any) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    return new Response(`Error: ${err}`, { status: 500, headers: corsHeaders });
  }
});
