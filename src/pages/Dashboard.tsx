import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import { Plus, LogOut, Pencil, Trash2, Home, Bed, Bath, Ruler, ArrowLeft, Settings, MessageSquareQuote } from "lucide-react";

type Property = {
  id: string;
  title: string;
  property_type: string;
  listing_type: string;
  status: string;
  price: number | null;
  city: string | null;
  neighborhood: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  created_at: string;
  cover_url?: string;
};

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  disponivel: { label: "Disponível", variant: "default" },
  vendido: { label: "Vendido", variant: "secondary" },
  alugado: { label: "Alugado", variant: "secondary" },
  reservado: { label: "Reservado", variant: "outline" },
};

const typeMap: Record<string, string> = {
  casa: "Casa", apartamento: "Apartamento", terreno: "Terreno",
  comercial: "Comercial", cobertura: "Cobertura", chacara: "Chácara",
};

const listingMap: Record<string, string> = {
  venda: "Venda", aluguel: "Aluguel", venda_aluguel: "Venda/Aluguel",
};

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => {
        setIsAdmin(!!data);
      });
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchProperties();
  }, [user]);

  const fetchProperties = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("properties")
      .select("id, title, property_type, listing_type, status, price, city, neighborhood, bedrooms, bathrooms, area, created_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Erro ao carregar imóveis", description: error.message, variant: "destructive" });
    } else {
      // Fetch cover images
      const withCovers = await Promise.all(
        (data || []).map(async (p) => {
          const { data: imgs } = await supabase
            .from("property_images")
            .select("url")
            .eq("property_id", p.id)
            .eq("is_cover", true)
            .limit(1);
          return { ...p, cover_url: imgs?.[0]?.url };
        })
      );
      setProperties(withCovers);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este imóvel?")) return;

    // Delete images from storage
    const { data: images } = await supabase.from("property_images").select("storage_path").eq("property_id", id);
    if (images?.length) {
      await supabase.storage.from("property-images").remove(images.map((i) => i.storage_path));
    }

    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    } else {
      setProperties((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Imóvel excluído com sucesso" });
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "Sob consulta";
    return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Meus Imóveis" description="Gerencie seus imóveis cadastrados na SO Alphaville." noindex />
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Meus Imóveis
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate("/admin/leads")}>
                  <Home size={16} /> Leads
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate("/admin/depoimentos")}>
                  <MessageSquareQuote size={16} /> Depoimentos
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate("/admin/configuracoes")}>
                  <Settings size={16} /> Configurações
                </Button>
              </div>
            )}
            <Button onClick={() => navigate("/imoveis/novo")} size="sm" className="gap-2">
              <Plus size={16} /> Novo Imóvel
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
              <LogOut size={16} /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Carregando imóveis...</div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <Home size={48} className="mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground mb-4">Você ainda não cadastrou nenhum imóvel.</p>
            <Button onClick={() => navigate("/imoveis/novo")} className="gap-2">
              <Plus size={16} /> Cadastrar Primeiro Imóvel
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <div key={p.id} className="bg-card border border-border rounded-xl overflow-hidden group hover:shadow-md transition-shadow">
                <div className="aspect-video bg-muted relative">
                  {p.cover_url ? (
                    <img src={p.cover_url} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                      <Home size={40} />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant={statusMap[p.status]?.variant || "default"}>
                      {statusMap[p.status]?.label || p.status}
                    </Badge>
                    <Badge variant="outline" className="bg-card/80 backdrop-blur-sm">
                      {listingMap[p.listing_type] || p.listing_type}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{typeMap[p.property_type] || p.property_type}</p>
                  <h3 className="font-semibold text-foreground mb-1 truncate">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {[p.neighborhood, p.city].filter(Boolean).join(", ") || "Localização não informada"}
                  </p>
                  <p className="text-lg font-bold text-primary mb-3">{formatPrice(p.price)}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    {p.bedrooms ? <span className="flex items-center gap-1"><Bed size={14} /> {p.bedrooms}</span> : null}
                    {p.bathrooms ? <span className="flex items-center gap-1"><Bath size={14} /> {p.bathrooms}</span> : null}
                    {p.area ? <span className="flex items-center gap-1"><Ruler size={14} /> {p.area}m²</span> : null}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => navigate(`/imoveis/${p.id}/editar`)}>
                      <Pencil size={14} /> Editar
                    </Button>
                    <Button variant="destructive" size="sm" className="gap-1" onClick={() => handleDelete(p.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
