"use client"

import { useState } from "react"
import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react"
import { BiFilterAlt } from "react-icons/bi"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/layout/PageHeader"
import { CategoryChips } from "@/components/inicio/CategoryChips"
import { ProductGrid } from "@/components/inicio/ProductGrid"
import { SelectField } from "@/components/common/SelectField"
import { PaginationBar } from "@/components/common/PaginationBar"
import { DataState } from "@/components/feedback/DataState"
import { filtrarProdutos } from "@/dados-exemplo/consultas"
import { useUrlFilters } from "@/hooks/useUrlFilters"
import { ORDENACOES } from "@/constants/pedidos"
import type { FiltrosProduto, OrdenacaoProduto } from "@/dados-exemplo/tipos"
import { FilterPanel } from "./FilterPanel"
import { ActiveFilters } from "./ActiveFilters"

const CHAVES = ["busca", "categoria", "tecnica", "material", "regiao", "precoMin", "precoMax", "disponivel", "ordenar"] as const
const POR_PAGINA = 12

// Catálogo (Tela B) e catálogo com filtro aberto (Tela B1): mesma tela, com o painel de filtros aberto ou fechado.
export function CatalogView() {
  const { valores, page, atualizar, limpar } = useUrlFilters(CHAVES)
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)

  const filtros: FiltrosProduto = {
    busca: valores.busca, categoria: valores.categoria, tecnica: valores.tecnica, material: valores.material, regiao: valores.regiao,
    precoMin: valores.precoMin ? Number(valores.precoMin) : undefined, precoMax: valores.precoMax ? Number(valores.precoMax) : undefined,
    disponivel: valores.disponivel === "sim" ? "sim" : undefined, ordenar: (valores.ordenar as OrdenacaoProduto) ?? "relevancia",
    page, pageSize: POR_PAGINA,
  }
  const data = filtrarProdutos({ ...filtros, status: "publicado" })
  const qtdFiltros = CHAVES.filter((c) => c !== "ordenar" && c !== "busca" && valores[c]).length

  return (
    <PageContainer>
      <PageHeader trilha={[{ label: "Home", href: "/" }, { label: "Catálogo" }]} titulo="Catálogo" subtitulo="Peças feitas à mão por artesãos de Pernambuco. Cada compra valoriza quem faz." />
      <Stack gap="6">
        <CategoryChips ativa={valores.categoria} />

        <Flex gap="3" align={{ base: "stretch", md: "flex-end" }} direction={{ base: "column", md: "row" }}>
          <Button variant={filtrosAbertos ? "origem" : "claro"} onClick={() => setFiltrosAbertos((v) => !v)} aria-expanded={filtrosAbertos}>
            <BiFilterAlt /> Filtros{qtdFiltros > 0 ? ` (${qtdFiltros})` : ""}
          </Button>
          <Box flex="1">
            <ActiveFilters filtros={valores} onRemover={(chave) => atualizar({ [chave]: undefined })} />
          </Box>
          <Box w={{ base: "full", md: "240px" }}>
            <SelectField label="Ordenar por" options={ORDENACOES} value={filtros.ordenar ?? "relevancia"} onChange={(v) => atualizar({ ordenar: v })} />
          </Box>
        </Flex>

        <Flex gap="8" direction={{ base: "column", lg: "row" }} align="flex-start">
          {filtrosAbertos && (
            <FilterPanel
              valores={valores}
              onAplicar={(novos) => atualizar({ ...Object.fromEntries(CHAVES.filter((c) => c !== "busca" && c !== "ordenar").map((c) => [c, undefined])), ...novos })}
              onLimpar={limpar}
            />
          )}
          <Stack flex="1" gap="4" w="full">
            <Text textStyle="apoio">{data.total} {data.total === 1 ? "peça encontrada" : "peças encontradas"}</Text>
            <DataState
              loading={false}
              vazio={data.items.length === 0}
              mensagemVazio="Nenhuma peça encontrada"
              descricaoVazio="Tente outra palavra ou remova alguns filtros."
              acaoVazio={<Button variant="origem" onClick={limpar}>Limpar filtros</Button>}
            >
              <ProductGrid produtos={data.items} colunas={filtrosAbertos ? { base: 1, sm: 2, xl: 3 } : undefined} />
            </DataState>
            <PaginationBar page={data.page} pageSize={data.pageSize} total={data.total} onChange={(p) => atualizar({ page: String(p) })} />
          </Stack>
        </Flex>
      </Stack>
    </PageContainer>
  )
}
