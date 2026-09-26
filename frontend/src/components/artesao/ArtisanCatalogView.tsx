"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import NextLink from "next/link"
import { Alert, Box, Button, Flex, Stack } from "@chakra-ui/react"
import { BiPlus } from "react-icons/bi"
import { SearchField } from "@/components/common/SearchField"
import { SelectField } from "@/components/common/SelectField"
import { DataState } from "@/components/feedback/DataState"
import { useApi } from "@/hooks/useApi"
import { useUrlFilters } from "@/hooks/useUrlFilters"
import { ApiError } from "@/services/api"
import { minhaContaService } from "@/services/minhaConta.service"
import { normalizeText } from "@/utils/normalizeText"
import { CATEGORIAS } from "@/constants/categorias"
import { ORDENACOES } from "@/constants/pedidos"
import { formatDate } from "@/utils/formatDate"
import type { StatusProduto } from "@/types/produto"
import { ArtisanShell } from "./ArtisanShell"
import { PanelPageHeader } from "@/components/layout/PanelPageHeader"
import { CatalogSummary } from "./CatalogSummary"
import { CatalogItemCard } from "./CatalogItemCard"

const CHAVES = ["busca", "status", "categoria", "ordenar"] as const
const STATUS = [
  { value: "", label: "Todos" }, { value: "publicado", label: "Publicado" }, { value: "emAnalise", label: "Em análise" },
  { value: "rascunho", label: "Rascunho" }, { value: "indisponivel", label: "Indisponível" },
]
const rotuloCategoria = (valor: string) => CATEGORIAS.find((c) => c.value === valor)?.label ?? valor

// Meu catálogo (Tela 06 do artesão): resumo, busca, filtros e as peças com ações.
// Peças: GET /minha-conta/produtos · resumo: GET /minha-conta/resumo · esconder/mostrar: PATCH /minha-conta/produtos/{id}.
// Busca, filtros e ordem são feitos aqui na tela (a lista do artesão é pequena).
export function ArtisanCatalogView() {
  const router = useRouter()
  const { valores, atualizar } = useUrlFilters(CHAVES)
  const { data: pecas, loading, error, recarregar } = useApi(() => minhaContaService.produtos(), [])
  const { data: resumo, recarregar: recarregarResumo } = useApi(() => minhaContaService.resumo(), [])
  const [erroAcao, setErroAcao] = useState<string>()

  const busca = normalizeText(valores.busca ?? "")
  const filtradas = (pecas ?? []).filter(
    (p) =>
      (!busca || normalizeText(p.titulo).includes(busca)) &&
      (!valores.categoria || p.categoria === valores.categoria) &&
      (!valores.status || p.status === valores.status),
  )
  const ordem = valores.ordenar ?? "recentes"
  if (ordem === "menor_preco") filtradas.sort((a, b) => a.preco - b.preco)
  if (ordem === "maior_preco") filtradas.sort((a, b) => b.preco - a.preco)
  if (ordem === "recentes") filtradas.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))

  async function alternarVisibilidade(id: string, status: StatusProduto) {
    setErroAcao(undefined)
    try {
      await minhaContaService.atualizarProduto(id, { status: status === "indisponivel" ? "publicado" : "indisponivel" })
      recarregar()
      recarregarResumo()
    } catch (e) {
      setErroAcao(e instanceof ApiError ? e.message : "Não foi possível atualizar a peça.")
    }
  }

  return (
    <ArtisanShell ativo="catalogo">
      <PanelPageHeader titulo="Meu catálogo" descricao="Aqui você pode adicionar, editar e acompanhar as peças que estão disponíveis no Origem.">
        <Button asChild variant="origem">
          <NextLink href="/artesao/catalogo/nova"><BiPlus /> Adicionar peça</NextLink>
        </Button>
      </PanelPageHeader>
      <Stack gap="8">
        {resumo && <CatalogSummary tipo="catalogo" resumo={resumo} />}
        {erroAcao && (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Title>{erroAcao}</Alert.Title>
          </Alert.Root>
        )}
        <Flex gap="3" direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "flex-end" }}>
          <Box flex="1">
            <SearchField placeholder="Digite o nome da peça que deseja encontrar" defaultValue={valores.busca} aria-label="Buscar peça"
              onKeyDown={(e) => e.key === "Enter" && atualizar({ busca: e.currentTarget.value.trim() || undefined })} />
          </Box>
          <Box w={{ base: "full", md: "200px" }}><SelectField label="Status" options={STATUS} value={valores.status ?? ""} onChange={(v) => atualizar({ status: v || undefined })} /></Box>
          <Box w={{ base: "full", md: "200px" }}><SelectField label="Categoria" options={[{ value: "", label: "Todas" }, ...CATEGORIAS]} value={valores.categoria ?? ""} onChange={(v) => atualizar({ categoria: v || undefined })} /></Box>
          <Box w={{ base: "full", md: "200px" }}><SelectField label="Ordenar por" options={ORDENACOES} value={valores.ordenar ?? "recentes"} onChange={(v) => atualizar({ ordenar: v })} /></Box>
        </Flex>
        <DataState loading={loading} error={error} onRetry={recarregar} vazio={pecas ? filtradas.length === 0 : undefined} mensagemVazio="Nenhuma peça encontrada"
          acaoVazio={<Button asChild variant="origem"><NextLink href="/artesao/catalogo/nova">Adicionar peça</NextLink></Button>}>
          <Stack gap="4">
            {filtradas.map((p) => (
              <CatalogItemCard
                key={p.id}
                title={p.titulo}
                imageUrl={p.imagemUrl}
                category={rotuloCategoria(p.categoria)}
                stock={p.estoque}
                updatedAt={formatDate(p.criadoEm)}
                price={p.preco}
                status={p.status}
                visible={p.status !== "indisponivel"}
                onEdit={() => router.push(`/artesao/catalogo/${p.id}`)}
                onView={() => router.push(`/produtos/${p.id}`)}
                onToggleVisibility={() => alternarVisibilidade(p.id, p.status)}
              />
            ))}
          </Stack>
        </DataState>
      </Stack>
    </ArtisanShell>
  )
}
