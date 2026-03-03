import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const CTASection = () => {
  const { settings } = useSiteSettings();

  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Olá! Gostaria de mais informações sobre seus serviços.")}`;

  return (
    <section className="py-28 bg-foreground relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 text-center relative z-10">
        <p className="text-[13px] uppercase tracking-[0.25em] text-primary-foreground/40 mb-6">Entre em contato</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-primary-foreground mb-6 leading-tight">
          {settings.cta_title?.split(" ").slice(0, 4).join(" ")}
          <br />
          <span className="italic font-light">{settings.cta_title?.split(" ").slice(4).join(" ")}</span>
        </h2>
        <p className="text-primary-foreground/50 mb-10 max-w-md mx-auto font-light text-lg">
          {settings.cta_text}
        </p>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <Button size="lg" className="gap-2 rounded-full px-8 h-12 text-sm">
            Fale Conosco <ArrowRight size={16} />
          </Button>
        </a>
      </div>
    </section>
  );
};

export default CTASection;
