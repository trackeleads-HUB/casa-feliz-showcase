import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const CTASection = () => {
  const { settings } = useSiteSettings();

  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Olá! Gostaria de mais informações sobre seus serviços.")}`;

  return (
    <section className="py-16 sm:py-20 md:py-28 bg-gradient-brand relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
        <p className="text-[11px] sm:text-[13px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-primary-foreground/40 mb-4 sm:mb-6">Entre em contato</p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-semibold text-primary-foreground mb-4 sm:mb-6 leading-tight">
          {settings.cta_title?.split(" ").slice(0, 4).join(" ")}
          <br />
          <span className="italic font-light">{settings.cta_title?.split(" ").slice(4).join(" ")}</span>
        </h2>
        <p className="text-primary-foreground/60 mb-8 sm:mb-10 max-w-md mx-auto font-light text-base sm:text-lg">
          {settings.cta_text}
        </p>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <Button size="lg" className="gap-2 rounded-full px-8">
            Fale Conosco <ArrowRight size={16} />
          </Button>
        </a>
      </div>
    </section>
  );
};

export default CTASection;
