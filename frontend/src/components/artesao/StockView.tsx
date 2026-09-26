"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import NextLink from "next/link"
import { Alert, Box, Button, Flex, Stack } from "@chakra-ui/react"
import { BiPlus } from "react-icons/bi"
import { Tile } from "@/components/common/Tile"
import { SearchField } from "@/components/common/SearchField"
import { SelectField } from "@/components/common/SelectField"
import { DataState } from "@/components/feedback/DataState"
import { useApi } from "@/hooks/useApi"
import { useUrlFilters } from "@/hooks/useUrlFilters"
import { ApiError } from "@/services/api"
import { minhaContaService } from "@/services/minhaConta.service"
import { normalizeText } from "@/utils/normalizeText"
import { CATEGORIAS } from "@/constants/categorias"
import { LIMITE_BAIXO_ESTOQUE } from "@/constants/pedidos"
import type { StatusKey } from "@/components/common/StatusBadge"
import type { AtualizarEstoqueInput, Produto } from "@/types/produto"
import { ArtisanShell } from "./ArtisanShell"
import { PanelPageHeader } from "@/components/layout/PanelPageHeader"
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
// Peças: GET /minha-conta/produtos · resumo: GET /minha-conta/resumo · editar/remover: PATCH /minha-conta/produtos/{id}.
export function StockView() {
  const router = useRouter()
  const { valores, atualizar } = useUrlFilters(CHAVES)
  const { data: todas, loading, error, recarregar } = useApi(() => minhaContaService.produtos(), [])
  const { data: resumo, recarregar: recarregarResumo } = useApi(() => minhaContaService.resumo(), [])
  const [editando, setEditando] = useState<Produto | null>(null)
  const [erroAcao, setErroAcao] = useState<string>()

  const busca = normalizeText(valores.busca ?? "")
  const pecas = (todas ?? []).filter(
    (p) =>
      (p.status === "publicado" || p.status === "indisponivel") &&
      (!busca || normalizeText(p.titulo).includes(busca)) &&
      (!valores.categoria || p.categoria === valores.categoria),
  )

  // Salva na API e recarrega a lista e o resumo.
  async function alterarPeca(id: string, mudancas: AtualizarEstoqueInput) {
    setErroAcao(undefined)
    try {
      await minhaContaService.atualizarProduto(id, mudancas)
      recarregar()
      recarregarResumo()
    } catch (e) {
      setErroAcao(e instanceof ApiError ? e.message : "Não foi possível atualizar a peça.")
    }
  }

  async function handleSalvar(quantidade: number) {
    if (!editando) return
    const id = editando.id
    setEditando(null)
    await alterarPeca(id, { estoque: quantidade })
  }

  const alertas = resumo ? resumo.estoque.baixoEstoque + resumo.estoque.esgotadas : 0

  return (
    <ArtisanShell ativo="estoque">
      <PanelPageHeader titulo="Estoque" descricao="Acompanhe a quantidade disponível das suas peças e atualize sempre que produzir ou vender fora do Origem.">
        <Button asChild variant="origem"><NextLink href="/artesao/catalogo/nova"><BiPlus /> Adicionar peça</NextLink></Button>
      </PanelPageHeader>
      <Stack gap="8">
        {resumo && <CatalogSummary tipo="estoque" resumo={resumo} />}
        {resumo && alertas > 0 && (
          <Alert.Root status="warning">
            <Alert.Indicator />
            <Alert.Title>
              {resumo.estoque.baixoEstoque} com estoque baixo e {resumo.estoque.esgotadas} esgotada(s). Atualize as quantidades para continuar vendendo.
            </Alert.Title>
          </Alert.Root>
        )}
        {erroAcao && (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Title>{erroAcao}</Alert.Title>
          </Alert.Root>
        )}
        <Flex gap="3" direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "flex-end" }}>
          <Box flex="1">
            <SearchField placeholder="Buscar peça pelo nome" defaultValue={valores.busca} aria-label="Buscar peça"
              onKeyDown={(e) => e.key === "Enter" && atualizar({ busca: e.currentTarget.value.trim() || undefined })} />
          </Box>
          <Box w={{ base: "full", md: "200px" }}><SelectField label="Categoria" options={[{ value: "", label: "Todas" }, ...CATEGORIAS]} value={valores.categoria ?? ""} onChange={(v) => atualizar({ categoria: v || undefined })} /></Box>
        </Flex>
        <Tile>
          <DataState loading={loading} error={error} onRetry={recarregar} vazio={todas ? pecas.length === 0 : undefined} mensagemVazio="Nenhuma peça no estoque">
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
                  onView={() => router.push(`/produtos/${p.id}`)}
                />
              ))}
            </Stack>
          </DataState>
        </Tile>
      </Stack>
      {editando && <EditStockDialog produto={editando} onClose={() => setEditando(null)} onSalvar={handleSalvar} />}
    </ArtisanShell>
  )
}
