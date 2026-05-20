import aboutTeam from "@/assets/about-cleber.jpg";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const AboutSection = () => {
  const { settings } = useSiteSettings();
  const stats = [
    { value: settings.about_stat_1_value, label: settings.about_stat_1_label },
    { value: settings.about_stat_2_value, label: settings.about_stat_2_label },
    { value: settings.about_stat_3_value, label: settings.about_stat_3_label },
    { value: settings.about_stat_4_value, label: settings.about_stat_4_label },
  ].filter((s) => s.value);

  const imgSrc = settings.about_image || aboutTeam;

  return (
    <section id="sobre" className="py-16 md:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative pb-10 lg:pb-0">
            <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-foreground/5">
              <img
                src={imgSrc}
                alt={settings.about_title || "Equipe"}
                className="w-full aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5] object-cover object-top scale-x-[-1]"
              />
            </div>
            {stats.length > 0 && (
              <div className="absolute -bottom-6 left-2 right-2 sm:left-4 sm:right-4 lg:left-auto lg:-right-8 bg-card rounded-2xl shadow-xl p-3 sm:p-6 grid gap-2 sm:gap-4 border border-border/50"
                style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
                {stats.map((s) => (
                  <div key={s.label} className="text-center px-1 sm:px-4">
                    <p className="text-base sm:text-2xl font-bold text-gradient-brand">{s.value}</p>
                    <p className="text-[9px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="lg:pl-8">
            <p className="text-[13px] uppercase tracking-[0.25em] text-primary mb-4">{settings.about_label}</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-6 md:mb-8 leading-tight">
              {settings.about_title}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 text-base sm:text-lg font-light whitespace-pre-line">
              {settings.about_text_1}
            </p>
            {settings.about_text_2 && (
              <p className="text-muted-foreground leading-relaxed font-light text-sm sm:text-base whitespace-pre-line">
                {settings.about_text_2}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
