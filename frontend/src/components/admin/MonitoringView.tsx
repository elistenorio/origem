import NextLink from "next/link"
import { Alert, Box, Card, Flex, HStack, Image, Link, SimpleGrid, Stack, Table, Text } from "@chakra-ui/react"
import { SectionCard } from "@/components/common/SectionCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { DataState } from "@/components/feedback/DataState"
import { StatCard } from "@/components/artesao/StatCard"
import { ArtisanPageHeader } from "@/components/artesao/ArtisanPageHeader"
import { acompanhamento, paginar } from "@/dados-exemplo/consultas"
import { pedidosExemplo } from "@/dados-exemplo/pedidos"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate, formatDateTime } from "@/utils/formatDate"
import { AdminShell } from "./AdminShell"

// Acompanhamento (Tela 07 admin): pedidos por status, pedidos recentes, alertas e filas. Por enquanto com dados de exemplo.
export function MonitoringView() {
  const data = acompanhamento
  const pedidos = paginar([...pedidosExemplo].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)), 1, 10).items

  return (
    <AdminShell ativo="acompanhamento">
      <ArtisanPageHeader titulo="Acompanhamento" descricao="Acompanhe pedidos, novos artesãos e produtos pendentes." />
      <Stack gap="8">
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap="4">
          <StatCard title="EM PROCESSAMENTO" subtitle="Pagos, aguardando envio" value={data.contagem.processando} />
          <StatCard title="ENVIADOS" subtitle="A caminho do cliente" value={data.contagem.enviado} />
          <StatCard title="ENTREGUES" subtitle="Nos últimos 30 dias" value={data.contagem.entregue} />
          <StatCard title="CANCELADOS" subtitle="Nos últimos 30 dias" value={data.contagem.cancelado} />
        </SimpleGrid>

        <Flex gap="6" direction={{ base: "column", xl: "row" }} align="flex-start">
          <Stack flex="1" gap="6" w="full">
            <SectionCard title="Pedidos recentes" action={<Link asChild variant="origem" fontSize="sm"><NextLink href="/admin/gestao">Ver todos →</NextLink></Link>}>
              <DataState loading={false} vazio={pedidos.length === 0}>
                <Table.ScrollArea>
                  <Table.Root size="sm">
                    <Table.Header><Table.Row>{["Pedido", "Cliente", "Data", "Valor", "Status"].map((t) => <Table.ColumnHeader key={t}>{t}</Table.ColumnHeader>)}</Table.Row></Table.Header>
                    <Table.Body>
                      {pedidos.map((p) => (
                        <Table.Row key={p.id}>
                          <Table.Cell fontWeight="bold">{p.codigo}</Table.Cell>
                          <Table.Cell>{p.comprador.nome}</Table.Cell>
                          <Table.Cell>{formatDate(p.criadoEm)}</Table.Cell>
                          <Table.Cell>{formatCurrency(p.total)}</Table.Cell>
                          <Table.Cell><StatusBadge status={p.status} /></Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Table.ScrollArea>
              </DataState>
            </SectionCard>
            <SectionCard title="Atividades recentes">
              {data.atividades.map((a) => (
                <Card.Root key={a.id} variant="item">
                  <Card.Body><Card.Title>{a.autor} {a.descricao}</Card.Title><Card.Description>{formatDateTime(a.data)}</Card.Description></Card.Body>
                </Card.Root>
              ))}
            </SectionCard>
          </Stack>

          <Stack w={{ base: "full", xl: "380px" }} gap="6" flexShrink={0}>
            <SectionCard title="Alertas e pendências">
              {data.alertas.map((a) => (
                <Alert.Root key={a.id} status={a.gravidade === "alta" ? "error" : "warning"}>
                  <Alert.Indicator />
                  <Alert.Content><Alert.Title>{a.titulo}</Alert.Title><Alert.Description>{a.descricao}</Alert.Description></Alert.Content>
                </Alert.Root>
              ))}
            </SectionCard>
            <SectionCard title="Artesãos recém-cadastrados">
              {data.artesaosRecentes.map((a) => (
                <HStack key={a.id} justify="space-between" gap="3">
                  <HStack gap="3"><Image src={a.fotoUrl} alt="" boxSize="10" borderRadius="full" objectFit="cover" /><Box><Text fontWeight="bold" fontSize="sm">{a.nome}</Text><Text textStyle="apoio">{a.cidade}/{a.estado}</Text></Box></HStack>
                  <Link asChild variant="origem" fontSize="sm"><NextLink href={`/artesaos/${a.id}`}>Ver artesão</NextLink></Link>
                </HStack>
              ))}
            </SectionCard>
            <SectionCard title="Produtos pendentes" action={<Link asChild variant="origem" fontSize="sm"><NextLink href="/admin/curadoria">Curadoria →</NextLink></Link>}>
              {data.produtosPendentes.length === 0 && <Text textStyle="apoio">Nenhuma peça aguardando análise.</Text>}
              {data.produtosPendentes.map((p) => (
                <HStack key={p.id} justify="space-between" gap="3">
                  <HStack gap="3"><Image src={p.imagemUrl} alt="" boxSize="10" borderRadius="md" objectFit="cover" /><Box><Text fontWeight="bold" fontSize="sm">{p.titulo}</Text><Text textStyle="apoio">{p.artesaoNome}</Text></Box></HStack>
                  <StatusBadge status={p.status} />
                </HStack>
              ))}
            </SectionCard>
          </Stack>
        </Flex>
      </Stack>
    </AdminShell>
  )
}
