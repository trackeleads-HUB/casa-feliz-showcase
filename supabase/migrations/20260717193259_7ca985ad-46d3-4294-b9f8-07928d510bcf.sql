-- Atualiza o slogan do site para uma frase própria da marca SO Alphaville
UPDATE public.site_settings
SET value = 'Excelência em Imóveis de Alto Padrão em Alphaville',
    label = 'Slogan do Site'
WHERE key = 'site_tagline'
  AND (value ILIKE '%lovable%' OR value ILIKE '%dream%' OR value = 'Imóveis Alphaville em toda Região');

-- Caso a chave não exista, insere o valor correto
INSERT INTO public.site_settings (key, value, label)
SELECT 'site_tagline', 'Excelência em Imóveis de Alto Padrão em Alphaville', 'Slogan do Site'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings WHERE key = 'site_tagline');