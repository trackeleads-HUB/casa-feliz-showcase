
-- Create site_settings table (key-value store for general site configuration)
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  label TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (needed for frontend)
CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

-- Only admins can modify settings
CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert site settings"
  ON public.site_settings FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site settings"
  ON public.site_settings FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Seed default settings
INSERT INTO public.site_settings (key, value, label) VALUES
  ('site_name', 'SO Alphaville', 'Nome do Site'),
  ('site_tagline', 'Imóveis de Alto Padrão em Alphaville', 'Slogan'),
  ('whatsapp', '5511999999999', 'WhatsApp (com DDI+DDD)'),
  ('phone', '(11) 99999-9999', 'Telefone para exibição'),
  ('email', 'contato@soalphaville.com.br', 'E-mail de contato'),
  ('address', 'Alphaville, Barueri - SP', 'Endereço'),
  ('instagram', '', 'Instagram (URL completa)'),
  ('facebook', '', 'Facebook (URL completa)'),
  ('linkedin', '', 'LinkedIn (URL completa)'),
  ('hero_title', 'Encontre o Imóvel dos Seus Sonhos', 'Título do Hero'),
  ('hero_subtitle', 'Imóveis exclusivos em Alphaville, com a sofisticação e segurança que sua família merece.', 'Subtítulo do Hero'),
  ('cta_title', 'Encontre o Imóvel Perfeito para Você', 'Título do CTA'),
  ('cta_text', 'Nossa equipe está pronta para ajudá-lo a encontrar o imóvel ideal.', 'Texto do CTA');
