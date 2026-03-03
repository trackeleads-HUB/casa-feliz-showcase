import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground pt-20 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <p className="text-3xl font-semibold mb-4">
              SO <span className="text-primary-foreground/50">Alphaville</span>
            </p>
            <p className="text-sm text-primary-foreground/40 leading-relaxed font-light">
              Transformando sonhos em endereços desde 2014. Seu imóvel em Alphaville começa aqui.
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
              <li><a href="tel:+5511999999999" className="flex items-center gap-2.5 hover:text-primary-foreground transition-colors duration-300"><Phone size={14} /> (11) 99999-9999</a></li>
              <li><a href="mailto:contato@soalphaville.com.br" className="flex items-center gap-2.5 hover:text-primary-foreground transition-colors duration-300"><Mail size={14} /> contato@soalphaville.com.br</a></li>
              <li className="flex items-start gap-2.5"><MapPin size={14} className="mt-0.5 shrink-0" /> Av. Paulista, 1000<br/>São Paulo, SP</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-[13px] uppercase tracking-[0.2em] text-primary-foreground/60 mb-6">Redes Sociais</h4>
            <div className="flex gap-3">
              {[Instagram, Facebook, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-primary-foreground/10 flex items-center justify-center hover:border-primary-foreground/30 hover:bg-primary-foreground/5 transition-all duration-300">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 text-center text-xs text-primary-foreground/25 tracking-wider">
          © 2024 SO Alphaville. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
