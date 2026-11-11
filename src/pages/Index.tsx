import { SITE_URL } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import AnunciarBanner from "@/components/AnunciarBanner";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Index = () => {
  const { settings } = useSiteSettings();
  const origin = SITE_URL;

  const realEstateLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: settings.site_name || "SO Alphaville",
    description: settings.default_meta_description || "Imobiliária especializada em imóveis de alto padrão em Alphaville.",
    url: origin,
    "@id": `${origin}/#organization`,
    telephone: settings.phone,
    email: settings.email,
    image: settings.default_og_image || undefined,
    areaServed: { "@type": "Place", name: settings.address },
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressCountry: "BR",
    },
    sameAs: [settings.instagram, settings.facebook, settings.linkedin].filter(Boolean),
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.site_name,
    url: origin,
    "@id": `${origin}/#website`,
    inLanguage: "pt-BR",
    publisher: { "@id": `${origin}/#organization` },
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        description={settings.default_meta_description}
        canonical={origin}
        jsonLd={[realEstateLd, websiteLd]}
      />
      <Navbar />
      <HeroSection />
      <FeaturedProperties />
      <AnunciarBanner />
      <AboutSection />
      <ServicesSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
