import aboutTeam from "@/assets/about-team.jpg";

const stats = [
  { value: "500+", label: "Imóveis disponíveis" },
  { value: "10+", label: "Anos no mercado" },
  { value: "1.200+", label: "Clientes satisfeitos" },
  { value: "50+", label: "Corretores especializados" },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img src={aboutTeam} alt="Equipe SO Alphaville" className="w-full h-80 object-cover" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary tracking-widest uppercase mb-3">Sobre nós</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Realizando sonhos há mais de uma década
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              A SO Alphaville nasceu com o propósito de transformar a experiência de comprar, vender e alugar imóveis.
              Com uma equipe apaixonada e tecnologia de ponta, conectamos pessoas ao lugar perfeito para
              chamar de lar.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-bold text-primary">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
