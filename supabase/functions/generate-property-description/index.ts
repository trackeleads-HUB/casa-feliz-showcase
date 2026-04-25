import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const propertyTypeMap: Record<string, string> = {
  casa: "Casa", apartamento: "Apartamento", terreno: "Terreno",
  comercial: "Imóvel comercial", cobertura: "Cobertura", chacara: "Chácara",
};
const listingMap: Record<string, string> = {
  venda: "venda", aluguel: "aluguel", venda_aluguel: "venda ou aluguel",
};

function buildPropertyContext(p: Record<string, unknown>): string {
  const lines: string[] = [];
  const get = (k: string) => p[k];

  if (get("title")) lines.push(`Título: ${get("title")}`);
  if (get("property_type")) lines.push(`Tipo: ${propertyTypeMap[String(get("property_type"))] || get("property_type")}`);
  if (get("listing_type")) lines.push(`Finalidade: ${listingMap[String(get("listing_type"))] || get("listing_type")}`);
  if (get("price")) lines.push(`Preço: R$ ${Number(get("price")).toLocaleString("pt-BR")}`);
  if (get("area")) lines.push(`Área: ${get("area")} m²`);
  if (get("bedrooms")) lines.push(`Quartos: ${get("bedrooms")}`);
  if (get("bathrooms")) lines.push(`Banheiros: ${get("bathrooms")}`);
  if (get("parking_spots")) lines.push(`Vagas de garagem: ${get("parking_spots")}`);
  if (get("address")) lines.push(`Endereço: ${get("address")}`);
  if (get("neighborhood")) lines.push(`Bairro: ${get("neighborhood")}`);
  if (get("city")) lines.push(`Cidade: ${get("city")}`);
  if (get("state")) lines.push(`Estado: ${get("state")}`);
  const features = get("features");
  if (Array.isArray(features) && features.length) lines.push(`Características: ${features.join(", ")}`);
  if (get("description")) lines.push(`Descrição existente (referência): ${get("description")}`);

  return lines.join("\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const property = body?.property;
    if (!property || typeof property !== "object") {
      return new Response(JSON.stringify({ error: "Dados do imóvel ausentes" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const { data: settings, error: settingsError } = await admin
      .from("ai_settings")
      .select("openai_api_key, model, instructions")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (settingsError || !settings) {
      return new Response(JSON.stringify({ error: "Configurações de IA não encontradas. Acesse Admin > IA." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!settings.openai_api_key) {
      return new Response(JSON.stringify({ error: "Chave da API OpenAI não configurada. Acesse Admin > IA." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const model = settings.model || "gpt-4.1-mini";
    const systemPrompt = settings.instructions || "Você é um especialista em marketing imobiliário.";
    const userPrompt = `Gere uma descrição comercial pronta para publicar no site, com base nas informações abaixo do imóvel. Não use títulos de seção, apenas o texto corrido em parágrafos curtos.\n\nDados do imóvel:\n${buildPropertyContext(property)}`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${settings.openai_api_key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      let errorMsg = `Erro ${res.status} ao chamar OpenAI`;
      try {
        const parsed = JSON.parse(errBody);
        errorMsg = parsed?.error?.message || errorMsg;
      } catch (_) { /* noop */ }
      return new Response(JSON.stringify({ error: errorMsg }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const description = data?.choices?.[0]?.message?.content?.trim() || "";
    if (!description) {
      return new Response(JSON.stringify({ error: "Resposta vazia da IA" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ description }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
