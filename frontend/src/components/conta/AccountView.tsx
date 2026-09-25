"use client"

import NextLink from "next/link"
import { Box, Button, Flex, Grid, HStack, Image, Link, Separator, Stack, Text } from "@chakra-ui/react"
import { BiCreditCard, BiFile, BiLockAlt, BiMapPin, BiPencil, BiPlus, BiTrash } from "react-icons/bi"
import { AccountSidebar } from "@/components/conta/AccountSidebar"
import { AppCheckbox } from "@/components/common/AppCheckbox"
import { FormField } from "@/components/common/FormField"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/common/SectionCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { DataState } from "@/components/feedback/DataState"
import { useApi } from "@/hooks/useApi"
import { minhaContaService } from "@/services/minhaConta.service"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"

// Minha conta (Tela F): dados pessoais, endereço e formas de pagamento (GET /minha-conta)
// e os pedidos mais recentes (GET /minha-conta/pedidos).
export function AccountView() {
  const conta = useApi(() => minhaContaService.buscar(), [])
  const pedidos = useApi(() => minhaContaService.pedidos(), [])
  const usuario = conta.data
  const recentes = pedidos.data?.slice(0, 2) ?? []

  return (
    <PageContainer>
      <PageHeader
        trilha={[{ label: "Home", href: "/" }, { label: "Minha conta" }]}
        titulo="Minha conta"
        subtitulo={usuario ? `Olá, ${usuario.nome.split(" ")[0]}! Aqui você gerencia seus dados, pedidos e preferências.` : undefined}
      />

      <DataState loading={conta.loading} error={conta.error} onRetry={conta.recarregar} vazio={!usuario}>
        {usuario && (
          <Flex gap={10} flexDir={{ base: "column", lg: "row" }} align="flex-start">
            <AccountSidebar activeItem="dados-pessoais" />

            <Stack flex="1" gap={6} align="stretch" minW={0}>
              <SectionCard
                title="Dados pessoais"
                action={
                  <Button variant="ghost" size="sm" color="origem.laranja">
                    <BiPencil /> Editar dados
                  </Button>
                }
              >
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                  <FormField label="Nome completo" value={usuario.nome} readOnly />
                  <FormField label="CPF" value={usuario.cpf} readOnly />
                  <FormField label="Email" value={usuario.email} readOnly />
                  <FormField label="Telefone" value={usuario.telefone} readOnly />
                </Grid>
                <HStack justify="space-between" align="flex-end" gap={4}>
                  <Box flex="1">
                    <FormField label="Senha" type="password" value="obfuscada" readOnly />
                  </Box>
                  <Button variant="ghost" size="sm" color="origem.laranja" flexShrink={0}>
                    <BiLockAlt /> Alterar senha
                  </Button>
                </HStack>
              </SectionCard>

              <SectionCard
                title="Endereço de entrega"
                action={
                  <Button variant="ghost" size="sm" color="origem.laranja">
                    <BiPlus /> Adicionar endereço
                  </Button>
                }
              >
                <HStack align="flex-start" gap={3} bg="origem.fundo" borderRadius="lg" p={4}>
                  <Box color="origem.laranja" mt="2px"><BiMapPin /></Box>
                  <Box>
                    <Text textStyle="rotulo">Endereço principal</Text>
                    <Text textStyle="apoio">
                      {usuario.endereco.rua}, {usuario.endereco.numero}
                      {usuario.endereco.complemento && ` – ${usuario.endereco.complemento}`} · {usuario.endereco.bairro}, {usuario.endereco.cidade}/{usuario.endereco.estado} · CEP {usuario.endereco.cep}
                    </Text>
                  </Box>
                </HStack>
              </SectionCard>

              <SectionCard
                title="Pedidos recentes"
                action={
                  <Link asChild variant="origem" fontSize="sm">
                    <NextLink href="/pedidos">Ver todos →</NextLink>
                  </Link>
                }
              >
                <DataState loading={pedidos.loading} error={pedidos.error} onRetry={pedidos.recarregar} vazio={recentes.length === 0} mensagemVazio="Você ainda não fez nenhum pedido">
                  <Stack gap={4}>
                    {recentes.map((pedido) => (
                      <HStack key={pedido.id} justify="space-between" bg="origem.fundo" borderRadius="lg" p={3} gap={4} flexWrap="wrap">
                        <HStack gap={3}>
                          <Image src={pedido.itens[0]?.imagemUrl} alt={pedido.itens[0]?.titulo} boxSize="48px" borderRadius="md" objectFit="cover" />
                          <Box>
                            <Text textStyle="destaqueLaranja">{pedido.itens[0]?.titulo}</Text>
                            <Text textStyle="apoio">Pedido {pedido.codigo} · {formatDate(pedido.criadoEm)}</Text>
                          </Box>
                        </HStack>
                        <HStack gap={4} wrap="wrap">
                          <StatusBadge status={pedido.status} />
                          <Text fontWeight="bold">{formatCurrency(pedido.total)}</Text>
                          <Button asChild variant="origem" size="sm">
                            <NextLink href="/pedidos">Ver pedido</NextLink>
                          </Button>
                        </HStack>
                      </HStack>
                    ))}
                  </Stack>
                </DataState>
              </SectionCard>

              <SectionCard
                title="Dados de pagamento"
                action={
                  <Button variant="ghost" size="sm" color="origem.laranja">
                    <BiPlus /> Adicionar cartão
                  </Button>
                }
              >
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                  {usuario.formasPagamento.map((forma) => (
                    <HStack key={forma.titulo} bg="origem.fundo" borderRadius="lg" p={4} gap={3}>
                      <Box color="origem.laranja"><BiCreditCard size={20} /></Box>
                      <Box>
                        <Text fontWeight="bold">{forma.titulo}</Text>
                        <Text textStyle="apoio">{forma.detalhe}</Text>
                      </Box>
                    </HStack>
                  ))}
                </Grid>
              </SectionCard>

              <SectionCard title="Preferências">
                <Stack gap={3}>
                  <AppCheckbox defaultChecked>Receber a Newsletter do Origem</AppCheckbox>
                  <AppCheckbox defaultChecked>Avisar quando um artesão que eu sigo publicar uma peça nova</AppCheckbox>
                  <AppCheckbox>Receber atualizações do pedido por WhatsApp</AppCheckbox>
                </Stack>
              </SectionCard>

              <SectionCard
                title="Privacidade"
                action={
                  <Button variant="ghost" size="sm" color="origem.laranja">
                    <BiFile /> Baixar meus dados
                  </Button>
                }
              >
                <Text textStyle="apoio">
                  Veja como tratamos seus dados na Política de Privacidade. Você pode solicitar uma
                  cópia dos seus dados a qualquer momento.
                </Text>

                <Separator borderColor="origem.busca" />

                <Box>
                  <Text textStyle="destaqueLaranja" textTransform="uppercase" mb={1}>
                    Excluir conta
                  </Text>
                  <Text textStyle="apoio" mb={4} maxW="600px">
                    Ao excluir sua conta, seus dados pessoais, endereços e histórico de pedidos serão
                    removidos. Essa ação não poderá ser desfeita.
                  </Text>
                  <HStack gap={4}>
                    <Button variant="perigo"><BiTrash /> Excluir a minha conta</Button>
                    <Link asChild variant="suave">
                      <NextLink href="/">Sair</NextLink>
                    </Link>
                  </HStack>
                </Box>
              </SectionCard>
            </Stack>
          </Flex>
        )}
      </DataState>
    </PageContainer>
  )
}
