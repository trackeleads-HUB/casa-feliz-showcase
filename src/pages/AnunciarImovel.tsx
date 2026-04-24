import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ArrowLeft, Send, MessageCircle } from "lucide-react";

const AnunciarImovel = () => {
  const { toast } = useToast();
  const { settings } = useSiteSettings();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    property_type: "casa",
    listing_type: "venda",
    neighborhood: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const buildWhatsAppMessage = () => {
    const lines = [
      `Olá! Quero anunciar meu imóvel.`,
      `Nome: ${form.name}`,
      `Telefone: ${form.phone}`,
      form.email && `Email: ${form.email}`,
      `Tipo: ${form.property_type}`,
      `Finalidade: ${form.listing_type === "venda" ? "Venda" : form.listing_type === "aluguel" ? "Aluguel" : "Venda/Aluguel"}`,
      form.neighborhood && `Bairro: ${form.neighborhood}`,
      form.message && `Mensagem: ${form.message}`,
    ].filter(Boolean).join("\n");
    return encodeURIComponent(lines);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast({ title: "Preencha nome e telefone", variant: "destructive" });
      return;
    }

    setLoading(true);
    // Save to database
    await supabase.from("leads").insert({
      name: form.name,
      phone: form.phone,
      email: form.email || null,
      property_type: form.property_type,
      listing_type: form.listing_type,
      neighborhood: form.neighborhood || null,
      message: form.message || null,
    });

    // Open WhatsApp with configured number
    const whatsappNumber = settings.whatsapp?.replace(/\D/g, "") || "5511999999999";
    const url = `https://wa.me/${whatsappNumber}?text=${buildWhatsAppMessage()}`;
    window.open(url, "_blank");

    toast({ title: "Dados enviados com sucesso!" });
    setForm({ name: "", phone: "", email: "", property_type: "casa", listing_type: "venda", neighborhood: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Anunciar Imóvel - SO Alphaville" description="Quer vender ou alugar seu imóvel? Preencha o formulário e entre em contato conosco." />
      <Navbar />

      <main className="pt-28 pb-16">
        <div className="container mx-auto px-6 max-w-2xl">
          <Breadcrumbs items={[{ label: "Anuncie seu Imóvel" }]} className="mb-8" />

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-[44px] font-bold mb-4">
              <span className="text-gradient-brand">Anuncie</span> seu Imóvel
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Preencha os dados abaixo e entraremos em contato pelo WhatsApp.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-5 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Seu nome completo" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                <Input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="(11) 99999-9999" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (opcional)</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="property_type">Tipo do Imóvel</Label>
                <select
                  id="property_type"
                  name="property_type"
                  value={form.property_type}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="terreno">Terreno</option>
                  <option value="comercial">Comercial</option>
                  <option value="cobertura">Cobertura</option>
                  <option value="chacara">Chácara</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="listing_type">Finalidade</Label>
                <select
                  id="listing_type"
                  name="listing_type"
                  value={form.listing_type}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="venda">Venda</option>
                  <option value="aluguel">Aluguel</option>
                  <option value="venda_aluguel">Venda e Aluguel</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro / Condomínio</Label>
              <Input id="neighborhood" name="neighborhood" value={form.neighborhood} onChange={handleChange} placeholder="Ex: Alphaville, Tamboré..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensagem (opcional)</Label>
              <Textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="Detalhes adicionais sobre o seu imóvel..." rows={4} />
            </div>

            <Button type="submit" disabled={loading} className="w-full gap-2 bg-gradient-brand hover:opacity-90 text-primary-foreground h-12 text-base">
              <MessageCircle size={18} />
              {loading ? "Enviando..." : "Enviar via WhatsApp"}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AnunciarImovel;
