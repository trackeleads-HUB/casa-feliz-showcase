import aboutTeam from "@/assets/about-team.jpg";

const stats = [
  { value: "500+", label: "Imóveis" },
  { value: "10+", label: "Anos" },
  { value: "1.200+", label: "Clientes" },
  { value: "50+", label: "Corretores" },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-16 md:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative pb-10 lg:pb-0">
            <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-foreground/5">
              <img src={aboutTeam} alt="Equipe SO Alphaville" className="w-full h-56 sm:h-72 lg:h-[28rem] object-cover" />
            </div>
            {/* Floating stats card */}
            <div className="absolute -bottom-6 left-2 right-2 sm:left-4 sm:right-4 lg:left-auto lg:-right-8 bg-card rounded-2xl shadow-xl p-3 sm:p-6 grid grid-cols-4 sm:grid-cols-2 gap-2 sm:gap-4 border border-border/50">
              {stats.map((s) => (
                <div key={s.label} className="text-center px-1 sm:px-4">
                  <p className="text-base sm:text-2xl font-bold text-gradient-brand">{s.value}</p>
                  <p className="text-[9px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:pl-8">
            <p className="text-[13px] uppercase tracking-[0.25em] text-primary mb-4">Sobre nós</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-6 md:mb-8 leading-tight">
              Realizando sonhos há mais de uma <span className="italic font-light">década</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 text-base sm:text-lg font-light">
              A SO Alphaville nasceu com o propósito de transformar a experiência de comprar, vender e alugar imóveis.
            </p>
            <p className="text-muted-foreground leading-relaxed font-light text-sm sm:text-base">
              Com uma equipe apaixonada e tecnologia de ponta, conectamos pessoas ao lugar perfeito para
              chamar de lar. Cada imóvel é uma nova história, e nós estamos aqui para escrevê-la com você.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
