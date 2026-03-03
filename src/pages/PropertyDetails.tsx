import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import PropertyGallery from "@/components/PropertyGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin, Bed, Bath, Maximize, Car, Home, ArrowLeft,
  Phone, Mail, MessageCircle, Share2, CheckCircle2,
} from "lucide-react";

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

const statusLabels: Record<string, string> = {
  disponivel: "Disponível",
  vendido: "Vendido",
  alugado: "Alugado",
  reservado: "Reservado",
};

const formatPrice = (price: number | null) => {
  if (!price) return "Sob consulta";
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
};

type PropertyData = {
  id: string;
  title: string;
  description: string | null;
  listing_type: string;
  property_type: string;
  status: string;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  parking_spots: number | null;
  address: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  features: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
};

const PropertyDetails = () => {
  const { settings } = useSiteSettings();
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [images, setImages] = useState<{ url: string; is_cover: boolean | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);

      const [propRes, imgRes] = await Promise.all([
        supabase.from("properties").select("*").eq("id", id).single(),
        supabase
          .from("property_images")
          .select("url, is_cover")
          .eq("property_id", id)
          .order("sort_order", { ascending: true }),
      ]);

      if (propRes.error || !propRes.data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProperty({
        ...propRes.data,
        price: propRes.data.price ? Number(propRes.data.price) : null,
        area: propRes.data.area ? Number(propRes.data.area) : null,
      });
      setImages(imgRes.data || []);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const fullAddress = property
    ? [property.address, property.neighborhood, property.city, property.state]
        .filter(Boolean)
        .join(", ")
    : "";

  const whatsappMessage = property
    ? encodeURIComponent(`Olá! Tenho interesse no imóvel "${property.title}". Poderia me enviar mais informações?`)
    : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-6 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-96 bg-muted rounded-xl" />
            <div className="h-6 w-3/4 bg-muted rounded" />
            <div className="h-4 w-1/2 bg-muted rounded" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-6 py-20 text-center">
          <Home size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Imóvel não encontrado</h2>
          <p className="text-muted-foreground mb-6">Este imóvel pode ter sido removido ou o link está incorreto.</p>
          <Link to="/imoveis">
            <Button variant="outline" className="gap-2">
              <ArrowLeft size={16} /> Voltar para imóveis
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const coverImage = images.find((i) => i.is_cover)?.url || images[0]?.url || "";

  const seoTitle = property.meta_title || property.title;
  const seoDesc = property.meta_description || 
    `${propertyTypeLabels[property.property_type] || property.property_type} ${listingLabels[property.listing_type]?.toLowerCase() || ""} em ${property.neighborhood || property.city || "Alphaville"}. ${property.bedrooms ? property.bedrooms + " quartos, " : ""}${property.area ? property.area + "m². " : ""}${formatPrice(property.price)}.`;
  
  const propertyJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description || seoDesc,
    url: `${window.location.origin}/imoveis/${property.id}`,
    ...(coverImage && { image: coverImage }),
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address || undefined,
      addressLocality: property.city || "Barueri",
      addressRegion: property.state || "SP",
      addressCountry: "BR",
      postalCode: property.zip_code || undefined,
    },
    ...(property.price && {
      offers: {
        "@type": "Offer",
        price: property.price,
        priceCurrency: "BRL",
        availability: property.status === "disponivel" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      },
    }),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        canonical={`${window.location.origin}/imoveis/${property.id}`}
        ogImage={coverImage || undefined}
        ogType="article"
        jsonLd={propertyJsonLd}
      />
      <Navbar />

      <div className="pt-20 sm:pt-24 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back link */}
        <Link to="/imoveis" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft size={16} /> Voltar para resultados
        </Link>

        {/* Gallery */}
        <PropertyGallery images={images} title={property.title} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-6 lg:mt-8">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6 order-2 lg:order-1">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge>{listingLabels[property.listing_type] || property.listing_type}</Badge>
                <Badge variant="secondary">{propertyTypeLabels[property.property_type] || property.property_type}</Badge>
                <Badge variant="outline">{statusLabels[property.status] || property.status}</Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
                {property.title}
              </h1>
              {fullAddress && (
                <p className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin size={16} /> {fullAddress}
                </p>
              )}
            </div>

            <p className="text-3xl font-bold text-primary">{formatPrice(property.price)}</p>

            {/* Key specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {property.bedrooms ? (
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                  <Bed size={20} className="text-primary" />
                  <div>
                    <p className="text-lg font-semibold text-foreground">{property.bedrooms}</p>
                    <p className="text-xs text-muted-foreground">Quartos</p>
                  </div>
                </div>
              ) : null}
              {property.bathrooms ? (
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                  <Bath size={20} className="text-primary" />
                  <div>
                    <p className="text-lg font-semibold text-foreground">{property.bathrooms}</p>
                    <p className="text-xs text-muted-foreground">Banheiros</p>
                  </div>
                </div>
              ) : null}
              {property.area ? (
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                  <Maximize size={20} className="text-primary" />
                  <div>
                    <p className="text-lg font-semibold text-foreground">{property.area}m²</p>
                    <p className="text-xs text-muted-foreground">Área</p>
                  </div>
                </div>
              ) : null}
              {property.parking_spots ? (
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                  <Car size={20} className="text-primary" />
                  <div>
                    <p className="text-lg font-semibold text-foreground">{property.parking_spots}</p>
                    <p className="text-xs text-muted-foreground">Vagas</p>
                  </div>
                </div>
              ) : null}
            </div>

            <Separator />

            {/* Description */}
            {property.description && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Descrição
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Características
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {property.features.map((f, i) => (
                    <span key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 size={14} className="text-primary shrink-0" /> {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar – Contact */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="lg:sticky lg:top-28 bg-card border border-border rounded-xl p-5 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
              <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                Interessado neste imóvel?
              </h3>
              <p className="text-sm text-muted-foreground">
                Entre em contato conosco para agendar uma visita ou obter mais informações.
              </p>

              <a
                href={`https://wa.me/${settings.whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full gap-2 bg-[hsl(142,70%,35%)] hover:bg-[hsl(142,70%,30%)] text-white">
                  <MessageCircle size={18} /> WhatsApp
                </Button>
              </a>

              <a href={`tel:+${settings.whatsapp}`}>
                <Button variant="outline" className="w-full gap-2 mt-2">
                  <Phone size={18} /> {settings.phone}
                </Button>
              </a>

              <a href={`mailto:${settings.email}`}>
                <Button variant="outline" className="w-full gap-2">
                  <Mail size={18} /> Enviar e-mail
                </Button>
              </a>

              <Separator />

              <Button
                variant="ghost"
                className="w-full gap-2 text-muted-foreground"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
              >
                <Share2 size={16} /> Compartilhar link
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetails;
