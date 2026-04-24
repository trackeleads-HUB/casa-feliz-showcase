import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import { ArrowLeft, Plus, Save, Trash2, MessageSquareQuote, GripVertical } from "lucide-react";

type Testimonial = {
  id: string;
  name: string;
  initials: string;
  text: string;
  sort_order: number;
  is_active: boolean;
};

const AdminTestimonials = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      checkAdmin();
      loadTestimonials();
    }
  }, [user]);

  const checkAdmin = async () => {
    const { data } = await supabase.rpc("has_role", { _user_id: user!.id, _role: "admin" });
    if (!data) {
      toast({ title: "Acesso negado", variant: "destructive" });
      navigate("/dashboard");
      return;
    }
    setIsAdmin(true);
  };

  const loadTestimonials = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, name, initials, text, sort_order, is_active")
      .order("sort_order");
    if (error) {
      toast({ title: "Erro ao carregar depoimentos", variant: "destructive" });
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  };

  const handleChange = (id: string, field: keyof Testimonial, value: string | boolean) => {
    setTestimonials((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const updated = { ...t, [field]: value };
        if (field === "name" && typeof value === "string") {
          const parts = value.trim().split(/\s+/);
          updated.initials = parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : value.substring(0, 2).toUpperCase();
        }
        return updated;
      })
    );
  };

  const addTestimonial = () => {
    const maxOrder = testimonials.reduce((max, t) => Math.max(max, t.sort_order), 0);
    setTestimonials((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        name: "",
        initials: "",
        text: "",
        sort_order: maxOrder + 1,
        is_active: true,
      },
    ]);
  };

  const removeTestimonial = async (id: string) => {
    if (id.startsWith("new-")) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      return;
    }
    if (!confirm("Excluir este depoimento?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    } else {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Depoimento excluído" });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const t of testimonials) {
        if (!t.name.trim() || !t.text.trim()) continue;
        if (t.id.startsWith("new-")) {
          await supabase.from("testimonials").insert({
            name: t.name,
            initials: t.initials,
            text: t.text,
            sort_order: t.sort_order,
            is_active: t.is_active,
          });
        } else {
          await supabase.from("testimonials").update({
            name: t.name,
            initials: t.initials,
            text: t.text,
            sort_order: t.sort_order,
            is_active: t.is_active,
          }).eq("id", t.id);
        }
      }
      toast({ title: "Depoimentos salvos com sucesso!" });
      loadTestimonials();
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;
  }
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Gerenciar Depoimentos" noindex />

      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <MessageSquareQuote size={20} className="text-primary" />
              <h1 className="text-xl font-bold">
                Depoimentos
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={addTestimonial} className="gap-2">
              <Plus size={16} /> Novo
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save size={16} /> {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-3xl space-y-6">
        {testimonials.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquareQuote size={48} className="mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground mb-4">Nenhum depoimento cadastrado.</p>
            <Button onClick={addTestimonial} className="gap-2"><Plus size={16} /> Adicionar Depoimento</Button>
          </div>
        ) : (
          testimonials.map((t, index) => (
            <div key={t.id} className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GripVertical size={16} />
                  <span className="text-sm font-medium">#{index + 1}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`active-${t.id}`} className="text-sm">Ativo</Label>
                    <Switch
                      id={`active-${t.id}`}
                      checked={t.is_active}
                      onCheckedChange={(v) => handleChange(t.id, "is_active", v)}
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeTestimonial(t.id)}>
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`name-${t.id}`}>Nome</Label>
                  <Input
                    id={`name-${t.id}`}
                    value={t.name}
                    onChange={(e) => handleChange(t.id, "name", e.target.value)}
                    placeholder="Nome do cliente"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor={`initials-${t.id}`}>Iniciais</Label>
                  <Input
                    id={`initials-${t.id}`}
                    value={t.initials}
                    onChange={(e) => handleChange(t.id, "initials", e.target.value)}
                    placeholder="MS"
                    maxLength={3}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`text-${t.id}`}>Depoimento</Label>
                <Textarea
                  id={`text-${t.id}`}
                  value={t.text}
                  onChange={(e) => handleChange(t.id, "text", e.target.value)}
                  placeholder="Texto do depoimento..."
                  rows={3}
                  className="mt-1.5"
                />
              </div>
            </div>
          ))
        )}

        {testimonials.length > 0 && (
          <div className="pb-8">
            <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
              <Save size={16} /> {saving ? "Salvando..." : "Salvar Depoimentos"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminTestimonials;
