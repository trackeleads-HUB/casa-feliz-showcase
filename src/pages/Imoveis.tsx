import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Bed, Bath, Maximize, Home, Search, SlidersHorizontal } from "lucide-react";

const listingLabels: Record<string, string> = {
  venda: "Venda",
  aluguel: "Aluguel",
  venda_aluguel: "Venda/Aluguel",
};

const propertyTypeLabels: Record<string, string> = {
  casa: "Casa",
  apartamento: "Apartamento",
  terreno: "Terreno",
  comercial: "Comercial",
  cobertura: "Cobertura",
  chacara: "Chácara",
};

const formatPrice = (price: number | null) => {
  if (!price) return "Sob consulta";
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
};

type DisplayProperty = {
  id: string;
  image: string;
  title: string;
  location: string;
  price: number | null;
  beds: number | null;
  baths: number | null;
  area: number | null;
  tag: string;
  propertyType: string;
};

const Imoveis = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<DisplayProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filter state from URL
  const [propertyType, setPropertyType] = useState(searchParams.get("tipo") || "");
  const [listingType, setListingType] = useState(searchParams.get("negocio") || "");
  const [location, setLocation] = useState(searchParams.get("local") || "");
  const [priceRange, setPriceRange] = useState(searchParams.get("preco") || "");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (propertyType) params.set("tipo", propertyType);
    if (listingType) params.set("negocio", listingType);
    if (location) params.set("local", location);
    if (priceRange) params.set("preco", priceRange);
    setSearchParams(params);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);

      let query = supabase
        .from("properties")
        .select("id, title, listing_type, property_type, price, bedrooms, bathrooms, area, neighborhood, city, status", { count: "exact" })
        .eq("status", "disponivel")
        .order("created_at", { ascending: false });

      const tipo = searchParams.get("tipo") as Database["public"]["Enums"]["property_type"] | null;
      if (tipo) {
        query = query.eq("property_type", tipo);
      }

      const negocio = searchParams.get("negocio") as Database["public"]["Enums"]["listing_type"] | null;
      if (negocio) {
        query = query.eq("listing_type", negocio);
      }

      const local = searchParams.get("local");
      if (local) {
        query = query.or(`city.ilike.%${local}%,neighborhood.ilike.%${local}%,address.ilike.%${local}%`);
      }

      const preco = searchParams.get("preco");
      if (preco === "300000") {
        query = query.lte("price", 300000);
      } else if (preco === "300000-600000") {
        query = query.gte("price", 300000).lte("price", 600000);
      } else if (preco === "600000-1000000") {
        query = query.gte("price", 600000).lte("price", 1000000);
      } else if (preco === "1000000") {
        query = query.gte("price", 1000000);
      }

      const { data, error, count } = await query;

      if (error || !data) {
        setProperties([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }

      setTotalCount(count || 0);

      const withImages = await Promise.all(
        data.map(async (p) => {
          const { data: imgs } = await supabase
            .from("property_images")
            .select("url")
            .eq("property_id", p.id)
            .eq("is_cover", true)
            .limit(1);

          return {
            id: p.id,
            image: imgs?.[0]?.url || "",
            title: p.title,
            location: [p.neighborhood, p.city].filter(Boolean).join(", ") || "Localização não informada",
            price: p.price ? Number(p.price) : null,
            beds: p.bedrooms,
            baths: p.bathrooms,
            area: p.area ? Number(p.area) : null,
            tag: listingLabels[p.listing_type] || p.listing_type,
            propertyType: propertyTypeLabels[p.property_type] || p.property_type,
          };
        })
      );

      setProperties(withImages);
      setLoading(false);
    };

    fetchProperties();
  }, [searchParams]);

  // Sync URL params to state
  useEffect(() => {
    setPropertyType(searchParams.get("tipo") || "");
    setListingType(searchParams.get("negocio") || "");
    setLocation(searchParams.get("local") || "");
    setPriceRange(searchParams.get("preco") || "");
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Buscar Imóveis"
        description="Pesquise imóveis em Alphaville. Filtros por tipo, preço, localização. Casas, apartamentos, terrenos e muito mais."
        canonical={`${window.location.origin}/imoveis`}
      />
      <Navbar />

      {/* Filters */}
      <div className="pt-20 sm:pt-24 pb-6 sm:pb-8 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-6">
            <SlidersHorizontal size={20} className="text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Buscar Imóveis
            </h1>
          </div>

          <div className="bg-background rounded-xl p-4 shadow-sm border border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
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
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="">Venda ou Locação</option>
                <option value="venda">Venda</option>
                <option value="aluguel">Aluguel</option>
                <option value="venda_aluguel">Venda e Aluguel</option>
              </select>

              <Input
                placeholder="Localização"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
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
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <p className="text-muted-foreground mb-8">
          {loading ? "Buscando..." : `${totalCount} imóvel(is) encontrado(s)`}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-muted rounded-xl h-80 animate-pulse" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <Home size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum imóvel encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar os filtros para encontrar mais resultados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((p) => (
              <Link key={p.id} to={`/imoveis/${p.id}`}>
                <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-56 overflow-hidden bg-muted">
                    {p.image ? (
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                        <Home size={40} />
                      </div>
                    )}
                    <Badge className="absolute top-4 left-4">{p.tag}</Badge>
                    <Badge variant="secondary" className="absolute top-4 right-4">{p.propertyType}</Badge>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-2xl font-bold text-foreground mb-1">{formatPrice(p.price)}</p>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{p.title}</h3>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                      <MapPin size={14} /> {p.location}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-4">
                      {p.beds ? <span className="flex items-center gap-1"><Bed size={14} /> {p.beds}</span> : null}
                      {p.baths ? <span className="flex items-center gap-1"><Bath size={14} /> {p.baths}</span> : null}
                      {p.area ? <span className="flex items-center gap-1"><Maximize size={14} /> {p.area}m²</span> : null}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Imoveis;
