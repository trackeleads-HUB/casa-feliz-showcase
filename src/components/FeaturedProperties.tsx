import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Maximize } from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

const properties = [
  { id: 1, image: property1, title: "Apartamento Vista Mar", location: "Copacabana, Rio de Janeiro", price: "R$ 850.000", beds: 3, baths: 2, area: "120m²", tag: "Venda" },
  { id: 2, image: property2, title: "Casa com Jardim", location: "Alphaville, São Paulo", price: "R$ 1.200.000", beds: 4, baths: 3, area: "250m²", tag: "Venda" },
  { id: 3, image: property3, title: "Cobertura Duplex", location: "Barra da Tijuca, Rio de Janeiro", price: "R$ 2.500.000", beds: 4, baths: 4, area: "320m²", tag: "Destaque" },
  { id: 4, image: property4, title: "Sobrado Moderno", location: "Vila Madalena, São Paulo", price: "R$ 980.000", beds: 3, baths: 2, area: "180m²", tag: "Venda" },
  { id: 5, image: property5, title: "Casa de Praia", location: "Jurerê, Florianópolis", price: "R$ 1.800.000", beds: 5, baths: 4, area: "300m²", tag: "Destaque" },
  { id: 6, image: property6, title: "Loft Industrial", location: "Pinheiros, São Paulo", price: "R$ 650.000", beds: 1, baths: 1, area: "85m²", tag: "Aluguel" },
];

const FeaturedProperties = () => {
  return (
    <section id="imoveis" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary tracking-widest uppercase mb-3">Destaques</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            Imóveis em Destaque
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((p) => (
            <Card key={p.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-56 overflow-hidden">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <Badge className="absolute top-4 left-4">{p.tag}</Badge>
              </div>
              <CardContent className="p-5">
                <p className="text-2xl font-bold text-foreground mb-1">{p.price}</p>
                <h3 className="text-lg font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                  <MapPin size={14} /> {p.location}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-4">
                  <span className="flex items-center gap-1"><Bed size={14} /> {p.beds}</span>
                  <span className="flex items-center gap-1"><Bath size={14} /> {p.baths}</span>
                  <span className="flex items-center gap-1"><Maximize size={14} /> {p.area}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">Ver todos os imóveis</Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
