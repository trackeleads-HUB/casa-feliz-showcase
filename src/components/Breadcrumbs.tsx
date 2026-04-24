import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronRight, Home } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export type Crumb = {
  label: string;
  href?: string; // omit on the current (last) crumb
};

interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
}

/**
 * Breadcrumbs navegáveis com marcação Schema.org BreadcrumbList (JSON-LD),
 * ajudando o Google a entender a hierarquia das páginas e exibir trilhas
 * nos resultados de busca.
 */
const Breadcrumbs = ({ items, className = "" }: BreadcrumbsProps) => {
  const { settings } = useSiteSettings();
  const origin =
    (typeof window !== "undefined" ? window.location.origin : settings.site_url) || "";

  const fullItems: Crumb[] = [{ label: "Início", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: fullItems.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${origin}${c.href}` } : {}),
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <nav
        aria-label="Trilha de navegação"
        className={`flex items-center flex-wrap gap-1 text-sm text-muted-foreground ${className}`}
      >
        <ol
          className="flex items-center flex-wrap gap-1"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {fullItems.map((c, i) => {
            const isLast = i === fullItems.length - 1;
            return (
              <li
                key={`${c.label}-${i}`}
                className="flex items-center gap-1"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {i > 0 && (
                  <ChevronRight size={14} className="text-muted-foreground/60 shrink-0" aria-hidden />
                )}
                {isLast || !c.href ? (
                  <span
                    className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none"
                    aria-current="page"
                    itemProp="name"
                  >
                    {i === 0 ? <Home size={14} className="inline -mt-0.5 mr-1" aria-hidden /> : null}
                    {c.label}
                  </span>
                ) : (
                  <Link
                    to={c.href}
                    className="hover:text-foreground transition-colors flex items-center gap-1"
                    itemProp="item"
                  >
                    {i === 0 ? <Home size={14} aria-hidden /> : null}
                    <span itemProp="name">{c.label}</span>
                  </Link>
                )}
                <meta itemProp="position" content={String(i + 1)} />
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
