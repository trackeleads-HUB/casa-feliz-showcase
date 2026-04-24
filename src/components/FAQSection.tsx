import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import { ChevronDown } from "lucide-react";

type FAQ = { id: string; question: string; answer: string };

const FAQSection = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("faqs")
      .select("id, question, answer")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => setFaqs(data || []));
  }, []);

  if (faqs.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section id="faq" className="py-16 sm:py-20 md:py-24 bg-background">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="text-center mb-10 sm:mb-12 md:mb-14">
          <p className="text-[11px] sm:text-[13px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-primary mb-3 sm:mb-4">Dúvidas Frequentes</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground">
            Perguntas <span className="italic font-light">Frequentes</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f) => {
            const isOpen = openId === f.id;
            return (
              <div
                key={f.id}
                className="bg-card border border-border rounded-xl overflow-hidden transition-shadow hover:shadow-md"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : f.id)}
                  className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-left gap-3"
                  aria-expanded={isOpen}
                >
                  <h3 className="text-sm sm:text-base md:text-lg font-medium text-foreground">{f.question}</h3>
                  <ChevronDown
                    size={20}
                    className={`text-muted-foreground transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-5 text-sm sm:text-base text-muted-foreground leading-relaxed">{f.answer}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
