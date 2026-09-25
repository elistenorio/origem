"use client"

import { useState } from "react"
import { SimpleGrid, Stack, Tabs } from "@chakra-ui/react"
import { Panel } from "@/components/common/Panel"
import { StatCard } from "@/components/common/StatCard"
import { PanelPageHeader } from "@/components/layout/PanelPageHeader"
import { indicadoresExemplo } from "@/dados-exemplo/admin"
import { formatCompact, formatCurrency, formatCurrencyCompact } from "@/utils/formatCurrency"
import type { PeriodoIndicadores } from "@/dados-exemplo/tipos"
import { AdminShell } from "./AdminShell"
import { ColumnChart } from "./charts/ColumnChart"
import { HBarChart } from "./charts/HBarChart"

const variacao = (v: number) => `${v >= 0 ? "▲" : "▼"} ${Math.abs(v)}% vs. período anterior`

// Indicadores (Tela 06 admin): filtro de período, números e gráficos. Por enquanto com dados de exemplo.
export function IndicatorsView() {
  const [periodo, setPeriodo] = useState<PeriodoIndicadores>("30d")
  const data = indicadoresExemplo(periodo)

  return (
    <AdminShell ativo="indicadores">
      <PanelPageHeader titulo="Indicadores" descricao="Acompanhe o desempenho do Origem por período e por categoria." />
      <Tabs.Root value={periodo} onValueChange={(e) => setPeriodo(e.value as PeriodoIndicadores)} mb="6">
        <Tabs.List>
          <Tabs.Trigger value="7d">7 dias</Tabs.Trigger>
          <Tabs.Trigger value="30d">30 dias</Tabs.Trigger>
          <Tabs.Trigger value="12m">12 meses</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
      <Stack gap="8">
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap="4">
          <StatCard title="FATURAMENTO" subtitle={variacao(data.variacoes.faturamento)} value={formatCurrencyCompact(data.faturamento)} />
          <StatCard title="PEDIDOS" subtitle={variacao(data.variacoes.pedidos)} value={data.pedidos} />
          <StatCard title="TICKET MÉDIO" subtitle={variacao(data.variacoes.ticketMedio)} value={formatCurrency(data.ticketMedio)} />
          <StatCard title="PEÇAS VENDIDAS" subtitle={variacao(data.variacoes.pecasVendidas)} value={data.pecasVendidas} />
          <StatCard title="ARTESÃOS ATIVOS" subtitle="Com perfil publicado" value={data.artesaosAtivos} />
          <StatCard title="CLIENTES" subtitle="Cadastrados na plataforma" value={formatCompact(data.clientes)} />
          <StatCard title="PEÇAS PUBLICADAS" subtitle="Na vitrine" value={formatCompact(data.produtosPublicados)} />
          <StatCard title="VISUALIZAÇÕES" subtitle="Páginas de peças vistas" value={formatCompact(data.visualizacoes)} />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, xl: 2 }} gap="6">
          <Panel title="Faturamento mensal" description="Últimos 12 meses x 12 meses anteriores">
            <ColumnChart
              titulo="Faturamento mensal, últimos 12 meses comparados aos 12 anteriores"
              rotulos={data.faturamentoMensal.map((m) => m.mes)}
              series={[
                { nome: "Últimos 12 meses", cor: "origem.laranja", valores: data.faturamentoMensal.map((m) => m.atual) },
                { nome: "12 meses anteriores", cor: "origem.marrom", valores: data.faturamentoMensal.map((m) => m.anterior) },
              ]}
              formatar={formatCurrency}
            />
          </Panel>
          <Panel title="Vendas por categoria" description="Peças vendidas no período">
            <HBarChart titulo="Vendas por categoria" dados={data.vendasPorCategoria.map((c) => ({ rotulo: c.categoria, valor: c.quantidade }))} />
          </Panel>
          <Panel title="Pedidos por semana" description="Últimas 8 semanas">
            <ColumnChart titulo="Pedidos por semana nas últimas 8 semanas" rotulos={data.pedidosPorSemana.map((s) => s.semana)} series={[{ nome: "Pedidos", cor: "origem.laranja", valores: data.pedidosPorSemana.map((s) => s.quantidade) }]} />
          </Panel>
        </SimpleGrid>
      </Stack>
    </AdminShell>
  )
}
