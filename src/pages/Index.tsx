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
  const origin = typeof window !== "undefined" ? window.location.origin : settings.site_url;

  const realEstateLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: settings.site_name || "SO Alphaville",
    description: settings.default_meta_description || "Imobiliária especializada em imóveis de alto padrão em Alphaville.",
    url: origin,
    telephone: settings.phone,
    email: settings.email,
    image: settings.default_og_image || undefined,
    areaServed: { "@type": "Place", name: "Alphaville, Barueri, SP" },
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Barueri",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    sameAs: [settings.instagram, settings.facebook, settings.linkedin].filter(Boolean),
  };

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.site_name,
    url: origin,
    logo: settings.default_og_image || undefined,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.phone,
      contactType: "sales",
      areaServed: "BR",
      availableLanguage: "Portuguese",
    },
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Imóveis de Alto Padrão em Alphaville"
        description={settings.default_meta_description}
        canonical={origin}
        jsonLd={[realEstateLd, orgLd]}
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
