# Revisão SEO — 11/11/2026

## Correções implementadas

- Sitemap e robots.txt usam `https://soalphaville.camacari.website`, não o endereço antigo.
- Canonical e og:url por página usam o domínio oficial, sem parâmetros de busca ou rastreamento; removido canonical estático duplicável.
- Título e descrição padrão destacam Camaçari, Bahia, preservando a edição pelo administrador.
- Dados estruturados da empresa deixam de indicar Barueri/SP de forma fixa.
- Imóveis usam RealEstateListing com entidade House/Apartment/Place, localização cadastrada, código, preço em BRL e datas próprias.
- Listagem inclui CollectionPage/ItemList; trilhas usam URLs oficiais e identificam a página atual.
- Cards da página inicial passam a ter links reais, acessíveis ao Google e ao teclado.
- Consultas de capas agrupadas para reduzir requisições na página inicial e na listagem.
- Foto principal recebe prioridade de carregamento; miniaturas mantêm carregamento adiado.
- Páginas ausentes recebem noindex. Orientações para robôs também excluem cadastro/edição de imóveis.
- Removido fallback para imagem genérica do Lovable, preservando a imagem já existente no HTML.
- Mantidos o favicon e a marcação FAQPage existente; removida promessa de ranqueamento por FAQ no painel.

## Verificação

- Revisão SEO automática inicial: 7 verificações passaram; 2 problemas de domínio corrigidos, aguardando nova avaliação.
- 3 testes de regras SEO passaram.
- Navegação com dados reais: página inicial → busca → imóvel; canonical único e marcação estruturada verificados.
- Página do imóvel em computador e celular sem rolagem horizontal.
- Sitemap estático e função publicada retornam as mesmas 27 URLs: 5 páginas e 22 imóveis disponíveis.
- Compilação do preview sem erros.

## Limites e próximos passos

- **Publicar novamente** para levar os arquivos corrigidos à URL pública. Configurações salvas e a função sitemap já foram atualizadas.
- Search Console não está conectado: indexação, consultas, cliques, posições e histórico de rastreamento não foram verificados. Uma revisão técnica não garante posições no Google.
- A revisão automática confirmou pré-renderização pela hospedagem para mecanismos de busca; não foi necessária migração da aplicação.
- O imóvel real usado no teste está cadastrado com cidade Camaçari e estado SP. A marcação respeita o cadastro; confirmar e corrigir o estado no imóvel para não transmitir localização contraditória. Nenhum endereço de imóvel foi alterado automaticamente.
- O sitemap estático é atualizado antes da publicação; novos imóveis e exclusões precisam de nova publicação para refletir em `/sitemap.xml`. A função dinâmica acompanha os dados, mas não substituiu esse mecanismo.
- Desempenho real de campo/Core Web Vitals e autoridade por links externos não foram medidos nesta revisão.