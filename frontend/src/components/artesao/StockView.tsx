"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import NextLink from "next/link"
import { Alert, Box, Button, Flex, Stack } from "@chakra-ui/react"
import { BiPlus } from "react-icons/bi"
import { Panel } from "@/components/common/Panel"
import { SearchField } from "@/components/common/SearchField"
import { SelectField } from "@/components/common/SelectField"
import { DataState } from "@/components/feedback/DataState"
import { useUrlFilters } from "@/hooks/useUrlFilters"
import { meusProdutos, resumoPainelArtesao } from "@/dados-exemplo/consultas"
import { normalizeText } from "@/utils/normalizeText"
import { CATEGORIAS } from "@/constants/categorias"
import { LIMITE_BAIXO_ESTOQUE } from "@/constants/pedidos"
import type { StatusKey } from "@/components/common/StatusBadge"
import type { Produto } from "@/dados-exemplo/tipos"
import { ArtisanShell } from "./ArtisanShell"
import { ArtisanPageHeader } from "./ArtisanPageHeader"
import { CatalogSummary } from "./CatalogSummary"
import { StockItemRow } from "./StockItemRow"
import { EditStockDialog } from "./EditStockDialog"

const CHAVES = ["busca", "categoria"] as const
const rotuloCategoria = (valor: string) => CATEGORIAS.find((c) => c.value === valor)?.label ?? valor

// Situação de estoque a partir da quantidade (e do status da peça).
function statusEstoque(p: Produto): StatusKey {
  if (p.status === "indisponivel") return "indisponivel"
  if (p.estoque === 0) return "esgotado"
  if (p.estoque <= LIMITE_BAIXO_ESTOQUE) return "baixoEstoque"
  return "disponivel"
}

// Estoque (Tela 07 do artesão): resumo, alerta, filtros e lista com ações.
// Por enquanto as peças são de exemplo e as ações só mudam o estado local.
export function StockView() {
  const router = useRouter()
  const { valores, atualizar } = useUrlFilters(CHAVES)
  const [todas, setTodas] = useState<Produto[]>(meusProdutos)
  const [editando, setEditando] = useState<Produto | null>(null)
  const resumo = resumoPainelArtesao(todas)

  const busca = normalizeText(valores.busca ?? "")
  const pecas = todas.filter(
    (p) =>
      (p.status === "publicado" || p.status === "indisponivel") &&
      (!busca || normalizeText(p.titulo).includes(busca)) &&
      (!valores.categoria || p.categoria === valores.categoria),
  )

  const alterarPeca = (id: string, mudancas: Partial<Produto>) =>
    setTodas((atual) => atual.map((p) => (p.id === id ? { ...p, ...mudancas } : p)))

  function handleSalvar(quantidade: number) {
    if (!editando) return
    alterarPeca(editando.id, { estoque: quantidade })
    setEditando(null)
  }

  const alertas = resumo.estoque.baixoEstoque + resumo.estoque.esgotadas

  return (
    <ArtisanShell ativo="estoque">
      <ArtisanPageHeader titulo="Estoque" descricao="Acompanhe a quantidade disponível das suas peças e atualize sempre que produzir ou vender fora do Origem.">
        <Button asChild variant="origem"><NextLink href="/artesao/catalogo/nova"><BiPlus /> Adicionar peça</NextLink></Button>
      </ArtisanPageHeader>
      <Stack gap="8">
        <CatalogSummary tipo="estoque" resumo={resumo} />
        {alertas > 0 && (
          <Alert.Root status="warning">
            <Alert.Indicator />
            <Alert.Title>
              {resumo.estoque.baixoEstoque} com estoque baixo e {resumo.estoque.esgotadas} esgotada(s). Atualize as quantidades para continuar vendendo.
            </Alert.Title>
          </Alert.Root>
        )}
        <Flex gap="3" direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "flex-end" }}>
          <Box flex="1">
            <SearchField placeholder="Buscar peça pelo nome" defaultValue={valores.busca} aria-label="Buscar peça"
              onKeyDown={(e) => e.key === "Enter" && atualizar({ busca: e.currentTarget.value.trim() || undefined })} />
          </Box>
          <Box w={{ base: "full", md: "200px" }}><SelectField label="Categoria" options={[{ value: "", label: "Todas" }, ...CATEGORIAS]} value={valores.categoria ?? ""} onChange={(v) => atualizar({ categoria: v || undefined })} /></Box>
        </Flex>
        <Panel>
          <DataState loading={false} vazio={pecas.length === 0} mensagemVazio="Nenhuma peça no estoque">
            <Stack gap="0">
              {pecas.map((p) => (
                <StockItemRow
                  key={p.id}
                  title={p.titulo}
                  code={`ORG-${p.id.replace(/\D/g, "").padStart(4, "0")}`}
                  category={rotuloCategoria(p.categoria)}
                  imageUrl={p.imagemUrl}
                  quantity={p.estoque}
                  minQuantity={LIMITE_BAIXO_ESTOQUE}
                  status={statusEstoque(p)}
                  onEditQuantity={() => setEditando(p)}
                  onRemove={() => alterarPeca(p.id, { status: "indisponivel" })}
                  onView={() => router.push("/produto")}
                />
              ))}
            </Stack>
          </DataState>
        </Panel>
      </Stack>
      {editando && <EditStockDialog produto={editando} onClose={() => setEditando(null)} onSalvar={handleSalvar} />}
    </ArtisanShell>
  )
}
