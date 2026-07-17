import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = Record<string, string>;

const DEFAULTS: SiteSettings = {
  site_name: "SO Alphaville",
  site_tagline: "Excelência em Imóveis de Alto Padrão em Alphaville",
  site_url: "https://soalphaville.lovable.app",
  whatsapp: "5511999999999",
  whatsapp_default_message: "Olá! Gostaria de mais informações.",
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
  // Para Proprietários
  owner_badge: "Para Proprietários",
  owner_title: "Quer Vender ou Alugar seu Imóvel?",
  owner_text: "Cadastre seu imóvel e nossa equipe entrará em contato para ajudá-lo a fechar o melhor negócio.",
  owner_button: "Anunciar meu Imóvel",
  // Sobre Nós
  about_label: "Sobre nós",
  about_title: "Realizando sonhos há mais de uma década",
  about_text_1: "A SO Alphaville nasceu com o propósito de transformar a experiência de comprar, vender e alugar imóveis.",
  about_text_2: "Com uma equipe apaixonada e tecnologia de ponta, conectamos pessoas ao lugar perfeito para chamar de lar.",
  about_image: "",
  about_stat_1_value: "500+", about_stat_1_label: "Imóveis",
  about_stat_2_value: "10+", about_stat_2_label: "Anos",
  about_stat_3_value: "1.200+", about_stat_3_label: "Clientes",
  about_stat_4_value: "50+", about_stat_4_label: "Corretores",
  // Serviços
  services_label: "O que fazemos",
  services_title: "Nossos Serviços",
  service_1_title: "Compra", service_1_desc: "",
  service_2_title: "Venda", service_2_desc: "",
  service_3_title: "Aluguel", service_3_desc: "",
  service_4_title: "Avaliação", service_4_desc: "",
  // Depoimentos
  testimonials_label: "Depoimentos",
  testimonials_title: "O que dizem nossos clientes",
  // Contato
  cta_label: "Entre em contato",
  cta_button: "Fale Conosco",
};

let cachedSettings: SiteSettings | null = null;
let fetchPromise: Promise<SiteSettings> | null = null;
const subscribers = new Set<(s: SiteSettings) => void>();

function notify(s: SiteSettings) {
  subscribers.forEach((cb) => cb(s));
}

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
  notify(settings);
  return settings;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(cachedSettings || DEFAULTS);
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    subscribers.add(setSettings);

    if (cachedSettings) {
      setSettings(cachedSettings);
      setLoading(false);
    } else {
      if (!fetchPromise) {
        fetchPromise = fetchSettings();
      }
      fetchPromise.then((s) => {
        setSettings(s);
        setLoading(false);
      });
    }

    return () => {
      subscribers.delete(setSettings);
    };
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
  fetchPromise = fetchSettings();
}
