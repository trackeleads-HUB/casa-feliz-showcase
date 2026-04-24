import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import { invalidateSettingsCache } from "@/hooks/useSiteSettings";
import {
  ArrowLeft, Save, Search, BarChart3, ShieldCheck, FileText, HelpCircle,
  Plus, Trash2, ChevronUp, ChevronDown,
} from "lucide-react";

type SettingRow = { id: string; key: string; value: string; label: string };
type FAQ = { id: string; question: string; answer: string; sort_order: number; is_active: boolean };

const SEO_KEYS = ["default_meta_title", "default_meta_description", "default_og_image", "site_url"];
const TRACKING_KEYS = ["gtm_id", "ga_id", "google_ads_id", "facebook_pixel_id"];
const VERIFICATION_KEYS = ["google_site_verification", "bing_site_verification", "facebook_domain_verification"];
const BUSINESS_KEYS = ["cnpj", "creci"];
const LEGAL_KEYS = ["privacy_policy_content", "terms_of_use_content"];

const longTextKeys = new Set([
  "default_meta_description",
  "privacy_policy_content",
  "terms_of_use_content",
]);

const AdminSEO = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (!data) {
        toast({ title: "Acesso negado", variant: "destructive" });
        navigate("/dashboard");
        return;
      }
      setIsAdmin(true);
      await Promise.all([loadSettings(), loadFaqs()]);
      setLoading(false);
    })();
  }, [user]);

  const loadSettings = async () => {
    const allKeys = [...SEO_KEYS, ...TRACKING_KEYS, ...VERIFICATION_KEYS, ...BUSINESS_KEYS, ...LEGAL_KEYS];
    const { data } = await supabase
      .from("site_settings")
      .select("id, key, value, label")
      .in("key", allKeys);
    setSettings(data || []);
  };

  const loadFaqs = async () => {
    const { data } = await supabase
      .from("faqs")
      .select("*")
      .order("sort_order", { ascending: true });
    setFaqs(data || []);
  };

  const get = (key: string) => settings.find((s) => s.key === key);

  const change = (key: string, value: string) => {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      for (const s of settings) {
        await supabase
          .from("site_settings")
          .update({ value: s.value, updated_at: new Date().toISOString() })
          .eq("id", s.id);
      }
      invalidateSettingsCache();
      toast({ title: "Configurações de SEO salvas!" });
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // FAQs CRUD
  const addFaq = async () => {
    const max = faqs.reduce((m, f) => Math.max(m, f.sort_order), 0);
    const { data, error } = await supabase
      .from("faqs")
      .insert({ question: "Nova pergunta", answer: "Resposta…", sort_order: max + 1 })
      .select()
      .single();
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else if (data) setFaqs((p) => [...p, data]);
  };

  const updateFaq = (id: string, patch: Partial<FAQ>) =>
    setFaqs((p) => p.map((f) => (f.id === id ? { ...f, ...patch } : f)));

  const persistFaq = async (id: string) => {
    const f = faqs.find((x) => x.id === id);
    if (!f) return;
    const { error } = await supabase
      .from("faqs")
      .update({ question: f.question, answer: f.answer, is_active: f.is_active, sort_order: f.sort_order })
      .eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else toast({ title: "FAQ atualizada" });
  };

  const deleteFaq = async (id: string) => {
    if (!confirm("Excluir esta pergunta?")) return;
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else setFaqs((p) => p.filter((f) => f.id !== id));
  };

  const moveFaq = async (id: string, dir: -1 | 1) => {
    const idx = faqs.findIndex((f) => f.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= faqs.length) return;
    const a = faqs[idx], b = faqs[swap];
    const newOrder = [...faqs];
    newOrder[idx] = { ...b, sort_order: a.sort_order };
    newOrder[swap] = { ...a, sort_order: b.sort_order };
    setFaqs(newOrder);
    await Promise.all([
      supabase.from("faqs").update({ sort_order: a.sort_order }).eq("id", b.id),
      supabase.from("faqs").update({ sort_order: b.sort_order }).eq("id", a.id),
    ]);
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;
  }
  if (!isAdmin) return null;

  const renderField = (key: string) => {
    const s = get(key);
    if (!s) return null;
    return (
      <div key={key}>
        <Label htmlFor={key}>{s.label}</Label>
        {longTextKeys.has(key) ? (
          <Textarea
            id={key}
            value={s.value || ""}
            onChange={(e) => change(key, e.target.value)}
            rows={key.includes("content") ? 14 : 3}
            className="mt-1.5 font-mono text-sm"
          />
        ) : (
          <Input
            id={key}
            value={s.value || ""}
            onChange={(e) => change(key, e.target.value)}
            className="mt-1.5"
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="SEO & Marketing" noindex />

      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Search size={20} className="text-primary" />
              <h1 className="text-xl font-bold">SEO &amp; Marketing</h1>
            </div>
          </div>
          <Button onClick={saveAll} disabled={saving} className="gap-2">
            <Save size={16} />
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <Tabs defaultValue="seo" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="seo" className="gap-2"><Search size={14}/>SEO</TabsTrigger>
            <TabsTrigger value="tracking" className="gap-2"><BarChart3 size={14}/>Tracking</TabsTrigger>
            <TabsTrigger value="verification" className="gap-2"><ShieldCheck size={14}/>Verificações</TabsTrigger>
            <TabsTrigger value="legal" className="gap-2"><FileText size={14}/>Legal</TabsTrigger>
            <TabsTrigger value="faq" className="gap-2"><HelpCircle size={14}/>FAQ</TabsTrigger>
          </TabsList>

          {/* SEO BASE */}
          <TabsContent value="seo" className="space-y-4">
            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold">Meta tags padrão</h2>
              <p className="text-sm text-muted-foreground">
                Aplicado em páginas sem título/descrição específicos. Recomendado: título &lt; 60 caracteres, descrição &lt; 160.
              </p>
              {SEO_KEYS.map(renderField)}
            </section>
            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold">Dados da empresa</h2>
              {BUSINESS_KEYS.map(renderField)}
            </section>
          </TabsContent>

          {/* TRACKING */}
          <TabsContent value="tracking" className="space-y-4">
            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold">Google Tag Manager &amp; Analytics</h2>
              <p className="text-sm text-muted-foreground">
                Os scripts são injetados automaticamente em todas as páginas após o salvamento.
              </p>
              {TRACKING_KEYS.map(renderField)}
            </section>
          </TabsContent>

          {/* VERIFICAÇÕES */}
          <TabsContent value="verification" className="space-y-4">
            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold">Códigos de Verificação</h2>
              <p className="text-sm text-muted-foreground">
                Cole apenas o valor do <code>content</code> da meta tag fornecida pela ferramenta.
              </p>
              {VERIFICATION_KEYS.map(renderField)}
            </section>
          </TabsContent>

          {/* LEGAL */}
          <TabsContent value="legal" className="space-y-4">
            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold">Conteúdo Legal</h2>
              <p className="text-sm text-muted-foreground">
                Aceita Markdown básico (<code># título</code>, <code>**negrito**</code>, listas com <code>-</code>).
              </p>
              {LEGAL_KEYS.map(renderField)}
            </section>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq" className="space-y-4">
            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Perguntas Frequentes</h2>
                <Button onClick={addFaq} size="sm" className="gap-2"><Plus size={14}/>Nova</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Aparecem na home com schema <code>FAQPage</code>, ajudando o ranqueamento no Google.
              </p>

              <div className="space-y-3">
                {faqs.map((f, i) => (
                  <div key={f.id} className="border border-border rounded-lg p-4 space-y-3 bg-background">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" disabled={i === 0} onClick={() => moveFaq(f.id, -1)}>
                          <ChevronUp size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" disabled={i === faqs.length - 1} onClick={() => moveFaq(f.id, 1)}>
                          <ChevronDown size={16} />
                        </Button>
                        <label className="text-xs text-muted-foreground flex items-center gap-1.5 ml-2">
                          <input
                            type="checkbox"
                            checked={f.is_active}
                            onChange={(e) => updateFaq(f.id, { is_active: e.target.checked })}
                          />
                          Ativa
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => persistFaq(f.id)}>Salvar</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteFaq(f.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    <Input
                      value={f.question}
                      onChange={(e) => updateFaq(f.id, { question: e.target.value })}
                      placeholder="Pergunta"
                    />
                    <Textarea
                      value={f.answer}
                      onChange={(e) => updateFaq(f.id, { answer: e.target.value })}
                      placeholder="Resposta"
                      rows={3}
                    />
                  </div>
                ))}
                {faqs.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">Nenhuma FAQ cadastrada.</p>
                )}
              </div>
            </section>
          </TabsContent>
        </Tabs>

        <div className="pt-6 pb-8">
          <Button onClick={saveAll} disabled={saving} className="w-full gap-2">
            <Save size={16} />
            {saving ? "Salvando..." : "Salvar todas as configurações"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AdminSEO;
