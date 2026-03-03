import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Footer = () => {
  const { settings } = useSiteSettings();

  const socialLinks = [
    { Icon: Instagram, url: settings.instagram },
    { Icon: Facebook, url: settings.facebook },
    { Icon: Linkedin, url: settings.linkedin },
  ].filter((s) => s.url);

  return (
    <footer className="bg-foreground text-primary-foreground pt-20 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <p className="text-3xl font-semibold mb-4">
              {settings.site_name?.split(" ").map((w, i) =>
                i === 0 ? <span key={i}>{w} </span> : <span key={i} className="text-primary-foreground/50">{w}</span>
              )}
            </p>
            <p className="text-sm text-primary-foreground/40 leading-relaxed font-light">
              {settings.site_tagline}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[13px] uppercase tracking-[0.2em] text-primary-foreground/60 mb-6">Navegação</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/40">
              <li><a href="/#hero" className="hover:text-primary-foreground transition-colors duration-300">Início</a></li>
              <li><a href="/imoveis" className="hover:text-primary-foreground transition-colors duration-300">Imóveis</a></li>
              <li><a href="/#sobre" className="hover:text-primary-foreground transition-colors duration-300">Sobre</a></li>
              <li><a href="/#servicos" className="hover:text-primary-foreground transition-colors duration-300">Serviços</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[13px] uppercase tracking-[0.2em] text-primary-foreground/60 mb-6">Contato</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/40">
              <li>
                <a href={`tel:+${settings.whatsapp}`} className="flex items-center gap-2.5 hover:text-primary-foreground transition-colors duration-300">
                  <Phone size={14} /> {settings.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2.5 hover:text-primary-foreground transition-colors duration-300">
                  <Mail size={14} /> {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 shrink-0" /> {settings.address}
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-[13px] uppercase tracking-[0.2em] text-primary-foreground/60 mb-6">Redes Sociais</h4>
            <div className="flex gap-3">
              {socialLinks.length > 0 ? socialLinks.map(({ Icon, url }, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-primary-foreground/10 flex items-center justify-center hover:border-primary-foreground/30 hover:bg-primary-foreground/5 transition-all duration-300">
                  <Icon size={16} />
                </a>
              )) : (
                [Instagram, Facebook, Linkedin].map((Icon, i) => (
                  <span key={i} className="w-10 h-10 rounded-full border border-primary-foreground/10 flex items-center justify-center opacity-30">
                    <Icon size={16} />
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 text-center text-xs text-primary-foreground/25 tracking-wider">
          © {new Date().getFullYear()} {settings.site_name}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
