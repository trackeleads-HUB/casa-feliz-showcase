import { Home, DollarSign, Key, ClipboardCheck } from "lucide-react";

const services = [
  { icon: Home, title: "Compra", description: "Encontre o imóvel ideal com nossa curadoria personalizada e atendimento dedicado." },
  { icon: DollarSign, title: "Venda", description: "Venda seu imóvel com a melhor avaliação de mercado e estratégias de divulgação." },
  { icon: Key, title: "Aluguel", description: "Alugue com segurança e praticidade. Cuidamos de toda a burocracia para você." },
  { icon: ClipboardCheck, title: "Avaliação", description: "Avaliação profissional do seu imóvel com base em dados reais de mercado." },
];

const ServicesSection = () => {
  return (
    <section id="servicos" className="py-16 sm:py-20 md:py-28 bg-gradient-brand-soft">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <p className="text-[11px] sm:text-[13px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-primary mb-3 sm:mb-4">O que fazemos</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground">
            Nossos <span className="italic font-light">Serviços</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="group bg-card rounded-2xl p-6 sm:p-7 md:p-8 border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors duration-500">
                <s.icon size={24} className="text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
