import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-28 bg-foreground relative overflow-hidden">
      {/* Subtle decorative element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 text-center relative z-10">
        <p className="text-[13px] uppercase tracking-[0.25em] text-primary-foreground/40 mb-6">Entre em contato</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-primary-foreground mb-6 leading-tight">
          Quer vender ou alugar
          <br />
          <span className="italic font-light">seu imóvel?</span>
        </h2>
        <p className="text-primary-foreground/50 mb-10 max-w-md mx-auto font-light text-lg">
          Nossa equipe está pronta para ajudar você a alcançar o melhor resultado.
        </p>
        <a
          href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20seus%20servi%C3%A7os."
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="lg" className="gap-2 rounded-full px-8 h-12 text-sm">
            Fale Conosco <ArrowRight size={16} />
          </Button>
        </a>
      </div>
    </section>
  );
};

export default CTASection;
