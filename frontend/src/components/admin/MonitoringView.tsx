"use client"

import NextLink from "next/link"
import { Alert, Card, Flex, HStack, Link, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { SectionCard } from "@/components/common/SectionCard"
import { AvatarItem } from "@/components/common/AvatarItem"
import { StatusBadge } from "@/components/common/StatusBadge"
import { DataState } from "@/components/feedback/DataState"
import { StatCard } from "@/components/common/StatCard"
import { PanelPageHeader } from "@/components/layout/PanelPageHeader"
import { useApi } from "@/hooks/useApi"
import { adminService } from "@/services/admin.service"
import { formatDateTime } from "@/utils/formatDate"
import { AdminShell } from "./AdminShell"
import { OrdersSection } from "./OrdersSection"

// Acompanhamento (Tela 07 admin): pedidos por status, andamento dos pedidos, alertas e filas.
export function MonitoringView() {
  const { data, loading, error, recarregar } = useApi(() => adminService.acompanhamento(), [])

  return (
    <AdminShell ativo="acompanhamento">
      <PanelPageHeader titulo="Acompanhamento" descricao="Acompanhe pedidos, novos artesãos e produtos pendentes." />
      <Stack gap="8">
        <DataState loading={loading && !data} error={error} onRetry={recarregar}>
          {data && (
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap="4">
              <StatCard title="EM PROCESSAMENTO" subtitle="Pagos, aguardando envio" value={data.contagem.processando} />
              <StatCard title="ENVIADOS" subtitle="A caminho do cliente" value={data.contagem.enviado} />
              <StatCard title="ENTREGUES" subtitle="Já recebidos pelo cliente" value={data.contagem.entregue} />
              <StatCard title="CANCELADOS" subtitle="Cancelados antes do envio" value={data.contagem.cancelado} />
            </SimpleGrid>
          )}
        </DataState>

        <Flex gap="6" direction={{ base: "column", xl: "row" }} align="flex-start">
          <Stack flex="1" gap="6" w="full" minW="0">
            <OrdersSection onAtualizado={recarregar} />
            {data && (
              <SectionCard title="Atividades recentes">
                {data.atividades.length === 0 && <Text textStyle="apoio">Nenhuma atividade registrada.</Text>}
                {data.atividades.map((a) => (
                  <Card.Root key={a.id} variant="item">
                    <Card.Body><Card.Title>{a.autor} {a.descricao}</Card.Title><Card.Description>{formatDateTime(a.data)}</Card.Description></Card.Body>
                  </Card.Root>
                ))}
              </SectionCard>
            )}
          </Stack>

          {data && (
            <Stack w={{ base: "full", xl: "380px" }} gap="6" flexShrink={0}>
              <SectionCard title="Alertas e pendências">
                {data.alertas.length === 0 && <Text textStyle="apoio">Nenhum alerta no momento.</Text>}
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
                    <AvatarItem src={a.fotoUrl} titulo={a.nome} subtitulo={`${a.cidade}/${a.estado}`} formato="redondo" />
                    {a.status === "publicado" ? (
                      <Link asChild variant="origem" fontSize="sm"><NextLink href={`/artesaos/${a.id}`}>Ver artesão</NextLink></Link>
                    ) : (
                      <Link asChild variant="origem" fontSize="sm"><NextLink href="/admin/curadoria">Curadoria →</NextLink></Link>
                    )}
                  </HStack>
                ))}
              </SectionCard>
              <SectionCard title="Produtos pendentes" action={<Link asChild variant="origem" fontSize="sm"><NextLink href="/admin/curadoria">Curadoria →</NextLink></Link>}>
                {data.produtosPendentes.length === 0 && <Text textStyle="apoio">Nenhuma peça aguardando análise.</Text>}
                {data.produtosPendentes.map((p) => (
                  <HStack key={p.id} justify="space-between" gap="3">
                    <AvatarItem src={p.imagemUrl} titulo={p.titulo} subtitulo={p.artesaoNome} />
                    <StatusBadge status={p.status} />
                  </HStack>
                ))}
              </SectionCard>
            </Stack>
          )}
        </Flex>
      </Stack>
    </AdminShell>
  )
}
