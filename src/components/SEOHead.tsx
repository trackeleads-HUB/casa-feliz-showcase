import { Helmet } from "react-helmet-async";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
  noindex?: boolean;
}

const SEOHead = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  jsonLd,
  noindex = false,
}: SEOHeadProps) => {
  const { settings } = useSiteSettings();

  const siteName = settings.site_name || "SO Alphaville";
  const baseTitle = settings.default_meta_title || `${siteName} - Imóveis de Alto Padrão em Alphaville`;
  const baseDesc = description || settings.default_meta_description || "Imóveis de alto padrão em Alphaville.";
  const baseOg = ogImage || settings.default_og_image || "https://lovable.dev/opengraph-image-p98pqg.png";
  const fullTitle = title ? `${title} | ${siteName}` : baseTitle;
  const url = canonical || (typeof window !== "undefined" ? window.location.href : settings.site_url);

  const jsonLdArr = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <html lang="pt-BR" />
      <title>{fullTitle}</title>
      <meta name="description" content={baseDesc} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}
      {url && <link rel="canonical" href={url} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={baseDesc} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={baseOg} />
      <meta property="og:image:alt" content={fullTitle} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={baseDesc} />
      <meta name="twitter:image" content={baseOg} />

      {/* Verificações */}
      {settings.google_site_verification && (
        <meta name="google-site-verification" content={settings.google_site_verification} />
      )}
      {settings.bing_site_verification && (
        <meta name="msvalidate.01" content={settings.bing_site_verification} />
      )}
      {settings.facebook_domain_verification && (
        <meta name="facebook-domain-verification" content={settings.facebook_domain_verification} />
      )}

      {jsonLdArr.map((data, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(data)}</script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
