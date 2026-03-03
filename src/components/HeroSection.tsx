import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
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
        <div className="max-w-3xl mx-auto bg-background/95 backdrop-blur-sm rounded-xl p-3 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-3">
            <select className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground">
              <option value="">Tipo de imóvel</option>
              <option>Casa</option>
              <option>Apartamento</option>
              <option>Terreno</option>
            </select>
            <Input placeholder="Localização" className="flex-1" />
            <select className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground">
              <option value="">Faixa de preço</option>
              <option>Até R$ 300.000</option>
              <option>R$ 300.000 - R$ 600.000</option>
              <option>R$ 600.000 - R$ 1.000.000</option>
              <option>Acima de R$ 1.000.000</option>
            </select>
            <Button className="gap-2">
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
