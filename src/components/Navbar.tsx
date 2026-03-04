import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Settings, ArrowRight } from "lucide-react";
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <a href="/#hero" className="text-2xl font-bold tracking-tight">
          <span className="text-gradient-brand">SO</span> <span className="text-foreground">Alphaville</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          {user ? (
            <Link to="/dashboard">
              <Button size="sm" variant="outline" className="gap-2 rounded-full px-5">
                <Settings size={14} /> Admin
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="gap-2 rounded-full px-5">
                Entrar <ArrowRight size={14} />
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 pb-6 pt-2 space-y-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {user ? (
            <Link to="/dashboard">
              <Button size="sm" variant="outline" className="w-full gap-2 rounded-full">
                <Settings size={14} /> Admin
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="w-full gap-2 rounded-full">
                Entrar <ArrowRight size={14} />
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
