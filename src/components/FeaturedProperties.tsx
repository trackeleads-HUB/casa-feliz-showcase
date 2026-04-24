import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Maximize, Home, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

const mockProperties = [
  { id: "1", image: property1, title: "Apartamento Vista Mar", location: "Copacabana, Rio de Janeiro", price: 850000, beds: 3, baths: 2, area: 120, tag: "Venda" },
  { id: "2", image: property2, title: "Casa com Jardim", location: "Alphaville, São Paulo", price: 1200000, beds: 4, baths: 3, area: 250, tag: "Venda" },
  { id: "3", image: property3, title: "Cobertura Duplex", location: "Barra da Tijuca, Rio de Janeiro", price: 2500000, beds: 4, baths: 4, area: 320, tag: "Destaque" },
  { id: "4", image: property4, title: "Sobrado Moderno", location: "Vila Madalena, São Paulo", price: 980000, beds: 3, baths: 2, area: 180, tag: "Venda" },
  { id: "5", image: property5, title: "Casa de Praia", location: "Jurerê, Florianópolis", price: 1800000, beds: 5, baths: 4, area: 300, tag: "Destaque" },
  { id: "6", image: property6, title: "Loft Industrial", location: "Pinheiros, São Paulo", price: 650000, beds: 1, baths: 1, area: 85, tag: "Aluguel" },
];

const listingLabels: Record<string, string> = {
  venda: "Venda", aluguel: "Aluguel", venda_aluguel: "Venda/Aluguel",
};

type DisplayProperty = {
  id: string; image: string; title: string; location: string;
  price: number | null; beds: number | null; baths: number | null;
  area: number | null; tag: string;
};

const formatPrice = (price: number | null) => {
  if (!price) return "Sob consulta";
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
};

const FeaturedProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<DisplayProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("id, title, listing_type, price, bedrooms, bathrooms, area, neighborhood, city")
        .eq("status", "disponivel")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error || !data || data.length === 0) {
        setProperties(mockProperties);
        setLoading(false);
        return;
      }

      const withImages = await Promise.all(
        data.map(async (p) => {
          const { data: imgs } = await supabase
            .from("property_images").select("url")
            .eq("property_id", p.id).eq("is_cover", true).limit(1);
          return {
            id: p.id, image: imgs?.[0]?.url || "", title: p.title,
            location: [p.neighborhood, p.city].filter(Boolean).join(", ") || "Localização não informada",
            price: p.price ? Number(p.price) : null, beds: p.bedrooms,
            baths: p.bathrooms, area: p.area ? Number(p.area) : null,
            tag: listingLabels[p.listing_type] || p.listing_type,
          };
        })
      );
      setProperties(withImages);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  return (
    <section id="imoveis" className="py-28 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-[13px] uppercase tracking-[0.25em] text-primary mb-4">Destaques</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
            Imóveis em <span className="italic font-light">Destaque</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-muted rounded-2xl h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((p) => (
              <div
                key={p.id}
                className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:shadow-2xl hover:shadow-foreground/5 transition-all duration-500 cursor-pointer"
                onClick={() => navigate(`/imoveis/${p.id}`)}
              >
                <div className="relative h-64 overflow-hidden bg-muted">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                      <Home size={48} />
                    </div>
                  )}
                  <Badge className="absolute top-4 left-4 rounded-full px-3">{p.tag}</Badge>
                </div>
                <div className="p-6">
                  <p className="text-2xl font-bold text-foreground mb-1">{formatPrice(p.price)}</p>
                  <h3 className="text-lg font-medium text-foreground mb-2">{p.title}</h3>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-5">
                    <MapPin size={14} /> {p.location}
                  </p>
                  <div className="flex items-center gap-5 text-sm text-muted-foreground border-t border-border/50 pt-4">
                    {p.beds ? <span className="flex items-center gap-1.5"><Bed size={14} /> {p.beds}</span> : null}
                    {p.baths ? <span className="flex items-center gap-1.5"><Bath size={14} /> {p.baths}</span> : null}
                    {p.area ? <span className="flex items-center gap-1.5"><Maximize size={14} /> {p.area}m²</span> : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Button variant="outline" size="lg" className="rounded-full px-8 gap-2" onClick={() => navigate("/imoveis")}>
            Ver todos os imóveis <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
