import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Quote } from "lucide-react";

const testimonials = [
  { name: "Maria Silva", initials: "MS", text: "A SO Alphaville tornou o processo de compra do meu primeiro apartamento muito mais simples. A equipe foi atenciosa em cada detalhe!" },
  { name: "João Santos", initials: "JS", text: "Vendemos nossa casa em tempo recorde e pelo valor justo. Profissionais excepcionais que realmente entendem o mercado." },
  { name: "Ana Oliveira", initials: "AO", text: "Alugar com a SO Alphaville foi uma experiência incrível. Sem burocracia, tudo digital e com suporte completo. Recomendo!" },
];

const TestimonialsSection = () => {
  return (
    <section id="depoimentos" className="py-28 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-[13px] uppercase tracking-[0.25em] text-primary mb-4">Depoimentos</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground">
            O que dizem nossos <span className="italic font-light">clientes</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Carousel opts={{ loop: true }}>
            <CarouselContent>
              {testimonials.map((t) => (
                <CarouselItem key={t.name}>
                  <div className="text-center px-4 md:px-12">
                    <Quote size={40} className="text-primary/15 mx-auto mb-8" />
                    <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-10 font-light italic">
                      "{t.text}"
                    </p>
                    <Avatar className="mx-auto mb-4 w-14 h-14">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                        {t.initials}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-foreground text-sm uppercase tracking-wider">{t.name}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="border-border/50" />
            <CarouselNext className="border-border/50" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
