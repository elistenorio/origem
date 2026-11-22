"use client"

import { Stack } from "@chakra-ui/react"
import { DataState } from "@/components/feedback/DataState"
import { PanelPageHeader } from "@/components/layout/PanelPageHeader"
import { useApi } from "@/hooks/useApi"
import { minhaContaService } from "@/services/minhaConta.service"
import { ArtisanShell } from "./ArtisanShell"
import { SaleCard } from "./SaleCard"

export function ArtisanOrdersView() {
  const { data, loading, error, recarregar } = useApi(() => minhaContaService.vendas(), [])

  return (
    <ArtisanShell ativo="pedidos">
      <PanelPageHeader titulo="Pedidos" descricao="Pedidos com as suas peças. A equipe do Origem atualiza o andamento de cada envio." />
      <DataState
        loading={loading}
        error={error}
        onRetry={recarregar}
        vazio={data ? data.length === 0 : undefined}
        mensagemVazio="Nenhum pedido com as suas peças ainda"
        descricaoVazio="Quando alguém comprar uma peça sua, o pedido aparece aqui."
      >
        <Stack gap="4">
          {data?.map((venda) => <SaleCard key={venda.id} venda={venda} />)}
        </Stack>
      </DataState>
    </ArtisanShell>
  )
}
