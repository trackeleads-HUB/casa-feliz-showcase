import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [propertyType, setPropertyType] = useState("");
  const [listingType, setListingType] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (propertyType) params.set("tipo", propertyType);
    if (listingType) params.set("negocio", listingType);
    if (location) params.set("local", location);
    if (priceRange) params.set("preco", priceRange);
    navigate(`/imoveis?${params.toString()}`);
  };

  const selectClass =
    "flex-1 h-12 rounded-xl border-0 bg-foreground/5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none";

  return (
    <section id="hero" className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/40 to-foreground/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(145_60%_36%/0.15)] via-transparent to-[hsl(185_55%_30%/0.15)]" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center pt-24 sm:pt-20">
        <p className="text-[11px] sm:text-[13px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-primary-foreground/60 mb-4 sm:mb-6">
          {settings.site_tagline}
        </p>
        <h1 className="text-[56px] sm:text-[64px] md:text-7xl lg:text-[72px] font-bold text-primary-foreground mb-6 sm:mb-8 leading-[1.1] sm:leading-[1.05] text-balance">
          {settings.hero_title?.split(" ").slice(0, -2).join(" ")}
          <br />
          <span className="italic font-light">{settings.hero_title?.split(" ").slice(-2).join(" ")}</span>
        </h1>
        <p className="text-base md:text-lg text-primary-foreground/70 mb-14 max-w-xl mx-auto font-light leading-relaxed">
          {settings.hero_subtitle}
        </p>

        {/* Search bar */}
        <div className="max-w-4xl mx-auto bg-background/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-2xl shadow-foreground/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-row gap-2 sm:gap-3">
            <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className={selectClass}>
              <option value="">Tipo de imóvel</option>
              <option value="casa">Casa</option>
              <option value="apartamento">Apartamento</option>
              <option value="terreno">Terreno</option>
              <option value="comercial">Comercial</option>
              <option value="cobertura">Cobertura</option>
              <option value="chacara">Chácara</option>
            </select>
            <select value={listingType} onChange={(e) => setListingType(e.target.value)} className={selectClass}>
              <option value="">Venda ou Locação</option>
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
              <option value="venda_aluguel">Venda e Aluguel</option>
            </select>
            <input
              placeholder="Localização"
              className={selectClass}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className={selectClass}>
              <option value="">Faixa de preço</option>
              <option value="300000">Até R$ 300.000</option>
              <option value="300000-600000">R$ 300.000 - R$ 600.000</option>
              <option value="600000-1000000">R$ 600.000 - R$ 1.000.000</option>
              <option value="1000000">Acima de R$ 1.000.000</option>
            </select>
            <Button className="gap-2 h-12 rounded-xl px-6 sm:col-span-2 md:col-span-1 bg-gradient-brand hover:opacity-90 border-0 text-[15px] font-semibold" onClick={handleSearch}>
              <Search size={16} />
              Buscar
            </Button>
          </div>
        </div>

        <button
          onClick={() => document.getElementById("imoveis")?.scrollIntoView({ behavior: "smooth" })}
          className="mt-16 inline-flex items-center gap-2 text-primary-foreground/50 hover:text-primary-foreground transition-colors text-sm tracking-wide"
        >
          Explorar imóveis <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
