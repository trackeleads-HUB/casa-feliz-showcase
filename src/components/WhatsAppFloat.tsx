import { useSiteSettings } from "@/hooks/useSiteSettings";
import { MessageCircle } from "lucide-react";

const WhatsAppFloat = () => {
  const { settings } = useSiteSettings();
  const number = (settings.whatsapp || "").replace(/\D/g, "");
  if (!number) return null;

  const message = settings.whatsapp_default_message || "Olá! Gostaria de mais informações.";
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco no WhatsApp"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[60] flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform duration-300"
    >
      <MessageCircle size={28} fill="currentColor" strokeWidth={0} />
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
    </a>
  );
};

export default WhatsAppFloat;
