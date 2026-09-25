"use client"

import { useState } from "react"
import { Flex, Heading, Stack, Text } from "@chakra-ui/react"
import { ProductGrid } from "@/components/inicio/ProductGrid"
import { PaginationBar } from "@/components/common/PaginationBar"
import { DataState } from "@/components/feedback/DataState"
import { useApi } from "@/hooks/useApi"
import { produtosService } from "@/services/produtos.service"

const POR_PAGINA = 8

// Catálogo público de um artesão (GET /produtos?artesaoId=), no fim do perfil.
export function ArtisanProducts({ artesaoId }: { artesaoId: string }) {
  const [page, setPage] = useState(1)
  const { data, loading, error, recarregar } = useApi(
    () => produtosService.listar({ artesaoId, page, pageSize: POR_PAGINA }),
    [artesaoId, page],
  )

  return (
    <Stack gap="6" id="catalogo" scrollMarginTop="24px">
      <Flex justify="space-between" align="baseline" wrap="wrap" gap="2">
        <Heading as="h2" variant="secao" fontSize="lg">Catálogo de peças</Heading>
        {data && <Text textStyle="apoio">{data.total} {data.total === 1 ? "peça" : "peças"}</Text>}
      </Flex>
      <DataState loading={loading} error={error} onRetry={recarregar} vazio={!data?.items.length} mensagemVazio="Nenhuma peça publicada ainda">
        {data && <ProductGrid produtos={data.items} />}
      </DataState>
      {data && <PaginationBar page={data.page} pageSize={data.pageSize} total={data.total} onChange={setPage} />}
    </Stack>
  )
}
