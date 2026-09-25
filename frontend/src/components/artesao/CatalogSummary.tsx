import { SimpleGrid } from "@chakra-ui/react"
import { StatCard } from "@/components/common/StatCard"
import type { ResumoPainelArtesao } from "@/dados-exemplo/tipos"

type CatalogSummaryProps = { tipo: "catalogo" | "estoque"; resumo: ResumoPainelArtesao }

// Cards de resumo do catálogo ou do estoque do artesão.
export function CatalogSummary({ tipo, resumo }: CatalogSummaryProps) {
  const valor = (n: number) => String(n)

  const cards =
    tipo === "catalogo"
      ? [
          { title: "PEÇAS PUBLICADAS", subtitle: "Disponíveis agora na vitrine do Origem", value: valor(resumo.catalogo.publicadas) },
          { title: "EM ANÁLISE", subtitle: "Aguardando aprovação da curadoria", value: valor(resumo.catalogo.emAnalise) },
          { title: "PEÇAS VENDIDAS", subtitle: "Unidades vendidas desde que você entrou", value: valor(resumo.catalogo.vendidas) },
          { title: "INDISPONÍVEIS", subtitle: "Pausadas ou sem estoque no momento", value: valor(resumo.catalogo.indisponiveis) },
        ]
      : [
          { title: "DISPONÍVEIS", subtitle: "Peças com estoque para venda", value: valor(resumo.estoque.disponiveis) },
          { title: "BAIXO ESTOQUE", subtitle: "Peças com 1 unidade ou menos", value: valor(resumo.estoque.baixoEstoque) },
          { title: "ESGOTADAS", subtitle: "Peças sem nenhuma unidade", value: valor(resumo.estoque.esgotadas) },
        ]

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, lg: cards.length }} gap="4">
      {cards.map((c) => <StatCard key={c.title} {...c} />)}
    </SimpleGrid>
  )
}
