import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Quote } from "lucide-react";

type Testimonial = {
  id: string;
  name: string;
  initials: string;
  text: string;
};

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("id, name, initials, text")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data?.length) setTestimonials(data);
      });
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section id="depoimentos" className="py-16 sm:py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <p className="text-[11px] sm:text-[13px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-primary mb-3 sm:mb-4">Depoimentos</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
            O que dizem nossos <span className="italic font-light">clientes</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Carousel opts={{ loop: true }}>
            <CarouselContent>
              {testimonials.map((t) => (
                <CarouselItem key={t.id}>
                  <div className="text-center px-2 sm:px-4 md:px-12">
                    <Quote size={32} className="sm:w-10 sm:h-10 text-primary/15 mx-auto mb-5 sm:mb-8" />
                    <p className="text-base sm:text-lg md:text-2xl text-foreground leading-relaxed mb-6 sm:mb-10 font-light italic">
                      "{t.text}"
                    </p>
                    <Avatar className="mx-auto mb-3 sm:mb-4 w-12 h-12 sm:w-14 sm:h-14">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                        {t.initials}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-foreground text-xs sm:text-sm uppercase tracking-wider">{t.name}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="border-border/50 hidden sm:flex" />
            <CarouselNext className="border-border/50 hidden sm:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
