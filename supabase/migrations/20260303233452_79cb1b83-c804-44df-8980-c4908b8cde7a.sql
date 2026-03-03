
-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  initials TEXT NOT NULL DEFAULT '',
  text TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can read active testimonials
CREATE POLICY "Anyone can read active testimonials"
ON public.testimonials
FOR SELECT
USING (true);

-- Admins can insert testimonials
CREATE POLICY "Admins can insert testimonials"
ON public.testimonials
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can update testimonials
CREATE POLICY "Admins can update testimonials"
ON public.testimonials
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Admins can delete testimonials
CREATE POLICY "Admins can delete testimonials"
ON public.testimonials
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with existing testimonials
INSERT INTO public.testimonials (name, initials, text, sort_order) VALUES
('Maria Silva', 'MS', 'A SO Alphaville tornou o processo de compra do meu primeiro apartamento muito mais simples. A equipe foi atenciosa em cada detalhe!', 1),
('João Santos', 'JS', 'Vendemos nossa casa em tempo recorde e pelo valor justo. Profissionais excepcionais que realmente entendem o mercado.', 2),
('Ana Oliveira', 'AO', 'Alugar com a SO Alphaville foi uma experiência incrível. Sem burocracia, tudo digital e com suporte completo. Recomendo!', 3);
