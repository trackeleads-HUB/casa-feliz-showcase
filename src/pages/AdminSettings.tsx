import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isMasterAdmin } from "@/lib/admin";
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

const DRAFT_STORAGE_KEY = "so-alphaville-admin-settings-draft";

const readDraft = (): Record<string, string> => {
  try {
    return JSON.parse(sessionStorage.getItem(DRAFT_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

const writeDraft = (draft: Record<string, string>) => {
  try {
    if (Object.keys(draft).length) {
      sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } else {
      sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  } catch {
    // Ignora falhas do navegador ao salvar rascunho local.
  }
};

const GROUPS: { title: string; keys: string[]; help?: string }[] = [
  { title: "Identidade do Site", keys: ["site_name", "site_tagline"] },
  { title: "Contato", keys: ["whatsapp", "phone", "email", "address"] },
  { title: "Redes Sociais", keys: ["instagram", "facebook", "linkedin"] },
  { title: "Hero / Página Inicial", keys: ["hero_title", "hero_subtitle"] },
  {
    title: "Seção: Para Proprietários",
    keys: ["owner_badge", "owner_title", "owner_text", "owner_button"],
  },
  {
    title: "Seção: Sobre Nós",
    keys: [
      "about_label", "about_title", "about_text_1", "about_text_2", "about_image",
      "about_stat_1_value", "about_stat_1_label",
      "about_stat_2_value", "about_stat_2_label",
      "about_stat_3_value", "about_stat_3_label",
      "about_stat_4_value", "about_stat_4_label",
    ],
  },
  {
    title: "Seção: Nossos Serviços",
    keys: [
      "services_label", "services_title",
      "service_1_title", "service_1_desc",
      "service_2_title", "service_2_desc",
      "service_3_title", "service_3_desc",
      "service_4_title", "service_4_desc",
    ],
  },
  {
    title: "Seção: Depoimentos",
    keys: ["testimonials_label", "testimonials_title"],
    help: "Para gerenciar os depoimentos em si, acesse Admin → Depoimentos.",
  },
  {
    title: "Seção: Entre em Contato",
    keys: ["cta_label", "cta_title", "cta_text", "cta_button"],
  },
];

const IMAGE_KEYS = new Set(["about_image"]);
const IMAGE_HINTS: Record<string, string> = {
  about_image: "Tamanho ideal: 1200×900px (proporção 4:3). Formatos: JPG ou WebP. Até 500KB para carregamento rápido.",
};

const AdminSettings = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const dirtyRef = useRef<Record<string, string>>(readDraft());

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
    else if (!authLoading && user && !isMasterAdmin(user)) navigate("/dashboard");
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
      const draft = dirtyRef.current;
      setSettings((data || []).map((s) => ({ ...s, value: draft[s.key] ?? s.value ?? "" })));
    }
    setLoading(false);
  };

  const handleChange = (key: string, value: string) => {
    dirtyRef.current = { ...dirtyRef.current, [key]: value };
    writeDraft(dirtyRef.current);
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const changedSettings = settings.filter((s) => Object.prototype.hasOwnProperty.call(dirtyRef.current, s.key));

      for (const s of changedSettings) {
        const { error } = await supabase
          .from("site_settings")
          .update({ value: s.value ?? "", updated_at: new Date().toISOString() })
          .eq("key", s.key);

        if (error) throw new Error(`${s.label || s.key}: ${error.message}`);
      }
      dirtyRef.current = {};
      writeDraft({});
      invalidateSettingsCache();
      toast({ title: "Configurações salvas com sucesso!", description: "As alterações foram gravadas e já estão disponíveis no site." });
      await loadSettings();
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const getSetting = (key: string) => settings.find((s) => s.key === key);

  const isLongText = (key: string) =>
    ["hero_subtitle", "cta_text", "owner_text", "about_text_1", "about_text_2",
     "service_1_desc", "service_2_desc", "service_3_desc", "service_4_desc"].includes(key);

  const handleImageUpload = async (key: string, file: File) => {
    if (!file) return;
    const ext = file.name.split(".").pop();
    const path = `${key}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("site-images").upload(path, file, { upsert: true });
    if (upErr) {
      toast({ title: "Erro no upload", description: upErr.message, variant: "destructive" });
      return;
    }
    const { data } = supabase.storage.from("site-images").getPublicUrl(path);
    handleChange(key, data.publicUrl);
    toast({ title: "Imagem enviada! Lembre de salvar." });
  };

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
            <div>
              <h2 className="text-lg font-semibold text-foreground">{group.title}</h2>
              {group.help && <p className="text-xs text-muted-foreground mt-1">{group.help}</p>}
            </div>

            {group.keys.map((key) => {
              const setting = getSetting(key);
              if (!setting) return null;
              const isImage = IMAGE_KEYS.has(key);

              return (
                <div key={key}>
                  <Label htmlFor={key}>{setting.label}</Label>
                  {isImage ? (
                    <div className="mt-1.5 space-y-2">
                      {setting.value && (
                        <img src={setting.value} alt="" className="w-full max-w-xs h-32 object-cover rounded-md border border-border" />
                      )}
                      <div className="flex gap-2 items-center">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleImageUpload(key, e.target.files[0])}
                          className="flex-1"
                        />
                        {setting.value && (
                          <Button type="button" variant="outline" size="sm" onClick={() => handleChange(key, "")}>
                            Remover
                          </Button>
                        )}
                      </div>
                      <Input
                        value={setting.value || ""}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder="Ou cole uma URL de imagem"
                      />
                      {IMAGE_HINTS[key] && (
                        <p className="text-xs text-muted-foreground">📐 {IMAGE_HINTS[key]}</p>
                      )}
                    </div>
                  ) : isLongText(key) ? (
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
