import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = Record<string, string>;

const DEFAULTS: SiteSettings = {
  site_name: "SO Alphaville",
  site_tagline: "Imóveis de Alto Padrão em Alphaville",
  site_url: "https://soalphaville.lovable.app",
  whatsapp: "5511999999999",
  phone: "(11) 99999-9999",
  email: "contato@soalphaville.com.br",
  address: "Alphaville, Barueri - SP",
  instagram: "",
  facebook: "",
  linkedin: "",
  hero_title: "Encontre o Imóvel dos Seus Sonhos",
  hero_subtitle: "Imóveis exclusivos em Alphaville, com a sofisticação e segurança que sua família merece.",
  cta_title: "Encontre o Imóvel Perfeito para Você",
  cta_text: "Nossa equipe está pronta para ajudá-lo a encontrar o imóvel ideal.",
  // SEO
  default_meta_title: "SO Alphaville - Imóveis de Alto Padrão em Alphaville",
  default_meta_description: "Encontre casas, apartamentos e terrenos de alto padrão em Alphaville.",
  default_og_image: "",
  gtm_id: "",
  ga_id: "",
  google_ads_id: "",
  facebook_pixel_id: "",
  google_site_verification: "",
  bing_site_verification: "",
  facebook_domain_verification: "",
  cnpj: "",
  creci: "",
  privacy_policy_content: "",
  terms_of_use_content: "",
};

let cachedSettings: SiteSettings | null = null;
let fetchPromise: Promise<SiteSettings> | null = null;

async function fetchSettings(): Promise<SiteSettings> {
  const { data } = await supabase
    .from("site_settings")
    .select("key, value");

  const settings: SiteSettings = { ...DEFAULTS };
  if (data) {
    for (const row of data) {
      if (row.value) settings[row.key] = row.value;
    }
  }
  cachedSettings = settings;
  return settings;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(cachedSettings || DEFAULTS);
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    if (cachedSettings) {
      setSettings(cachedSettings);
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = fetchSettings();
    }

    fetchPromise.then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const refresh = async () => {
    cachedSettings = null;
    fetchPromise = null;
    const s = await fetchSettings();
    setSettings(s);
  };

  return { settings, loading, refresh };
}

export function invalidateSettingsCache() {
  cachedSettings = null;
  fetchPromise = null;
}
