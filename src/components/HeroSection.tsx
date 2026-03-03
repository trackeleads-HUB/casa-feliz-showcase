import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
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

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-foreground/60" />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          Encontre o imóvel<br />dos seus sonhos
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
          Casas, apartamentos e terrenos nas melhores localizações. Seu novo lar está aqui.
        </p>

        {/* Search bar */}
        <div className="max-w-4xl mx-auto bg-background/95 backdrop-blur-sm rounded-xl p-3 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-3">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground"
            >
              <option value="">Tipo de imóvel</option>
              <option value="casa">Casa</option>
              <option value="apartamento">Apartamento</option>
              <option value="terreno">Terreno</option>
              <option value="comercial">Comercial</option>
              <option value="cobertura">Cobertura</option>
              <option value="chacara">Chácara</option>
            </select>
            <select
              value={listingType}
              onChange={(e) => setListingType(e.target.value)}
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground"
            >
              <option value="">Venda ou Locação</option>
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
              <option value="venda_aluguel">Venda e Aluguel</option>
            </select>
            <Input
              placeholder="Localização"
              className="flex-1"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground"
            >
              <option value="">Faixa de preço</option>
              <option value="300000">Até R$ 300.000</option>
              <option value="300000-600000">R$ 300.000 - R$ 600.000</option>
              <option value="600000-1000000">R$ 600.000 - R$ 1.000.000</option>
              <option value="1000000">Acima de R$ 1.000.000</option>
            </select>
            <Button className="gap-2" onClick={handleSearch}>
              <Search size={16} />
              Buscar
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
