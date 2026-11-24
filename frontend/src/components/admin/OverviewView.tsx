"use client"

import { Alert, Box, Card, HStack, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { SectionCard } from "@/components/common/SectionCard"
import { AvatarItem } from "@/components/common/AvatarItem"
import { DataState } from "@/components/feedback/DataState"
import { StatCard } from "@/components/common/StatCard"
import { PanelPageHeader } from "@/components/layout/PanelPageHeader"
import { useApi } from "@/hooks/useApi"
import { adminService } from "@/services/admin.service"
import { produtosService } from "@/services/produtos.service"
import { formatCompact, formatCurrency, formatCurrencyCompact } from "@/utils/formatCurrency"
import { formatDateTime } from "@/utils/formatDate"
import { AdminShell } from "./AdminShell"
import { ColumnChart } from "./charts/ColumnChart"
import { HBarChart } from "./charts/HBarChart"

// Visão geral (Tela 09 admin): retrato resumido da plataforma.
export function OverviewView() {
  const indicadores = useApi(() => adminService.indicadores("30d"), [])
  const recentes = useApi(() => produtosService.listar({ ordenar: "recentes", pageSize: 4 }), [])
  const acompanhamento = useApi(() => adminService.acompanhamento(), [])
  const d = indicadores.data
  const totalCategorias = d ? d.vendasPorCategoria.reduce((s, c) => s + c.quantidade, 0) || 1 : 1

  return (
    <AdminShell ativo="visao-geral">
      <PanelPageHeader titulo="Visão geral" descricao="Um retrato rápido da plataforma nos últimos 30 dias." />
      <Stack gap="8">
        <DataState loading={indicadores.loading} error={indicadores.error} onRetry={indicadores.recarregar}>
          {d && (
            <Stack gap="8">
              <SimpleGrid columns={{ base: 1, sm: 2, lg: 5 }} gap="4">
                <StatCard title="FATURAMENTO" subtitle="no período" value={formatCurrencyCompact(d.faturamento)} />
                <StatCard title="PEDIDOS" subtitle="no período" value={d.pedidos} />
                <StatCard title="USUÁRIOS" subtitle="clientes cadastrados" value={formatCompact(d.clientes)} />
                <StatCard title="ARTESÃOS" subtitle="ativos" value={d.artesaosAtivos} />
                <StatCard title="PEÇAS" subtitle="publicadas" value={formatCompact(d.produtosPublicados)} />
              </SimpleGrid>
              <SimpleGrid columns={{ base: 1, xl: 2 }} gap="6">
                <SectionCard title="Faturamento" description="Últimos 12 meses">
                  <ColumnChart titulo="Faturamento nos últimos 12 meses" rotulos={d.faturamentoMensal.map((m) => m.mes)} series={[{ nome: "Faturamento", cor: "origem.laranja", valores: d.faturamentoMensal.map((m) => m.atual) }]} formatar={formatCurrency} />
                </SectionCard>
                <SectionCard title="Principais categorias" description="% das peças vendidas">
                  {d.vendasPorCategoria.length === 0
                    ? <Text textStyle="apoio">Nenhuma peça vendida no período.</Text>
                    : <HBarChart titulo="Principais categorias" dados={d.vendasPorCategoria.map((c) => ({ rotulo: c.categoria, valor: Math.round((c.quantidade / totalCategorias) * 100) }))} formatar={(v) => `${v}%`} />}
                </SectionCard>
              </SimpleGrid>
            </Stack>
          )}
        </DataState>
        <SimpleGrid columns={{ base: 1, xl: 2 }} gap="6">
          <SectionCard title="Peças mais recentes">
            <DataState loading={recentes.loading} error={recentes.error} onRetry={recentes.recarregar} vazio={recentes.data ? recentes.data.items.length === 0 : undefined}>
              <Stack gap="3">
                {recentes.data?.items.map((p, i) => (
                  <HStack key={p.id} gap="3">
                    <Text textStyle="numero" fontSize="2xl" w="6">{i + 1}</Text>
                    <Box flex="1" minW="0"><AvatarItem src={p.imagemUrl} titulo={p.titulo} subtitulo={p.artesaoNome} tamanho="12" /></Box>
                    <Text fontWeight="bold" fontSize="sm">{formatCurrency(p.preco)}</Text>
                  </HStack>
                ))}
              </Stack>
            </DataState>
          </SectionCard>
          <SectionCard title="Alertas e atividades">
            <DataState loading={acompanhamento.loading} error={acompanhamento.error} onRetry={acompanhamento.recarregar}>
              <Stack gap="3">
                {acompanhamento.data?.alertas.map((a) => (
                  <Alert.Root key={a.id} status={a.gravidade === "alta" ? "error" : "warning"}>
                    <Alert.Indicator />
                    <Alert.Content><Alert.Title>{a.titulo}</Alert.Title><Alert.Description>{a.descricao}</Alert.Description></Alert.Content>
                  </Alert.Root>
                ))}
                {acompanhamento.data?.atividades.map((a) => (
                  <Card.Root key={a.id} variant="item">
                    <Card.Body><Card.Title>{a.autor} {a.descricao}</Card.Title><Card.Description>{formatDateTime(a.data)}</Card.Description></Card.Body>
                  </Card.Root>
                ))}
              </Stack>
            </DataState>
          </SectionCard>
        </SimpleGrid>
      </Stack>
    </AdminShell>
  )
}
