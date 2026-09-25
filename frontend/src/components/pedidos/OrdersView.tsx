"use client"

import { useState } from "react"
import NextLink from "next/link"
import { Button, Stack } from "@chakra-ui/react"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/layout/PageHeader"
import { DataState } from "@/components/feedback/DataState"
import { meusPedidos } from "@/dados-exemplo/consultas"
import type { Pedido } from "@/types/pedido"
import { OrderCard } from "./OrderCard"
import { CancelOrderDialog } from "./CancelOrderDialog"
import { ReviewOrderDialog } from "./ReviewOrderDialog"

// Meus pedidos (Tela 08) com os pop-ups de cancelamento (08.1) e avaliação (09 e 09.1).
// Por enquanto os pedidos são de exemplo e as ações só mudam o estado local.
export function OrdersView() {
  const [pedidos, setPedidos] = useState<Pedido[]>(meusPedidos)
  const [cancelando, setCancelando] = useState<Pedido | null>(null)
  const [avaliando, setAvaliando] = useState<Pedido | null>(null)

  const atualizar = (id: string, mudancas: Partial<Pedido>) =>
    setPedidos((atual) => atual.map((p) => (p.id === id ? { ...p, ...mudancas } : p)))

  return (
    <PageContainer>
      <PageHeader trilha={[{ label: "Home", href: "/" }, { label: "Meus pedidos" }]} titulo="Meus pedidos" subtitulo={`${pedidos.length} ${pedidos.length === 1 ? "pedido" : "pedidos"}`} />
      <DataState
        loading={false}
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
