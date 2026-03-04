import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Imoveis from "./pages/Imoveis";
import Dashboard from "./pages/Dashboard";
import PropertyForm from "./pages/PropertyForm";
import PropertyDetails from "./pages/PropertyDetails";
import AdminSettings from "./pages/AdminSettings";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminLeads from "./pages/AdminLeads";
import AnunciarImovel from "./pages/AnunciarImovel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/imoveis" element={<Imoveis />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/imoveis/:id" element={<PropertyDetails />} />
              <Route path="/imoveis/novo" element={<PropertyForm />} />
            <Route path="/imoveis/:id/editar" element={<PropertyForm />} />
            <Route path="/admin/configuracoes" element={<AdminSettings />} />
            <Route path="/admin/depoimentos" element={<AdminTestimonials />} />
            <Route path="/admin/leads" element={<AdminLeads />} />
            <Route path="/anunciar" element={<AnunciarImovel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
