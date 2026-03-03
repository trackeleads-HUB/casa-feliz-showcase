import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const links = [
    { label: "Início", href: "/#hero" },
    { label: "Imóveis", href: "/imoveis" },
    { label: "Sobre", href: "/#sobre" },
    { label: "Serviços", href: "/#servicos" },
    { label: "Depoimentos", href: "/#depoimentos" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#hero" className="font-serif text-2xl font-bold text-foreground tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          SO <span className="text-primary">Alphaville</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          {user ? (
            <a href="/dashboard">
              <Button size="sm" variant="outline" className="gap-2">
                <User size={14} /> Meus Imóveis
              </Button>
            </a>
          ) : (
            <a href="/auth">
              <Button size="sm" className="gap-2">
                <User size={14} /> Entrar
              </Button>
            </a>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border px-6 pb-4 space-y-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {user ? (
            <a href="/dashboard">
              <Button size="sm" variant="outline" className="w-full gap-2">
                <User size={14} /> Meus Imóveis
              </Button>
            </a>
          ) : (
            <a href="/auth">
              <Button size="sm" className="w-full gap-2">
                <User size={14} /> Entrar
              </Button>
            </a>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
