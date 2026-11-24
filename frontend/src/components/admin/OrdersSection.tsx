"use client"

import { useState } from "react"
import { Box, Button, Table } from "@chakra-ui/react"
import { PaginationBar } from "@/components/common/PaginationBar"
import { SectionCard } from "@/components/common/SectionCard"
import { SelectField } from "@/components/common/SelectField"
import { StatusBadge } from "@/components/common/StatusBadge"
import { DataState } from "@/components/feedback/DataState"
import { FILTROS_STATUS_PEDIDO, PROXIMO_PASSO } from "@/constants/pedidos"
import { useApi } from "@/hooks/useApi"
import { adminService } from "@/services/admin.service"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"
import type { Pedido, StatusPedido } from "@/types/pedido"
import { UpdateOrderStatusDialog } from "./UpdateOrderStatusDialog"

const POR_PAGINA = 10
const COLUNAS = ["Pedido", "Cliente", "Data", "Valor", "Status", "Próximo passo"]

export function OrdersSection({ onAtualizado }: { onAtualizado: () => void }) {
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const [selecionado, setSelecionado] = useState<Pedido | null>(null)
  const { data, loading, error, recarregar } = useApi(
    () => adminService.pedidos({ status: (status || undefined) as StatusPedido | undefined, page, pageSize: POR_PAGINA }),
    [status, page],
  )

  function filtrar(valor: string) {
    setStatus(valor)
    setPage(1)
  }

  function handleAtualizado() {
    setSelecionado(null)
    recarregar()
    onAtualizado()
  }

  return (
    <SectionCard title="Pedidos">
      <Box maxW={{ md: "260px" }}>
        <SelectField label="Status" options={FILTROS_STATUS_PEDIDO} value={status} onChange={filtrar} />
      </Box>
      <DataState loading={loading} error={error} onRetry={recarregar} vazio={data ? data.items.length === 0 : undefined} mensagemVazio="Nenhum pedido com esse status">
        {data && (
          <>
            <Table.ScrollArea>
              <Table.Root size="sm">
                <Table.Header>
                  <Table.Row>{COLUNAS.map((t) => <Table.ColumnHeader key={t}>{t}</Table.ColumnHeader>)}</Table.Row>
                </Table.Header>
                <Table.Body>
                  {data.items.map((p) => {
                    const passo = PROXIMO_PASSO[p.status]
                    return (
                      <Table.Row key={p.id}>
                        <Table.Cell fontWeight="bold">{p.codigo}</Table.Cell>
                        <Table.Cell>{p.comprador.nome}</Table.Cell>
                        <Table.Cell>{formatDate(p.criadoEm)}</Table.Cell>
                        <Table.Cell>{formatCurrency(p.total)}</Table.Cell>
                        <Table.Cell><StatusBadge status={p.status} /></Table.Cell>
                        <Table.Cell>
                          {passo && <Button size="sm" variant="outline" minH="9" px="4" onClick={() => setSelecionado(p)}>{passo.acao}</Button>}
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
            <PaginationBar page={data.page} pageSize={data.pageSize} total={data.total} onChange={setPage} />
          </>
        )}
      </DataState>
      <UpdateOrderStatusDialog pedido={selecionado} onClose={() => setSelecionado(null)} onAtualizado={handleAtualizado} />
    </SectionCard>
  )
}
