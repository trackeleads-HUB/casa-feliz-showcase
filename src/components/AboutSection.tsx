import aboutTeam from "@/assets/about-team.jpg";

const stats = [
  { value: "500+", label: "Imóveis" },
  { value: "10+", label: "Anos" },
  { value: "1.200+", label: "Clientes" },
  { value: "50+", label: "Corretores" },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-28 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-foreground/5">
              <img src={aboutTeam} alt="Equipe SO Alphaville" className="w-full h-[28rem] object-cover" />
            </div>
            {/* Floating stats card */}
            <div className="absolute -bottom-8 -right-4 lg:-right-8 bg-card rounded-2xl shadow-xl p-6 grid grid-cols-2 gap-4 border border-border/50">
              {stats.map((s) => (
                <div key={s.label} className="text-center px-4">
                  <p className="text-2xl font-bold text-primary">{s.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:pl-8">
            <p className="text-[13px] uppercase tracking-[0.25em] text-primary mb-4">Sobre nós</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-8 leading-tight">
              Realizando sonhos há mais de uma <span className="italic font-light">década</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 text-lg font-light">
              A SO Alphaville nasceu com o propósito de transformar a experiência de comprar, vender e alugar imóveis.
            </p>
            <p className="text-muted-foreground leading-relaxed font-light">
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
