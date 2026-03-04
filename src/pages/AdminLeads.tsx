import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import { ArrowLeft, Trash2, MessageCircle, Users } from "lucide-react";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  property_type: string | null;
  listing_type: string | null;
  neighborhood: string | null;
  message: string | null;
  created_at: string;
};

const AdminLeads = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchLeads();
  }, [user]);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Erro ao carregar leads", description: error.message, variant: "destructive" });
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este contato?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    } else {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      toast({ title: "Contato excluído" });
    }
  };

  const openWhatsApp = (phone: string, name: string) => {
    const cleaned = phone.replace(/\D/g, "");
    const number = cleaned.startsWith("55") ? cleaned : `55${cleaned}`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(`Olá ${name}, tudo bem? Recebemos seu interesse em anunciar um imóvel conosco.`)}`, "_blank");
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const listingLabel: Record<string, string> = { venda: "Venda", aluguel: "Aluguel", venda_aluguel: "Venda/Aluguel" };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Leads - Admin" description="Gerenciar contatos de interessados" noindex />

      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              <Users size={20} /> Contatos / Leads
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Carregando contatos...</div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">Nenhum contato recebido ainda.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="hidden md:table-cell">Tipo</TableHead>
                  <TableHead className="hidden md:table-cell">Finalidade</TableHead>
                  <TableHead className="hidden lg:table-cell">Bairro</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(lead.created_at)}</TableCell>
                    <TableCell className="font-medium">
                      {lead.name}
                      {lead.email && <span className="block text-xs text-muted-foreground">{lead.email}</span>}
                    </TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell className="hidden md:table-cell capitalize">{lead.property_type || "-"}</TableCell>
                    <TableCell className="hidden md:table-cell">{listingLabel[lead.listing_type || ""] || "-"}</TableCell>
                    <TableCell className="hidden lg:table-cell">{lead.neighborhood || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="gap-1" onClick={() => openWhatsApp(lead.phone, lead.name)}>
                          <MessageCircle size={14} />
                        </Button>
                        <Button variant="destructive" size="sm" className="gap-1" onClick={() => handleDelete(lead.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminLeads;
