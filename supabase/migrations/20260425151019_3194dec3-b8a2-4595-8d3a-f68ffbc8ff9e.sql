-- Tabela de configurações da IA (somente admins acessam)
CREATE TABLE public.ai_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  openai_api_key TEXT,
  model TEXT NOT NULL DEFAULT 'gpt-4.1-mini',
  instructions TEXT NOT NULL DEFAULT '',
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem ler/escrever
CREATE POLICY "Admins can view ai_settings"
ON public.ai_settings FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert ai_settings"
ON public.ai_settings FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update ai_settings"
ON public.ai_settings FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete ai_settings"
ON public.ai_settings FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger de updated_at
CREATE TRIGGER update_ai_settings_updated_at
BEFORE UPDATE ON public.ai_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir linha singleton com instruções padrão
INSERT INTO public.ai_settings (model, instructions) VALUES (
  'gpt-4.1-mini',
  'Você é um especialista em marketing imobiliário, copywriting e SEO para imóveis residenciais de alto padrão dentro do Terras Alphaville Camaçari.

Sua tarefa é gerar descrições profissionais, persuasivas, naturais e otimizadas para mecanismos de busca.

Diretrizes:
- Escreva em português do Brasil.
- Use linguagem sofisticada, clara e comercial.
- Valorize estilo de vida, segurança, conforto, lazer, localização e exclusividade.
- Não exagere com promessas falsas.
- Não invente informações que não foram fornecidas.
- Use técnicas avançadas de SEO sem deixar o texto artificial.
- Inclua naturalmente termos como: casas no Terras Alphaville Camaçari, imóvel no Terras Alphaville, casa à venda no Alphaville Camaçari, condomínio fechado em Camaçari, segurança, lazer, conforto e qualidade de vida, quando fizer sentido.
- O texto deve ser atrativo para compradores de imóveis de médio e alto padrão.
- Evite repetir muitas vezes a mesma palavra-chave.
- Use parágrafos curtos.
- Crie um texto pronto para ser publicado no site.
- Sempre destaque os diferenciais mais fortes do imóvel.'
);