"use client"

import { useState } from "react"
import { Box, Flex, Stack, Table } from "@chakra-ui/react"
import { SearchField } from "@/components/common/SearchField"
import { SelectField } from "@/components/common/SelectField"
import { PaginationBar } from "@/components/common/PaginationBar"
import { DataState } from "@/components/feedback/DataState"
import { useApi } from "@/hooks/useApi"
import type { FiltrosGestao } from "@/services/admin.service"
import type { Paginated } from "@/types/api"

export type Coluna<T> = { titulo: string; render: (item: T) => React.ReactNode; alinhar?: "end" }

type ManagementTableProps<T extends { id: string }> = {
  buscar: (filtros: FiltrosGestao) => Promise<Paginated<T>>
  colunas: Coluna<T>[]
  opcoesStatus: { value: string; label: string }[]
  placeholder: string
  versao?: number
}

const POR_PAGINA = 10

// Lista da Gestão da plataforma: busca, filtro de status, tabela e paginação feitos pelo backend.
export function ManagementTable<T extends { id: string }>({ buscar, colunas, opcoesStatus, placeholder, versao = 0 }: ManagementTableProps<T>) {
  const [busca, setBusca] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const { data, loading, error, recarregar } = useApi(
    () => buscar({ busca: busca || undefined, status: status || undefined, page, pageSize: POR_PAGINA }),
    [busca, status, page, versao],
  )

  return (
    <Stack gap="5">
      <Flex gap="3" direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "flex-end" }}>
        <Box flex="1">
          <SearchField placeholder={placeholder} aria-label={placeholder}
            onKeyDown={(e) => { if (e.key === "Enter") { setBusca(e.currentTarget.value.trim()); setPage(1) } }} />
        </Box>
        <Box w={{ base: "full", md: "220px" }}>
          <SelectField label="Status" options={[{ value: "", label: "Todos" }, ...opcoesStatus]} value={status} onChange={(v) => { setStatus(v); setPage(1) }} />
        </Box>
      </Flex>
      <DataState loading={loading && !data} error={error} onRetry={recarregar} vazio={data ? data.items.length === 0 : undefined} mensagemVazio="Nenhum resultado">
        {data && (
          <>
            <Table.ScrollArea>
              <Table.Root size="sm">
                <Table.Header>
                  <Table.Row>
                    {colunas.map((c) => <Table.ColumnHeader key={c.titulo} textAlign={c.alinhar}>{c.titulo}</Table.ColumnHeader>)}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data.items.map((item) => (
                    <Table.Row key={item.id}>
                      {colunas.map((c) => <Table.Cell key={c.titulo} textAlign={c.alinhar}>{c.render(item)}</Table.Cell>)}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
            <PaginationBar page={data.page} pageSize={data.pageSize} total={data.total} onChange={setPage} />
          </>
        )}
      </DataState>
    </Stack>
  )
}
