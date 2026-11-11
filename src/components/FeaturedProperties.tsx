import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Maximize, Home, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const listingLabels: Record<string, string> = {
  venda: "Venda", aluguel: "Aluguel", venda_aluguel: "Venda/Aluguel",
};

type DisplayProperty = {
  id: string; image: string; title: string; location: string;
  price: number | null; beds: number | null; baths: number | null;
  area: number | null; tag: string; code: string | null;
};

const formatPrice = (price: number | null) => {
  if (!price) return "Sob consulta";
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
};

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<DisplayProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("id, title, listing_type, price, bedrooms, bathrooms, area, neighborhood, city, property_code")
        .eq("status", "disponivel")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error || !data || data.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }

      const { data: covers } = await supabase.from("property_images")
        .select("property_id, url").in("property_id", data.map((p) => p.id)).eq("is_cover", true);
      const withImages = data.map((p) => {
          return {
            id: p.id, image: covers?.find((image) => image.property_id === p.id)?.url || "", title: p.title,
            location: [p.neighborhood, p.city].filter(Boolean).join(", ") || "Localização não informada",
            price: p.price ? Number(p.price) : null, beds: p.bedrooms,
            baths: p.bathrooms, area: p.area ? Number(p.area) : null,
            tag: listingLabels[p.listing_type] || p.listing_type,
            code: p.property_code || null,
          };
        });
      setProperties(withImages);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  return (
    <section id="imoveis" className="py-16 sm:py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <p className="text-[11px] sm:text-[13px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-primary mb-3 sm:mb-4">Destaques</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground">
            Imóveis em <span className="italic font-bold text-primary underline decoration-primary/40 decoration-2 underline-offset-8">Destaque</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-muted rounded-2xl h-96 animate-pulse" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Home size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">Em breve, novos imóveis em destaque.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {properties.map((p) => (
              <Link
                key={p.id}
                to={`/imoveis/${p.id}`}
                className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:shadow-2xl hover:shadow-foreground/5 transition-all duration-500 cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden bg-muted">
                  {p.image ? (
                    <img src={p.image} alt={p.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                      <Home size={48} />
                    </div>
                  )}
                  <Badge className="absolute top-4 left-4 rounded-full px-3">{p.tag}</Badge>
                  {p.code && (
                    <span className="absolute top-4 right-4 rounded-full px-3 py-1 text-[11px] font-mono font-semibold bg-background/90 text-foreground backdrop-blur-sm border border-border/50">
                      {p.code}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-2xl font-bold text-foreground mb-1">{formatPrice(p.price)}</p>
                  <h3 className="text-lg font-medium text-foreground mb-2">{p.title}</h3>
                  <p className="flex items-center gap-1.5 text-base text-muted-foreground mb-5">
                    <MapPin size={14} /> {p.location}
                  </p>
                  <div className="flex items-center gap-5 text-sm text-muted-foreground border-t border-border/50 pt-4">
                    {p.beds ? <span className="flex items-center gap-1.5"><Bed size={14} /> {p.beds}</span> : null}
                    {p.baths ? <span className="flex items-center gap-1.5"><Bath size={14} /> {p.baths}</span> : null}
                    {p.area ? <span className="flex items-center gap-1.5"><Maximize size={14} /> {p.area}m²</span> : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10 sm:mt-12 md:mt-16">
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 gap-2">
            <Link to="/imoveis">Ver todos os imóveis <ArrowRight size={14} /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
