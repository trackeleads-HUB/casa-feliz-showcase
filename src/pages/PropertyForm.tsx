import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Upload, X, Star, Sparkles, Loader2 } from "lucide-react";

const FEATURES_OPTIONS = [
  "Piscina", "Churrasqueira", "Academia", "Playground", "Portaria 24h",
  "Varanda", "Ar condicionado", "Aquecimento", "Elevador", "Garagem coberta",
  "Quadra esportiva", "Salão de festas", "Área gourmet", "Pet friendly",
];

type ImageFile = {
  id?: string;
  file?: File;
  preview: string;
  url?: string;
  storage_path?: string;
  is_cover: boolean;
};

const PropertyForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);
  const [aiPreview, setAiPreview] = useState<string>("");
  const [editingPreview, setEditingPreview] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    property_type: "casa" as string,
    listing_type: "venda" as string,
    status: "disponivel" as string,
    price: "",
    area: "",
    bedrooms: "0",
    bathrooms: "0",
    parking_spots: "0",
    address: "",
    neighborhood: "",
    city: "",
    state: "SP",
    zip_code: "",
    features: [] as string[],
    meta_title: "",
    meta_description: "",
  });

  const [images, setImages] = useState<ImageFile[]>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (isEditing && user) loadProperty();
  }, [id, user]);

  const loadProperty = async () => {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id!)
      .single();

    if (error || !data) {
      toast({ title: "Imóvel não encontrado", variant: "destructive" });
      navigate("/dashboard");
      return;
    }

    setForm({
      title: data.title,
      description: data.description || "",
      property_type: data.property_type,
      listing_type: data.listing_type,
      status: data.status,
      price: data.price?.toString() || "",
      area: data.area?.toString() || "",
      bedrooms: data.bedrooms?.toString() || "0",
      bathrooms: data.bathrooms?.toString() || "0",
      parking_spots: data.parking_spots?.toString() || "0",
      address: data.address || "",
      neighborhood: data.neighborhood || "",
      city: data.city || "",
      state: data.state || "SP",
      zip_code: data.zip_code || "",
      features: data.features || [],
      meta_title: (data as any).meta_title || "",
      meta_description: (data as any).meta_description || "",
    });

    // Load images
    const { data: imgs } = await supabase
      .from("property_images")
      .select("*")
      .eq("property_id", id!)
      .order("sort_order");

    if (imgs) {
      setImages(imgs.map((img) => ({
        id: img.id,
        preview: img.url,
        url: img.url,
        storage_path: img.storage_path,
        is_cover: img.is_cover || false,
      })));
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleFeature = (feature: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: ImageFile[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      is_cover: images.length === 0 && files.indexOf(file) === 0,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (prev[index].is_cover && updated.length > 0) {
        updated[0].is_cover = true;
      }
      return updated;
    });
  };

  const setCover = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, is_cover: i === index }))
    );
  };

  const requestGenerateAI = () => {
    if (!form.title.trim()) {
      toast({ title: "Preencha pelo menos o título antes de gerar.", variant: "destructive" });
      return;
    }
    if (form.description.trim()) {
      setConfirmOverwrite(true);
      return;
    }
    void generateAIDescription();
  };

  const generateAIDescription = async () => {
    setConfirmOverwrite(false);
    setGeneratingAI(true);
    try {
      const payload = {
        property: {
          title: form.title,
          description: form.description,
          property_type: form.property_type,
          listing_type: form.listing_type,
          price: form.price ? parseFloat(form.price) : null,
          area: form.area ? parseFloat(form.area) : null,
          bedrooms: parseInt(form.bedrooms) || 0,
          bathrooms: parseInt(form.bathrooms) || 0,
          parking_spots: parseInt(form.parking_spots) || 0,
          address: form.address,
          neighborhood: form.neighborhood,
          city: form.city,
          state: form.state,
          features: form.features,
        },
      };
      const { data, error } = await supabase.functions.invoke("generate-property-description", { body: payload });
      if (error) throw error;
      if (!data?.description) throw new Error("Resposta vazia da IA.");
      setForm((prev) => ({ ...prev, description: data.description }));
      toast({ title: "Descrição gerada!", description: "Revise e ajuste antes de salvar." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao gerar descrição";
      toast({ title: "Erro na IA", description: msg, variant: "destructive" });
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.title.trim()) {
      toast({ title: "Preencha o título do imóvel", variant: "destructive" });
      return;
    }

    setSaving(true);

    try {
      const propertyData = {
        user_id: user.id,
        title: form.title.trim(),
        description: form.description.trim() || null,
        property_type: form.property_type as any,
        listing_type: form.listing_type as any,
        status: form.status as any,
        price: form.price ? parseFloat(form.price) : null,
        area: form.area ? parseFloat(form.area) : null,
        bedrooms: parseInt(form.bedrooms) || 0,
        bathrooms: parseInt(form.bathrooms) || 0,
        parking_spots: parseInt(form.parking_spots) || 0,
        address: form.address.trim() || null,
        neighborhood: form.neighborhood.trim() || null,
        city: form.city.trim() || null,
        state: form.state.trim() || null,
        zip_code: form.zip_code.trim() || null,
        features: form.features,
        meta_title: form.meta_title.trim() || null,
        meta_description: form.meta_description.trim() || null,
      };

      let propertyId = id;

      if (isEditing) {
        const { error } = await supabase.from("properties").update(propertyData).eq("id", id!);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("properties").insert(propertyData).select("id").single();
        if (error) throw error;
        propertyId = data.id;
      }

      // Upload new images
      const newImages = images.filter((img) => img.file);
      for (const img of newImages) {
        const ext = img.file!.name.split(".").pop();
        const path = `${user.id}/${propertyId}/${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(path, img.file!);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("property-images").getPublicUrl(path);

        await supabase.from("property_images").insert({
          property_id: propertyId!,
          url: urlData.publicUrl,
          storage_path: path,
          is_cover: img.is_cover,
          sort_order: images.indexOf(img),
        });
      }

      // Update cover status for existing images
      const existingImages = images.filter((img) => img.id);
      for (const img of existingImages) {
        await supabase.from("property_images").update({ is_cover: img.is_cover }).eq("id", img.id!);
      }

      // Delete removed images
      if (isEditing) {
        const currentIds = images.filter((img) => img.id).map((img) => img.id!);
        const { data: allImgs } = await supabase
          .from("property_images")
          .select("id, storage_path")
          .eq("property_id", propertyId!);

        const toDelete = (allImgs || []).filter((img) => !currentIds.includes(img.id));
        if (toDelete.length) {
          await supabase.storage.from("property-images").remove(toDelete.map((i) => i.storage_path));
          await supabase.from("property_images").delete().in("id", toDelete.map((i) => i.id));
        }
      }

      toast({ title: isEditing ? "Imóvel atualizado!" : "Imóvel cadastrado!" });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">
            {isEditing ? "Editar Imóvel" : "Novo Imóvel"}
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <section className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Informações Básicas</h2>

            <div>
              <Label htmlFor="title">Título *</Label>
              <Input id="title" value={form.title} onChange={(e) => handleChange("title", e.target.value)} placeholder="Ex: Casa moderna em Alphaville" className="mt-1.5" required />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" value={form.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Descreva o imóvel..." rows={4} className="mt-1.5" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Tipo do Imóvel</Label>
                <Select value={form.property_type} onValueChange={(v) => handleChange("property_type", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="terreno">Terreno</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                    <SelectItem value="cobertura">Cobertura</SelectItem>
                    <SelectItem value="chacara">Chácara</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Finalidade</Label>
                <Select value={form.listing_type} onValueChange={(v) => handleChange("listing_type", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venda">Venda</SelectItem>
                    <SelectItem value="aluguel">Aluguel</SelectItem>
                    <SelectItem value="venda_aluguel">Venda e Aluguel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponivel">Disponível</SelectItem>
                    <SelectItem value="vendido">Vendido</SelectItem>
                    <SelectItem value="alugado">Alugado</SelectItem>
                    <SelectItem value="reservado">Reservado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Details */}
          <section className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Detalhes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="price">Preço (R$)</Label>
                <Input id="price" type="number" step="0.01" min="0" value={form.price} onChange={(e) => handleChange("price", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="area">Área (m²)</Label>
                <Input id="area" type="number" step="0.01" min="0" value={form.area} onChange={(e) => handleChange("area", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="bedrooms">Quartos</Label>
                <Input id="bedrooms" type="number" min="0" value={form.bedrooms} onChange={(e) => handleChange("bedrooms", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="bathrooms">Banheiros</Label>
                <Input id="bathrooms" type="number" min="0" value={form.bathrooms} onChange={(e) => handleChange("bathrooms", e.target.value)} className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="parking">Vagas de Garagem</Label>
              <Input id="parking" type="number" min="0" value={form.parking_spots} onChange={(e) => handleChange("parking_spots", e.target.value)} className="mt-1.5 max-w-[200px]" />
            </div>
          </section>

          {/* Location */}
          <section className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Localização</h2>
            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input id="address" value={form.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="Rua, número" className="mt-1.5" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input id="neighborhood" value={form.neighborhood} onChange={(e) => handleChange("neighborhood", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" value={form.city} onChange={(e) => handleChange("city", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="state">Estado</Label>
                <Input id="state" value={form.state} onChange={(e) => handleChange("state", e.target.value)} className="mt-1.5" />
              </div>
            </div>
            <div className="max-w-[200px]">
              <Label htmlFor="zip_code">CEP</Label>
              <Input id="zip_code" value={form.zip_code} onChange={(e) => handleChange("zip_code", e.target.value)} placeholder="00000-000" className="mt-1.5" />
            </div>
          </section>

          {/* Features */}
          <section className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Características</h2>
            <div className="flex flex-wrap gap-2">
              {FEATURES_OPTIONS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFeature(f)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    form.features.includes(f)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </section>

          {/* Images */}
          <section className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Fotos</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                  <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button type="button" onClick={() => setCover(i)} className={`p-1.5 rounded-full ${img.is_cover ? "bg-yellow-500" : "bg-white/80"}`}>
                      <Star size={14} className={img.is_cover ? "text-white" : "text-foreground"} />
                    </button>
                    <button type="button" onClick={() => removeImage(i)} className="p-1.5 rounded-full bg-destructive">
                      <X size={14} className="text-destructive-foreground" />
                    </button>
                  </div>
                  {img.is_cover && (
                    <span className="absolute top-1 left-1 bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                      Capa
                    </span>
                  )}
                </div>
              ))}

              <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors text-muted-foreground hover:text-primary">
                <Upload size={24} />
                <span className="text-xs mt-1">Adicionar</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            <p className="text-xs text-muted-foreground">Clique na estrela para definir a foto de capa.</p>
          </section>

          {/* SEO */}
          <section className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">SEO (Otimização para Buscadores)</h2>
            <p className="text-xs text-muted-foreground">Opcional. Se não preenchido, será gerado automaticamente a partir do título e descrição.</p>

            <div>
              <Label htmlFor="meta_title">Título SEO</Label>
              <Input id="meta_title" value={form.meta_title} onChange={(e) => handleChange("meta_title", e.target.value)} placeholder="Ex: Casa 4 quartos em Alphaville - Venda" maxLength={60} className="mt-1.5" />
              <p className="text-xs text-muted-foreground mt-1">{form.meta_title.length}/60 caracteres</p>
            </div>

            <div>
              <Label htmlFor="meta_description">Descrição SEO</Label>
              <Textarea id="meta_description" value={form.meta_description} onChange={(e) => handleChange("meta_description", e.target.value)} placeholder="Breve descrição para resultados de busca..." maxLength={160} rows={2} className="mt-1.5" />
              <p className="text-xs text-muted-foreground mt-1">{form.meta_description.length}/160 caracteres</p>
            </div>
          </section>

          {/* AI Generation + Submit */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex items-start gap-3">
              <Sparkles className="text-primary shrink-0 mt-0.5" size={20} />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">Gerar descrição com IA</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cria automaticamente um texto profissional e otimizado para SEO com base nos dados preenchidos. Você pode editar antes de salvar.
                </p>
              </div>
            </div>
            <Button
              type="button"
              onClick={requestGenerateAI}
              disabled={generatingAI || saving}
              className="w-full gap-2"
              variant="default"
            >
              {generatingAI ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {generatingAI ? "Gerando descrição..." : "Gerar descrição com IA"}
            </Button>
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" className="flex-1" disabled={saving || generatingAI}>
              {saving ? "Salvando..." : isEditing ? "Salvar Alterações" : "Cadastrar Imóvel"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
              Cancelar
            </Button>
          </div>

          <AlertDialog open={confirmOverwrite} onOpenChange={setConfirmOverwrite}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Substituir descrição existente?</AlertDialogTitle>
                <AlertDialogDescription>
                  Já existe um texto preenchido no campo Descrição. Ao gerar com IA, esse conteúdo será substituído. Deseja continuar?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => void generateAIDescription()}>
                  Substituir e gerar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </main>
    </div>
  );
};

export default PropertyForm;
