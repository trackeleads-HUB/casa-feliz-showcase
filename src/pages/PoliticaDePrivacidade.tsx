import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { renderMarkdown } from "@/lib/markdown";

const PoliticaDePrivacidade = () => {
  const { settings } = useSiteSettings();
  const content = settings.privacy_policy_content || "";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Política de Privacidade"
        description="Política de privacidade da SO Alphaville: como coletamos, usamos e protegemos seus dados."
        canonical={`${settings.site_url || ""}/politica-de-privacidade`}
      />
      <Navbar />
      <main className="pt-32 pb-20 container mx-auto px-6 max-w-3xl">
        <article
          className="prose prose-neutral max-w-none [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:text-base [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
      </main>
      <Footer />
    </div>
  );
};

export default PoliticaDePrivacidade;
