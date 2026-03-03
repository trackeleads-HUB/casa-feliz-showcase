import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, any>;
  noindex?: boolean;
}

const SITE_NAME = "SO Alphaville";
const DEFAULT_DESC = "Encontre o imóvel dos seus sonhos em Alphaville. Compra, venda e aluguel de imóveis de alto padrão.";
const DEFAULT_OG_IMAGE = "https://lovable.dev/opengraph-image-p98pqg.png";

const SEOHead = ({
  title,
  description = DEFAULT_DESC,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  jsonLd,
  noindex = false,
}: SEOHeadProps) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Imóveis de Alto Padrão em Alphaville`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="pt_BR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEOHead;
