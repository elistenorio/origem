"use client"

import { useState } from "react"
import NextLink from "next/link"
import { Box, Button, Grid, Heading, Link, Stack, Text, Wrap } from "@chakra-ui/react"
import { BiEnvelope } from "react-icons/bi"
import { PageBreadcrumb } from "@/components/common/PageBreadcrumb"
import { SearchField } from "@/components/common/SearchField"
import { Panel } from "@/components/common/Panel"
import { FaqAccordion, type FaqItem } from "@/components/common/FaqAccordion"

type CategoriaId =
  | "todas"
  | "compras"
  | "pedidos"
  | "entregas"
  | "pagamentos"
  | "trocas"
  | "cadastro"
  | "artesaos"

const CATEGORIAS: { id: CategoriaId; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "compras", label: "Compras" },
  { id: "pedidos", label: "Pedidos" },
  { id: "entregas", label: "Entregas" },
  { id: "pagamentos", label: "Pagamentos" },
  { id: "trocas", label: "Trocas" },
  { id: "cadastro", label: "Cadastro" },
  { id: "artesaos", label: "Artesãos" },
]

// Cada grupo responde por um ou mais chips de categoria (ex.: "Pedidos" e "Entregas"
// levam ao mesmo grupo "Pedidos e entregas").
const GRUPOS: { titulo: string; categorias: CategoriaId[]; perguntas: FaqItem[] }[] = [
  {
    titulo: "Compras",
    categorias: ["compras"],
    perguntas: [
      {
        question: "Como faço para comprar uma peça?",
        answer:
          "Escolha a peça no catálogo, clique em “Adicionar ao carrinho” e siga para o pagamento. Você pode comprar como visitante ou entrar na sua conta.",
      },
      {
        question: "As peças são realmente feitas à mão?",
        answer: "Sim. Cada artesão descreve o processo de produção na página da própria peça.",
      },
    ],
  },
  {
    titulo: "Pedidos e entregas",
    categorias: ["pedidos", "entregas"],
    perguntas: [
      {
        question: "Como acompanho meu pedido?",
        answer: "Em Minha conta > Meus pedidos você vê o status atual e o código de rastreio.",
      },
      {
        question: "Qual o prazo de entrega?",
        answer: "Varia por região do Brasil — os prazos completos estão em Entregas e frete.",
      },
    ],
  },
  {
    titulo: "Pagamentos",
    categorias: ["pagamentos"],
    perguntas: [
      {
        question: "Quais formas de pagamento são aceitas?",
        answer: "Cartão de crédito em até 6x sem juros, Pix e boleto bancário.",
      },
    ],
  },
  {
    titulo: "Trocas e devoluções",
    categorias: ["trocas"],
    perguntas: [
      {
        question: "Posso devolver uma peça?",
        answer:
          "Sim, em até 7 dias corridos após o recebimento, conforme o Código de Defesa do Consumidor.",
      },
      {
        question: "A peça chegou danificada. E agora?",
        answer: "Entre em contato em até 48h com fotos da peça e da embalagem que recebemos.",
      },
    ],
  },
  {
    titulo: "Cadastro e artesãos",
    categorias: ["cadastro", "artesaos"],
    perguntas: [
      {
        question: "Como vendo minhas peças no Origem?",
        answer: "Crie uma conta de artesão em Cadastro e preencha seu perfil e catálogo de peças.",
      },
    ],
  },
]

const PAGINAS_RELACIONADAS = [
  { label: "Como comprar", href: "/ajuda/como-comprar" },
  { label: "Entregas e frete", href: "/ajuda/entregas-e-frete" },
  { label: "Trocas e devoluções", href: "/ajuda/trocas-e-devolucoes" },
  { label: "Formas de pagamento", href: "/ajuda/formas-de-pagamento" },
  { label: "Política de privacidade", href: "/politica-de-privacidade" },
]

export default function PerguntasFrequentesPage() {
  const [categoria, setCategoria] = useState<CategoriaId>("todas")

  const grupos =
    categoria === "todas"
      ? GRUPOS
      : GRUPOS.filter((grupo) => grupo.categorias.includes(categoria))

  return (
    <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Ajuda" },
          { label: "Perguntas frequentes" },
        ]}
      />

      <Box mt={6} mb={6}>
        <Heading as="h1" variant="titulo" fontSize={{ base: "3xl", md: "5xl" }} mb={2}>
          Perguntas frequentes
        </Heading>
        <Text color="origem.texto">
          Tire suas dúvidas sobre compras, pedidos, entregas, pagamentos, trocas e cadastro.
        </Text>
      </Box>

      <Box mb={6}>
        <SearchField placeholder='Busque por uma palavra, como "frete" ou "troca"' />
      </Box>

      <Wrap gap={3} mb={8}>
        {CATEGORIAS.map((item) => (
          <Button
            key={item.id}
            variant={categoria === item.id ? "chipSelecionado" : "chip"}
            size="sm"
            onClick={() => setCategoria(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </Wrap>

      <Grid templateColumns={{ base: "1fr", lg: "1.6fr 1fr" }} gap={10}>
        <Stack gap={8}>
          {grupos.map((grupo) => (
            <Box key={grupo.titulo}>
              <Heading as="h2" variant="destaque" fontSize="xl" mb={3}>
                {grupo.titulo}
              </Heading>
              <FaqAccordion items={grupo.perguntas} />
            </Box>
          ))}
        </Stack>

        <Stack gap={6}>
          <Panel title="Não encontrou sua resposta?">
            <Text fontSize="sm" color="origem.texto" mt={-2}>
              Fale com a gente de segunda a sábado, das 9h às 19h30.
            </Text>
            <Button variant="origem" w="full">
              <BiEnvelope /> Falar no WhatsApp
            </Button>
            <Link href="mailto:contato@origem.com" color="origem.laranja" fontSize="sm">
              <BiEnvelope /> contato@origem.com
            </Link>
          </Panel>

          <Panel title="Páginas relacionadas">
            <Stack gap={2}>
              {PAGINAS_RELACIONADAS.map((pagina) => (
                <Link key={pagina.href} asChild color="origem.laranja" fontSize="sm" fontWeight="medium">
                  <NextLink href={pagina.href}>→ {pagina.label}</NextLink>
                </Link>
              ))}
            </Stack>
          </Panel>
        </Stack>
      </Grid>
    </Box>
  )
}
