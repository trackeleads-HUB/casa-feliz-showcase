import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <p className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              SO <span className="opacity-70">Alphaville</span>
            </p>
            <p className="text-sm text-primary-foreground/60 leading-relaxed">
              Transformando sonhos em endereços desde 2014. Seu imóvel em Alphaville começa aqui.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Navegação</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><a href="#hero" className="hover:text-primary-foreground transition-colors">Início</a></li>
              <li><a href="#imoveis" className="hover:text-primary-foreground transition-colors">Imóveis</a></li>
              <li><a href="#sobre" className="hover:text-primary-foreground transition-colors">Sobre</a></li>
              <li><a href="#servicos" className="hover:text-primary-foreground transition-colors">Serviços</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Contato</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              <li className="flex items-center gap-2"><Phone size={14} /> (11) 99999-9999</li>
              <li className="flex items-center gap-2"><Mail size={14} /> contato@soalphaville.com.br</li>
              <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5" /> Av. Paulista, 1000 - São Paulo, SP</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Redes Sociais</h4>
            <div className="flex gap-3">
              {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm text-primary-foreground/40">
          © 2024 SO Alphaville. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
