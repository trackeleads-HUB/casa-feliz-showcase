import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import { ArrowLeft, Save, Sparkles, KeyRound, Plug, Eye, EyeOff } from "lucide-react";

type AISettings = {
  id: string;
  openai_api_key: string | null;
  model: string;
  instructions: string;
};

const DEFAULT_INSTRUCTIONS = `Você é um especialista em marketing imobiliário, copywriting e SEO para imóveis residenciais de alto padrão dentro do Terras Alphaville Camaçari.

Sua tarefa é gerar descrições profissionais, persuasivas, naturais e otimizadas para mecanismos de busca.

Diretrizes:
- Escreva em português do Brasil.
- Use linguagem sofisticada, clara e comercial.
- Valorize estilo de vida, segurança, conforto, lazer, localização e exclusividade.
- Não exagere com promessas falsas.
- Não invente informações que não foram fornecidas.
- Use técnicas avançadas de SEO sem deixar o texto artificial.
- Inclua naturalmente termos como: casas no Terras Alphaville Camaçari, imóvel no Terras Alphaville, casa à venda no Alphaville Camaçari, condomínio fechado em Camaçari, segurança, lazer, conforto e qualidade de vida, quando fizer sentido.
- O texto deve ser atrativo para compradores de imóveis de médio e alto padrão.
- Evite repetir muitas vezes a mesma palavra-chave.
- Use parágrafos curtos.
- Crie um texto pronto para ser publicado no site.
- Sempre destaque os diferenciais mais fortes do imóvel.`;

const maskKey = (key: string | null) => {
  if (!key) return "";
  if (key.length <= 8) return "••••";
  return `${key.slice(0, 3)}...${key.slice(-4)}`;
};

const AdminAI = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [hasStoredKey, setHasStoredKey] = useState(false);
  const [model, setModel] = useState("gpt-4.1-mini");
  const [instructions, setInstructions] = useState(DEFAULT_INSTRUCTIONS);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) init();
  }, [user]);

  const init = async () => {
    const { data: adminCheck } = await supabase.rpc("has_role", { _user_id: user!.id, _role: "admin" });
    if (!adminCheck) {
      toast({ title: "Acesso negado", description: "Apenas administradores.", variant: "destructive" });
      navigate("/dashboard");
      return;
    }
    setIsAdmin(true);

    const { data, error } = await supabase
      .from("ai_settings")
      .select("id, openai_api_key, model, instructions")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" });
    } else if (data) {
      setSettings(data);
      setHasStoredKey(!!data.openai_api_key);
      setModel(data.model || "gpt-4.1-mini");
      setInstructions(data.instructions || DEFAULT_INSTRUCTIONS);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const update: Record<string, unknown> = {
        model: model.trim() || "gpt-4.1-mini",
        instructions: instructions.trim(),
        updated_by: user!.id,
        updated_at: new Date().toISOString(),
      };
      // Only update key if user typed a new one
      if (apiKeyInput.trim()) {
        update.openai_api_key = apiKeyInput.trim();
      }
      const { error } = await supabase.from("ai_settings").update(update).eq("id", settings.id);
      if (error) throw error;
      toast({ title: "Configurações salvas!" });
      setApiKeyInput("");
      setShowKey(false);
      await init();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar";
      toast({ title: "Erro", description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke("test-openai-connection");
      if (error) throw error;
      if (data?.ok) {
        toast({ title: "Conexão OK!", description: `Modelo testado: ${data.model}` });
      } else {
        toast({ title: "Falha no teste", description: data?.error || "Erro desconhecido", variant: "destructive" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao testar";
      toast({ title: "Erro", description: msg, variant: "destructive" });
    } finally {
      setTesting(false);
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;
  }
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Configurações de IA" noindex />

      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground shrink-0">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles size={20} className="text-primary shrink-0" />
              <h1 className="text-base sm:text-xl font-bold truncate">Inteligência Artificial</h1>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} size="sm" className="gap-2">
            <Save size={16} />
            <span className="hidden sm:inline">{saving ? "Salvando..." : "Salvar"}</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-3xl space-y-6">
        {/* API Key */}
        <section className="bg-card border border-border rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <KeyRound size={18} className="text-primary" />
            <h2 className="text-lg font-semibold">Chave da API OpenAI</h2>
          </div>

          {hasStoredKey && !apiKeyInput && (
            <div className="flex items-center justify-between gap-3 p-3 rounded-md bg-muted/50 border border-border">
              <span className="text-sm text-muted-foreground">
                Chave salva: <code className="text-foreground">{maskKey(settings?.openai_api_key || null)}</code>
              </span>
              <span className="text-xs text-muted-foreground">Digite uma nova abaixo para substituir.</span>
            </div>
          )}

          <div>
            <Label htmlFor="api-key">{hasStoredKey ? "Substituir chave" : "Chave da API OpenAI"}</Label>
            <div className="relative mt-1.5">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="sk-..."
                autoComplete="off"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                aria-label={showKey ? "Ocultar" : "Mostrar"}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Cole aqui sua chave da API da OpenAI. Ela será usada apenas no backend para gerar descrições automáticas dos imóveis. Por segurança, ela nunca é exposta no navegador.
            </p>
          </div>
        </section>

        {/* Model */}
        <section className="bg-card border border-border rounded-xl p-5 sm:p-6 space-y-4">
          <h2 className="text-lg font-semibold">Modelo da IA</h2>
          <div>
            <Label htmlFor="model">Identificador do modelo</Label>
            <Input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="gpt-4.1-mini"
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Modelo usado para gerar os textos dos imóveis. Recomendado manter o modelo padrão, salvo se houver necessidade técnica de troca.
            </p>
          </div>
        </section>

        {/* Instructions */}
        <section className="bg-card border border-border rounded-xl p-5 sm:p-6 space-y-4">
          <h2 className="text-lg font-semibold">Instruções para geração dos textos</h2>
          <Textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={16}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Essas instruções servem como prompt de sistema para a IA. Ajuste o tom, palavras-chave e diretrizes conforme a estratégia do site.
          </p>
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pb-8">
          <Button onClick={handleSave} disabled={saving} className="flex-1 gap-2">
            <Save size={16} />
            {saving ? "Salvando..." : "Salvar Configurações"}
          </Button>
          <Button onClick={handleTest} disabled={testing || (!hasStoredKey && !apiKeyInput)} variant="outline" className="gap-2">
            <Plug size={16} />
            {testing ? "Testando..." : "Testar Conexão"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AdminAI;
