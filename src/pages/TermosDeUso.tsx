import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { renderMarkdown } from "@/lib/markdown";

const TermosDeUso = () => {
  const { settings } = useSiteSettings();
  const content = settings.terms_of_use_content || "";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Termos de Uso"
        description="Termos de uso do site SO Alphaville."
        canonical={`${settings.site_url || ""}/termos-de-uso`}
      />
      <Navbar />
      <main className="pt-32 pb-20 container mx-auto px-6 max-w-3xl">
        <Breadcrumbs items={[{ label: "Termos de Uso" }]} className="mb-8" />
        <article
          className="prose prose-neutral max-w-none [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:text-base [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
      </main>
      <Footer />
    </div>
  );
};

export default TermosDeUso;
