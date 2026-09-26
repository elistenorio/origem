"use client"

import { useState, useSyncExternalStore } from "react"
import NextLink from "next/link"
import { Button, Stack } from "@chakra-ui/react"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/layout/PageHeader"
import { DataState } from "@/components/feedback/DataState"
import { useApi } from "@/hooks/useApi"
import { minhaContaService } from "@/services/minhaConta.service"
import { useOrdersStore } from "@/store/ordersStore"
import type { Pedido } from "@/types/pedido"
import { OrderCard } from "./OrderCard"
import { CancelOrderDialog } from "./CancelOrderDialog"
import { ReviewOrderDialog } from "./ReviewOrderDialog"

// Meus pedidos (Tela 08) com os pop-ups de cancelamento (08.1) e avaliação (09 e 09.1).
// Lista: GET /minha-conta/pedidos + os pedidos finalizados neste navegador (store/ordersStore.ts).
export function OrdersView() {
  const { data, loading, error, recarregar } = useApi(() => minhaContaService.pedidos(), [])
  const feitosAqui = useOrdersStore((state) => state.orders)
  const [mudancas, setMudancas] = useState<Record<string, Partial<Pedido>>>({})
  const [cancelando, setCancelando] = useState<Pedido | null>(null)
  const [avaliando, setAvaliando] = useState<Pedido | null>(null)

  // Depois de cancelar ou avaliar, a API já respondeu; aqui a tela só reflete a mudança na hora.
  const atualizar = (id: string, novas: Partial<Pedido>) =>
    setMudancas((atual) => ({ ...atual, [id]: { ...atual[id], ...novas } }))

  // Os pedidos feitos neste navegador ficam salvos nele; até a tela abrir no navegador,
  // mostra "carregando" (evita erro de hidratação).
  const noNavegador = useSyncExternalStore(() => () => {}, () => true, () => false)

  // Pedidos da API + os feitos aqui que a API não devolveu (ex.: no deploy, outra instância do servidor).
  const daApi = data ?? []
  const pedidos = [...feitosAqui.filter((p) => !daApi.some((a) => a.id === p.id)), ...daApi].map((p) => ({ ...p, ...mudancas[p.id] }))

  return (
    <PageContainer>
      <PageHeader trilha={[{ label: "Home", href: "/" }, { label: "Meus pedidos" }]} titulo="Meus pedidos" subtitulo={data ? `${pedidos.length} ${pedidos.length === 1 ? "pedido" : "pedidos"}` : undefined} />
      <DataState
        loading={loading || !noNavegador}
        error={error}
        onRetry={recarregar}
        vazio={data ? pedidos.length === 0 : undefined}
        mensagemVazio="Você ainda não fez nenhum pedido"
        acaoVazio={<Button asChild variant="origem"><NextLink href="/catalogo">Ir para o catálogo</NextLink></Button>}
      >
        <Stack gap="6">
          {pedidos.map((pedido) => (
            <OrderCard key={pedido.id} pedido={pedido} onCancelar={() => setCancelando(pedido)} onAvaliar={() => setAvaliando(pedido)} />
          ))}
        </Stack>
      </DataState>
      <CancelOrderDialog pedido={cancelando} onClose={() => setCancelando(null)} onCancelado={(id, motivo) => atualizar(id, { status: "cancelado", motivoCancelamento: motivo })} />
      <ReviewOrderDialog pedido={avaliando} onClose={() => setAvaliando(null)} onAvaliado={(id) => atualizar(id, { avaliado: true })} />
    </PageContainer>
  )
}
