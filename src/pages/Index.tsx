import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import AnunciarBanner from "@/components/AnunciarBanner";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "SO Alphaville",
    description: "Imobiliária especializada em imóveis de alto padrão em Alphaville.",
    url: window.location.origin,
    areaServed: { "@type": "Place", name: "Alphaville, Barueri, SP" },
    address: { "@type": "PostalAddress", addressLocality: "Barueri", addressRegion: "SP", addressCountry: "BR" },
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Imóveis de Alto Padrão em Alphaville"
        description="SO Alphaville - Encontre casas, apartamentos e terrenos em Alphaville. Imóveis de alto padrão para compra, venda e aluguel."
        canonical={window.location.origin}
        jsonLd={jsonLd}
      />
      <Navbar />
      <HeroSection />
      <FeaturedProperties />
      <AnunciarBanner />
      <AboutSection />
      <ServicesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
