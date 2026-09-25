import NextLink from "next/link"
import { Box, Button, Card, Heading, HStack, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { BiSliderAlt, BiBadgeCheck, BiPulse, BiBarChartAlt2 } from "react-icons/bi"
import { Panel } from "@/components/common/Panel"
import { StatCard } from "@/components/common/StatCard"
import { NotificationItem } from "@/components/artesao/NotificationItem"
import { painelAdmin } from "@/dados-exemplo/consultas"
import { formatCurrencyCompact } from "@/utils/formatCurrency"
import { formatDateTime } from "@/utils/formatDate"
import { AdminShell } from "./AdminShell"

const ATALHOS = [
  { rotulo: "Gestão", href: "/admin/gestao", icone: <BiSliderAlt /> },
  { rotulo: "Curadoria", href: "/admin/curadoria", icone: <BiBadgeCheck /> },
  { rotulo: "Acompanhamento", href: "/admin/acompanhamento", icone: <BiPulse /> },
  { rotulo: "Indicadores", href: "/admin/indicadores", icone: <BiBarChartAlt2 /> },
]

// Tela inicial do administrador (Tela 04 admin). Por enquanto com dados de exemplo.
export function AdminHomeView() {
  const data = painelAdmin

  return (
    <AdminShell ativo="inicio">
      <Stack gap="1" mb="8">
        <Text textStyle="rotulo">Olá,</Text>
        <Heading as="h1" variant="titulo" fontSize={{ base: "4xl", md: "5xl" }}>Equipe Origem</Heading>
        <Text textStyle="apoio">Aqui está o resumo da plataforma hoje.</Text>
      </Stack>
      <Stack gap="8">
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap="4">
          <StatCard title="PEDIDOS HOJE" subtitle="Pedidos feitos desde 00h" value={data.resumo.pedidosHoje} />
          <StatCard title="VENDAS DO MÊS" subtitle="Faturamento bruto no mês" value={formatCurrencyCompact(data.resumo.vendasMes)} />
          <StatCard title="ARTESÃOS ATIVOS" subtitle="Com perfil publicado" value={data.resumo.artesaosAtivos} />
          <StatCard title="PEÇAS PUBLICADAS" subtitle="Disponíveis na vitrine" value={data.resumo.produtosPublicados} />
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 3 }} gap="6">
          <Panel title="Pendências">
            <Stack gap="3">
              {data.pendencias.map((p) => (
                <Card.Root key={p.id} asChild variant="item" _hover={{ opacity: 0.85 }}>
                  <NextLink href={p.href}>
                    <Card.Body flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Text fontSize="sm">{p.titulo}</Text>
                      <Text textStyle="numero" fontSize="3xl">{p.quantidade}</Text>
                    </Card.Body>
                  </NextLink>
                </Card.Root>
              ))}
            </Stack>
          </Panel>
          <Panel title="Notificações recentes">
            <Stack gap="4">
              {data.notificacoes.map((n) => <NotificationItem key={n.id} title={n.titulo} description={n.descricao} />)}
            </Stack>
          </Panel>
          <Panel title="Atalhos">
            <Stack gap="3">
              {ATALHOS.map((a) => (
                <Button key={a.href} asChild variant="origem" justifyContent="flex-start">
                  <NextLink href={a.href}>{a.icone} {a.rotulo}</NextLink>
                </Button>
              ))}
            </Stack>
          </Panel>
        </SimpleGrid>

        <Panel title="Atividades recentes">
          <Stack gap="0">
            {data.atividades.map((a) => (
              <HStack key={a.id} justify="space-between" py="3" borderBottomWidth="1px" borderColor="origem.marrom/30" gap="4">
                <Text fontSize="sm"><strong>{a.autor}</strong> {a.descricao}</Text>
                <Box flexShrink={0}><Text textStyle="apoio">{formatDateTime(a.data)}</Text></Box>
              </HStack>
            ))}
          </Stack>
        </Panel>
      </Stack>
    </AdminShell>
  )
}
