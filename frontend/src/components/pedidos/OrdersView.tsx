"use client"

import { useState } from "react"
import NextLink from "next/link"
import { Button, Stack } from "@chakra-ui/react"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/layout/PageHeader"
import { DataState } from "@/components/feedback/DataState"
import { useApi } from "@/hooks/useApi"
import { minhaContaService } from "@/services/minhaConta.service"
import type { Pedido } from "@/types/pedido"
import { OrderCard } from "./OrderCard"
import { CancelOrderDialog } from "./CancelOrderDialog"
import { ReviewOrderDialog } from "./ReviewOrderDialog"

// Meus pedidos (Tela 08) com os pop-ups de cancelamento (08.1) e avaliação (09 e 09.1).
// Os pedidos vêm de GET /minha-conta/pedidos e a avaliação é enviada em POST /avaliacoes.
// O cancelamento ainda é só visual (a rota PATCH /pedidos/{id} está planejada em docs/api.md).
export function OrdersView() {
  const { data, loading, error, recarregar } = useApi(() => minhaContaService.pedidos(), [])
  const [mudancas, setMudancas] = useState<Record<string, Partial<Pedido>>>({})
  const [cancelando, setCancelando] = useState<Pedido | null>(null)
  const [avaliando, setAvaliando] = useState<Pedido | null>(null)

  const pedidos = (data ?? []).map((p) => ({ ...p, ...mudancas[p.id] }))
  const atualizar = (id: string, novas: Partial<Pedido>) => setMudancas((atual) => ({ ...atual, [id]: { ...atual[id], ...novas } }))

  return (
    <PageContainer>
      <PageHeader trilha={[{ label: "Home", href: "/" }, { label: "Meus pedidos" }]} titulo="Meus pedidos" subtitulo={data ? `${pedidos.length} ${pedidos.length === 1 ? "pedido" : "pedidos"}` : undefined} />
      <DataState
        loading={loading}
        error={error}
        onRetry={recarregar}
        vazio={pedidos.length === 0}
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
