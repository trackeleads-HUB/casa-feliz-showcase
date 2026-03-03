import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Quer vender ou alugar seu imóvel?
        </h2>
        <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
          Entre em contato com nossa equipe e descubra como podemos ajudar você a alcançar o melhor resultado.
        </p>
        <a href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20seus%20servi%C3%A7os." target="_blank" rel="noopener noreferrer">
          <Button variant="secondary" size="lg" className="gap-2">
            <Phone size={18} />
            Fale Conosco
          </Button>
        </a>
      </div>
    </section>
  );
};

export default CTASection;
