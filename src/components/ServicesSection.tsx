import { Card, CardContent } from "@/components/ui/card";
import { Home, DollarSign, Key, ClipboardCheck } from "lucide-react";

const services = [
  { icon: Home, title: "Compra", description: "Encontre o imóvel ideal com nossa curadoria personalizada e atendimento dedicado." },
  { icon: DollarSign, title: "Venda", description: "Venda seu imóvel com a melhor avaliação de mercado e estratégias de divulgação." },
  { icon: Key, title: "Aluguel", description: "Alugue com segurança e praticidade. Cuidamos de toda a burocracia para você." },
  { icon: ClipboardCheck, title: "Avaliação", description: "Avaliação profissional do seu imóvel com base em dados reais de mercado." },
];

const ServicesSection = () => {
  return (
    <section id="servicos" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary tracking-widest uppercase mb-3">O que fazemos</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            Nossos Serviços
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s) => (
            <Card key={s.title} className="text-center border-0 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-5">
                  <s.icon size={28} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
