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
import { invalidateSettingsCache } from "@/hooks/useSiteSettings";
import { ArrowLeft, Save, Settings } from "lucide-react";

type SettingRow = {
  id: string;
  key: string;
  value: string;
  label: string;
};

const GROUPS = [
  {
    title: "Identidade do Site",
    keys: ["site_name", "site_tagline"],
  },
  {
    title: "Contato",
    keys: ["whatsapp", "phone", "email", "address"],
  },
  {
    title: "Redes Sociais",
    keys: ["instagram", "facebook", "linkedin"],
  },
  {
    title: "Textos da Página Inicial",
    keys: ["hero_title", "hero_subtitle", "cta_title", "cta_text"],
  },
];

const AdminSettings = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      checkAdmin();
      loadSettings();
    }
  }, [user]);

  const checkAdmin = async () => {
    const { data } = await supabase.rpc("has_role", {
      _user_id: user!.id,
      _role: "admin",
    });
    if (!data) {
      toast({ title: "Acesso negado", description: "Apenas administradores podem acessar esta página.", variant: "destructive" });
      navigate("/dashboard");
      return;
    }
    setIsAdmin(true);
  };

  const loadSettings = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("id, key, value, label")
      .order("key");

    if (error) {
      toast({ title: "Erro ao carregar configurações", variant: "destructive" });
    } else {
      setSettings(data || []);
    }
    setLoading(false);
  };

  const handleChange = (key: string, value: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const s of settings) {
        await supabase
          .from("site_settings")
          .update({ value: s.value, updated_at: new Date().toISOString() })
          .eq("id", s.id);
      }
      invalidateSettingsCache();
      toast({ title: "Configurações salvas com sucesso!" });
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const getSetting = (key: string) => settings.find((s) => s.key === key);

  const isLongText = (key: string) => ["hero_subtitle", "cta_text"].includes(key);

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Configurações Gerais" noindex />

      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Settings size={20} className="text-primary" />
              <h1 className="text-xl font-bold">
                Configurações Gerais
              </h1>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save size={16} />
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-3xl space-y-8">
        {GROUPS.map((group) => (
          <section key={group.title} className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">{group.title}</h2>

            {group.keys.map((key) => {
              const setting = getSetting(key);
              if (!setting) return null;

              return (
                <div key={key}>
                  <Label htmlFor={key}>{setting.label}</Label>
                  {isLongText(key) ? (
                    <Textarea
                      id={key}
                      value={setting.value || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      rows={3}
                      className="mt-1.5"
                    />
                  ) : (
                    <Input
                      id={key}
                      value={setting.value || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="mt-1.5"
                    />
                  )}
                </div>
              );
            })}
          </section>
        ))}

        <div className="pb-8">
          <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
            <Save size={16} />
            {saving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
