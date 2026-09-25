import { Alert, Card, HStack, Image, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { Panel } from "@/components/common/Panel"
import { DataState } from "@/components/feedback/DataState"
import { StatCard } from "@/components/artesao/StatCard"
import { ArtisanPageHeader } from "@/components/artesao/ArtisanPageHeader"
import { indicadoresExemplo } from "@/dados-exemplo/admin"
import { acompanhamento, filtrarProdutos } from "@/dados-exemplo/consultas"
import { formatCompact, formatCurrency, formatCurrencyCompact } from "@/utils/formatCurrency"
import { formatDateTime } from "@/utils/formatDate"
import { AdminShell } from "./AdminShell"
import { ColumnChart } from "./charts/ColumnChart"
import { HBarChart } from "./charts/HBarChart"

// Visão geral (Tela 09 admin): retrato resumido da plataforma. Por enquanto com dados de exemplo.
export function OverviewView() {
  const d = indicadoresExemplo("30d")
  const maisRecentes = filtrarProdutos({ status: "publicado", ordenar: "recentes", pageSize: 4 }).items
  const totalCategorias = d.vendasPorCategoria.reduce((s, c) => s + c.quantidade, 0) || 1

  return (
    <AdminShell ativo="visao-geral">
      <ArtisanPageHeader titulo="Visão geral" descricao="Um retrato rápido da plataforma nos últimos 30 dias." />
      <Stack gap="8">
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 5 }} gap="4">
          <StatCard title="FATURAMENTO" subtitle="no período" value={formatCurrencyCompact(d.faturamento)} />
          <StatCard title="PEDIDOS" subtitle="no período" value={d.pedidos} />
          <StatCard title="USUÁRIOS" subtitle="clientes cadastrados" value={formatCompact(d.clientes)} />
          <StatCard title="ARTESÃOS" subtitle="ativos" value={d.artesaosAtivos} />
          <StatCard title="PEÇAS" subtitle="publicadas" value={formatCompact(d.produtosPublicados)} />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, xl: 2 }} gap="6">
          <Panel title="Faturamento" description="Últimos 12 meses">
            <ColumnChart titulo="Faturamento nos últimos 12 meses" rotulos={d.faturamentoMensal.map((m) => m.mes)} series={[{ nome: "Faturamento", cor: "origem.laranja", valores: d.faturamentoMensal.map((m) => m.atual) }]} formatar={formatCurrency} />
          </Panel>
          <Panel title="Principais categorias" description="% das peças vendidas">
            <HBarChart titulo="Principais categorias" dados={d.vendasPorCategoria.map((c) => ({ rotulo: c.categoria, valor: Math.round((c.quantidade / totalCategorias) * 100) }))} formatar={(v) => `${v}%`} />
          </Panel>
          <Panel title="Peças mais recentes">
            <DataState loading={false} vazio={maisRecentes.length === 0}>
              <Stack gap="3">
                {maisRecentes.map((p, i) => (
                  <HStack key={p.id} gap="3">
                    <Text textStyle="numero" fontSize="2xl" w="6">{i + 1}</Text>
                    <Image src={p.imagemUrl} alt="" boxSize="12" borderRadius="md" objectFit="cover" />
                    <Stack gap="0" flex="1"><Text fontWeight="bold" fontSize="sm">{p.titulo}</Text><Text textStyle="apoio">{p.artesaoNome}</Text></Stack>
                    <Text fontWeight="bold" fontSize="sm">{formatCurrency(p.preco)}</Text>
                  </HStack>
                ))}
              </Stack>
            </DataState>
          </Panel>
          <Panel title="Alertas e atividades">
            {acompanhamento.alertas.map((a) => (
              <Alert.Root key={a.id} status={a.gravidade === "alta" ? "error" : "warning"}>
                <Alert.Indicator />
                <Alert.Content><Alert.Title>{a.titulo}</Alert.Title><Alert.Description>{a.descricao}</Alert.Description></Alert.Content>
              </Alert.Root>
            ))}
            {acompanhamento.atividades.map((a) => (
              <Card.Root key={a.id} variant="item">
                <Card.Body><Card.Title>{a.autor} {a.descricao}</Card.Title><Card.Description>{formatDateTime(a.data)}</Card.Description></Card.Body>
              </Card.Root>
            ))}
          </Panel>
        </SimpleGrid>
      </Stack>
    </AdminShell>
  )
}
