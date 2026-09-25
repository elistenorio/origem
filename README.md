# Origem

## Descrição
**Origem** é uma aplicação web full stack que conecta artesãos e produtores criativos a compradores. A plataforma inclui vitrine do comprador (busca, filtros, perfil do artesão, carrinho, avaliações), painel do artesão (catálogo, estoque, pedidos), painel administrativo e indicadores de venda.

Projeto Integrador 2026.2 (CESAR School), disciplina de Desenvolvimento Web. Branch principal: `main`.

**Fase atual — Avaliação 1:** frontend responsivo com dados de exemplo, preparado para consumir uma Fake API (em integração). O backend fica para a Avaliação 2.

## Problema de Negócio

Artesãos e produtores criativos têm pouca visibilidade digital, dependem de intermediários e enfrentam gestão precária de catálogo, pedidos e estoque. O Origem cria um canal direto entre essa produção e os compradores, destacando origem, técnica e o impacto de comprar de quem faz.

## Integrantes
- Aguinaldo Anselmo da Costa Neto
- Caliel Feijó de Melo Silva
- Elis Maidi Tenório Chaprão
- Eulália Regina Silva de Albuquerque
- Giulia Marianna Ferreira
- Sarah Cyrne Ferreira

## Tecnologias utilizadas

**Frontend (Avaliação 1)**
- [Next.js 16](https://nextjs.org) (App Router) com React 19 e React Compiler
- TypeScript
- [Chakra UI v3](https://chakra-ui.com): componentes, tema, recipes e tokens de cor do Origem (`frontend/src/theme`)
- [Zustand](https://zustand.docs.pmnd.rs): estado global no navegador (ex.: preferências de cookies)
- React Icons
- ESLint
- Tailwind CSS (instalado pela stack da disciplina; os estilos das telas são feitos com Chakra UI)

**Backend (planejado para a Avaliação 2)**
- Node.js + Express, Prisma e autenticação com JWT

## Como executar localmente

Pré-requisitos: [Node.js](https://nodejs.org) 20.9 ou mais recente (recomendado: versão LTS) e Git.

```bash
git clone https://github.com/elistenorio/origem.git
cd origem/frontend
npm install
npm run dev
```

Acesse http://localhost:3000.

Outros comandos (dentro de `frontend/`):

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (gera os tipos do tema antes, via `prebuild`) |
| `npm run start` | Roda o build de produção |
| `npm run lint` | Verifica o código com ESLint |
| `npm run typegen` | Regenera os tipos do tema do Chakra (rodar depois de mudar `src/theme/`) |

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Não | Endereço base da API. Se não for definida, o frontend usa `/api` (a Fake API do próprio Next). Na Avaliação 2 aponta para o backend real. |

Modelo em [`frontend/.env.example`](frontend/.env.example). Para usar, copie para `frontend/.env.local`. Nunca coloque credenciais reais no `.env.example`.

## Funcionalidades implementadas

Telas implementadas com dados de exemplo; a integração com a Fake API está em andamento.

**Comprador**
- Vitrine (home) com peças e artesãos em destaque
- Catálogo com busca e filtros (categoria, técnica, material, região, preço, disponibilidade) e ordenação
- Detalhe do produto e perfil do artesão com suas peças
- Carrinho (alterar quantidade, remover, calcular frete) e checkout com simulação de compra
- Meus pedidos (acompanhar, cancelar e avaliar) e Minha conta
- Login e cadastro (comprador e artesão), sem autenticação real nesta fase

**Artesão**
- Dashboard, meu perfil, meu catálogo (adicionar, editar e ocultar peças) e estoque

**Administrador**
- Início, gestão da plataforma, curadoria, acompanhamento, indicadores e visão geral

**Institucional e ajuda**
- Sobre, newsletter, páginas de ajuda (como comprar, entregas e frete, formas de pagamento, trocas e devoluções, perguntas frequentes), termos de uso, política de privacidade e política de cookies

## Rotas da API
A Fake API (Route Handlers do Next em `frontend/src/app/api`) está em desenvolvimento. Os endpoints, métodos, parâmetros e exemplos de resposta serão documentados em [`docs/api.md`](docs/api.md) conforme forem integrados.

## Deploy
Em configuração (Vercel). Link publicado: _a definir_.

## Evidências
- Declaração de uso de IA: [`docs/uso-de-ia.md`](docs/uso-de-ia.md)
- Prints e vídeo do fluxo no ambiente publicado: _a incluir após o deploy_
