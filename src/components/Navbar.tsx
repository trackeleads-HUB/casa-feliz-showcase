import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo-so-alphaville.png";

const isRouterLink = (href: string) => !href.includes("#");

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: "Imóveis", href: "/imoveis" },
    { label: "Anuncie seu Imóvel", href: "/anunciar" },
    { label: "Sobre", href: "/#sobre" },
    { label: "Serviços", href: "/#servicos" },
    { label: "Depoimentos", href: "/#depoimentos" },
  ];

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setIsOpen(false);
    const id = href.split("#")[1];
    if (!id) return;

    if (location.pathname === "/") {
      scrollToId(id);
    } else {
      navigate(`/#${id}`);
      // Aguarda a home renderizar antes de rolar
      setTimeout(() => scrollToId(id), 80);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center relative">
        <a href="/#hero" onClick={(e) => handleAnchorClick(e, "/#hero")} className="flex items-center shrink-0 z-10" aria-label="SO Alphaville - Início">
          <img src={logo} alt="SO Alphaville" className="h-12 sm:h-14 md:h-16 w-auto block object-contain" />
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {links.map((link) =>
            isRouterLink(link.href) ? (
              <Link
                key={link.href}
                to={link.href}
                className="text-[13px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="text-[13px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300 cursor-pointer"
              >
                {link.label}
              </a>
            )
          )}
        </div>


        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground inline-flex items-center justify-center h-10 w-10 -mr-2 shrink-0 ml-auto"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 pb-6 pt-2 space-y-4">
          {links.map((link) =>
            isRouterLink(link.href) ? (
              <Link
                key={link.href}
                to={link.href}
                className="block text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="block text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            )
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
