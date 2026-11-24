"use client"

import NextLink from "next/link"
import { Alert, Box, Button, Flex, Heading, HStack, SimpleGrid, Stack, Text, VStack } from "@chakra-ui/react"
import { BiReceipt, BiStar } from "react-icons/bi"
import { SectionCard } from "@/components/common/SectionCard"
import { StatCard } from "@/components/common/StatCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { DataState } from "@/components/feedback/DataState"
import { useApi } from "@/hooks/useApi"
import { minhaContaService } from "@/services/minhaConta.service"
import { formatCurrency, splitCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"
import { ArtisanShell } from "./ArtisanShell"
import { CurationNotice } from "./CurationNotice"
import { EducationalDialog } from "./EducationalDialog"
import { Greeting } from "./Greeting"
import { NotificationItem } from "./NotificationItem"

const PEDIDOS_RECENTES = 3

export function ArtisanDashboardView() {
  const painel = useApi(() => minhaContaService.painel(), [])
  const vendas = useApi(() => minhaContaService.vendas(), [])
  const d = painel.data

  return (
    <ArtisanShell ativo="dashboard">
      <DataState loading={painel.loading} error={painel.error} onRetry={painel.recarregar}>
        {d && (
          <Stack gap="8">
            <Box>
              <Greeting />
              <Heading variant="titulo" fontSize="5xl">{d.nome}</Heading>
            </Box>

            {d.status === "emAnalise" && (
              <Alert.Root status="info">
                <Alert.Indicator />
                <Alert.Description>Seu perfil está em análise pela curadoria. Enquanto isso, você já pode cadastrar peças.</Alert.Description>
              </Alert.Root>
            )}
            <CurationNotice status={d.status} parecer={d.parecerCuradoria} item="perfil" />

            <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap="6">
              <StatCard title="PEÇAS PUBLICADAS" subtitle="Disponíveis agora na vitrine do Origem" value={d.publicadas} />
              <StatCard title="PEÇAS VENDIDAS" subtitle="Unidades vendidas nos últimos 7 dias" value={d.vendidasSemana} />
              <StatCard
                title="VENDAS DO MÊS"
                subtitle="Total das suas peças vendidas neste mês"
                value={
                  <HStack justify="center" gap="1" alignItems="baseline">
                    <Text fontSize="2xl">R$</Text>
                    <Text>{splitCurrency(d.vendasMes).inteiro}</Text>
                    <Text fontSize="2xl">,{splitCurrency(d.vendasMes).centavos}</Text>
                  </HStack>
                }
              />
              <StatCard
                title="AVALIAÇÃO"
                subtitle={d.totalAvaliacoes > 0 ? `Média de ${d.totalAvaliacoes} ${d.totalAvaliacoes === 1 ? "avaliação" : "avaliações"}` : "Ainda sem avaliações"}
                value={
                  <HStack justify="center" gap="1" alignItems="center">
                    <Text>{d.avaliacaoMedia === null ? "–" : d.avaliacaoMedia.toLocaleString("pt-BR")}</Text>
                    <BiStar size={32} />
                  </HStack>
                }
              />
            </SimpleGrid>
            <Flex>
              <EducationalDialog />
            </Flex>

            <SimpleGrid columns={{ base: 1, lg: 3 }} gap="6">
              <SectionCard title="NOTIFICAÇÕES">
                {d.notificacoes.length === 0 && <Text textStyle="apoio">Nenhuma notificação por enquanto.</Text>}
                <VStack alignItems="stretch" gap="4">
                  {d.notificacoes.map((n, i) => (
                    <NotificationItem key={`${n.titulo}-${n.data}-${i}`} title={n.titulo} description={<>{n.descricao}<br />{formatDate(n.data)}</>} />
                  ))}
                </VStack>
              </SectionCard>

              <SectionCard title="PEDIDOS RECENTES" action={<Button asChild variant="claro" size="sm" minH="9" px="4"><NextLink href="/artesao/pedidos"><BiReceipt /> Ver pedidos</NextLink></Button>}>
                <DataState loading={vendas.loading} error={vendas.error} onRetry={vendas.recarregar} vazio={vendas.data ? vendas.data.length === 0 : undefined} mensagemVazio="Nenhum pedido ainda">
                  <VStack alignItems="stretch" gap="5">
                    {vendas.data?.slice(0, PEDIDOS_RECENTES).map((v) => (
                      <Box key={v.id}>
                        <Text fontWeight="bold" color="origem.texto" fontSize="sm" mb="1">{v.itens.map((i) => i.titulo).join(", ")}</Text>
                        <Text fontSize="sm" color="origem.textoSuave" mb="1">
                          {v.itens.reduce((s, i) => s + i.quantidade, 0)} {v.itens.reduce((s, i) => s + i.quantidade, 0) === 1 ? "unidade" : "unidades"} - {formatCurrency(v.subtotal)}
                        </Text>
                        <StatusBadge status={v.status} />
                      </Box>
                    ))}
                  </VStack>
                </DataState>
              </SectionCard>

              <SectionCard title="MEU CATÁLOGO">
                <VStack alignItems="stretch" gap="4">
                  <Button asChild variant="origem" w="full"><NextLink href="/artesao/catalogo">Editar catálogo</NextLink></Button>
                  <Button asChild variant="origem" w="full"><NextLink href="/artesao/catalogo/nova">Adicionar nova peça</NextLink></Button>
                  <Button asChild variant="claro" w="full"><NextLink href="/artesao/estoque">Ver estoque</NextLink></Button>
                </VStack>
              </SectionCard>
            </SimpleGrid>
          </Stack>
        )}
      </DataState>
    </ArtisanShell>
  )
}
