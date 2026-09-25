"use client"

import { Box, Flex, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/layout/PageHeader"
import { ArtisanCard } from "@/components/inicio/ArtisanCard"
import { SearchField } from "@/components/common/SearchField"
import { SelectField } from "@/components/common/SelectField"
import { PaginationBar } from "@/components/common/PaginationBar"
import { DataState } from "@/components/feedback/DataState"
import { filtrarArtesaos } from "@/dados-exemplo/consultas"
import { paraArtisan } from "@/dados-exemplo/adaptadores"
import { useUrlFilters } from "@/hooks/useUrlFilters"
import { CATEGORIAS } from "@/constants/categorias"
import { TECNICAS } from "@/constants/tecnicas"
import { REGIOES } from "@/constants/regioes"

const CHAVES = ["busca", "regiao", "categoria", "tecnica"] as const
const comTodas = (opcoes: { value: string; label: string }[]) => [{ value: "", label: "Todas" }, ...opcoes]

// Lista de artesãos (Tela C) com busca e filtros por região, categoria e técnica.
export function ArtisansView() {
  const { valores, page, atualizar } = useUrlFilters(CHAVES)
  const data = filtrarArtesaos({ ...valores, page, pageSize: 8 })

  return (
    <PageContainer>
      <PageHeader trilha={[{ label: "Home", href: "/" }, { label: "Artesãos" }]} titulo="Artesãos" subtitulo="Conheça quem faz: mestres e mestras de Pernambuco que mantêm vivas as técnicas do nosso artesanato." />
      <Stack gap="6">
        <Flex gap="3" direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "flex-end" }}>
          <Box flex="1">
            <SearchField placeholder="Buscar artesão pelo nome ou cidade" defaultValue={valores.busca} aria-label="Buscar artesão"
              onKeyDown={(e) => e.key === "Enter" && atualizar({ busca: e.currentTarget.value.trim() || undefined })} />
          </Box>
          <Box w={{ base: "full", md: "200px" }}><SelectField label="Região" options={comTodas(REGIOES)} value={valores.regiao ?? ""} onChange={(v) => atualizar({ regiao: v || undefined })} /></Box>
          <Box w={{ base: "full", md: "200px" }}><SelectField label="Categoria" options={comTodas(CATEGORIAS)} value={valores.categoria ?? ""} onChange={(v) => atualizar({ categoria: v || undefined })} /></Box>
          <Box w={{ base: "full", md: "200px" }}><SelectField label="Técnica" options={comTodas(TECNICAS)} value={valores.tecnica ?? ""} onChange={(v) => atualizar({ tecnica: v || undefined })} /></Box>
        </Flex>
        <Text textStyle="apoio">{data.total} {data.total === 1 ? "artesão encontrado" : "artesãos encontrados"}</Text>
        <DataState loading={false} vazio={data.items.length === 0} mensagemVazio="Nenhum artesão encontrado" descricaoVazio="Tente outra busca ou remova os filtros.">
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap="6">
            {data.items.map((artesao) => <ArtisanCard key={artesao.id} artisan={paraArtisan(artesao)} />)}
          </SimpleGrid>
        </DataState>
        <PaginationBar page={data.page} pageSize={data.pageSize} total={data.total} onChange={(p) => atualizar({ page: String(p) })} />
      </Stack>
    </PageContainer>
  )
}
