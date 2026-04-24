
-- Insere novas configurações de SEO em site_settings
INSERT INTO public.site_settings (key, value, label) VALUES
  ('default_meta_title', 'SO Alphaville - Imóveis de Alto Padrão em Alphaville', 'Título Padrão (SEO)'),
  ('default_meta_description', 'Encontre casas, apartamentos e terrenos de alto padrão em Alphaville. Compra, venda e aluguel com a SO Alphaville.', 'Descrição Padrão (SEO)'),
  ('default_og_image', '', 'Imagem padrão de compartilhamento (URL)'),
  ('site_url', 'https://soalphaville.lovable.app', 'URL Canônica do Site'),
  ('gtm_id', '', 'Google Tag Manager ID (GTM-XXXXXX)'),
  ('ga_id', '', 'Google Analytics ID (G-XXXXXXXXXX)'),
  ('google_ads_id', '', 'Google Ads Conversion ID (AW-XXXXXX)'),
  ('facebook_pixel_id', '', 'Facebook Pixel ID'),
  ('google_site_verification', '', 'Google Search Console Verification'),
  ('bing_site_verification', '', 'Bing Site Verification'),
  ('facebook_domain_verification', '', 'Facebook Domain Verification'),
  ('cnpj', '', 'CNPJ da Empresa'),
  ('creci', '', 'CRECI da Imobiliária'),
  ('privacy_policy_content', E'# Política de Privacidade\n\nEsta política descreve como coletamos, usamos e protegemos suas informações pessoais.\n\n## Coleta de Dados\n\nColetamos dados que você nos fornece ao preencher formulários de contato.\n\n## Uso dos Dados\n\nUtilizamos seus dados exclusivamente para responder a solicitações sobre imóveis.\n\n## Seus Direitos\n\nVocê pode solicitar a exclusão dos seus dados a qualquer momento.', 'Conteúdo da Política de Privacidade (Markdown)'),
  ('terms_of_use_content', E'# Termos de Uso\n\nAo utilizar este site, você concorda com os termos abaixo.\n\n## Uso do Site\n\nO conteúdo deste site é meramente informativo. Os imóveis estão sujeitos a disponibilidade.\n\n## Propriedade Intelectual\n\nTodo o conteúdo é de propriedade da SO Alphaville.\n\n## Limitação de Responsabilidade\n\nNão nos responsabilizamos por informações desatualizadas dos imóveis.', 'Conteúdo dos Termos de Uso (Markdown)')
ON CONFLICT (key) DO NOTHING;

-- Cria tabela de FAQs
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active faqs"
  ON public.faqs FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert faqs"
  ON public.faqs FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update faqs"
  ON public.faqs FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete faqs"
  ON public.faqs FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- FAQs iniciais
INSERT INTO public.faqs (question, answer, sort_order) VALUES
  ('Como funciona a compra de um imóvel em Alphaville?', 'Após escolher o imóvel, fazemos uma proposta ao vendedor e cuidamos de toda a documentação até a escritura.', 1),
  ('A SO Alphaville cobra alguma taxa para mostrar imóveis?', 'Não. Visitas e atendimento são totalmente gratuitos. A comissão é cobrada apenas do vendedor após a venda concluída.', 2),
  ('Vocês trabalham com financiamento?', 'Sim, temos parceria com os principais bancos para facilitar o financiamento do seu imóvel.', 3),
  ('Quais bairros vocês atendem?', 'Atendemos toda a região de Alphaville, Tamboré, Aldeia da Serra e demais condomínios de alto padrão de Barueri e Santana de Parnaíba.', 4)
ON CONFLICT DO NOTHING;
