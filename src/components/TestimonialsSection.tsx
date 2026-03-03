import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Quote } from "lucide-react";

const testimonials = [
  { name: "Maria Silva", initials: "MS", text: "A NovaLar tornou o processo de compra do meu primeiro apartamento muito mais simples. A equipe foi atenciosa em cada detalhe!" },
  { name: "João Santos", initials: "JS", text: "Vendemos nossa casa em tempo recorde e pelo valor justo. Profissionais excepcionais que realmente entendem o mercado." },
  { name: "Ana Oliveira", initials: "AO", text: "Alugar com a NovaLar foi uma experiência incrível. Sem burocracia, tudo digital e com suporte completo. Recomendo!" },
];

const TestimonialsSection = () => {
  return (
    <section id="depoimentos" className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary tracking-widest uppercase mb-3">Depoimentos</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            O que dizem nossos clientes
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <Carousel opts={{ loop: true }}>
            <CarouselContent>
              {testimonials.map((t) => (
                <CarouselItem key={t.name}>
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-10 text-center">
                      <Quote size={32} className="text-primary/20 mx-auto mb-6" />
                      <p className="text-lg text-muted-foreground leading-relaxed mb-8 italic">
                        "{t.text}"
                      </p>
                      <Avatar className="mx-auto mb-3 w-12 h-12">
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                          {t.initials}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-semibold text-foreground">{t.name}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
