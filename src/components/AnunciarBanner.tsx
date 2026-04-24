import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight } from "lucide-react";

const AnunciarBanner = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-brand opacity-95" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
            <Home size={16} className="text-white" />
            <span className="text-white/90 text-sm font-medium tracking-wide uppercase">Para Proprietários</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-white mb-5">
            Quer Vender ou Alugar<br />seu Imóvel?
          </h2>
          
          <p className="text-base md:text-lg text-white/85 mb-8 max-w-xl mx-auto leading-relaxed">
            Cadastre seu imóvel e nossa equipe entrará em contato para ajudá-lo a fechar o melhor negócio.
          </p>
          
          <Link to="/anunciar">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-10 h-14 text-base font-semibold gap-2 shadow-lg">
              Anunciar meu Imóvel <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AnunciarBanner;
