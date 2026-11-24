"use client"

import { useState } from "react"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import { Box, Button, Flex, Grid, Heading, HStack, IconButton, Image, Link, Separator, Stack, Text } from "@chakra-ui/react"
import { BiCreditCard, BiFile, BiLockAlt, BiMapPin, BiPencil, BiPlus, BiTrash } from "react-icons/bi"
import { AccountSidebar } from "@/components/conta/AccountSidebar"
import { LogoutLink } from "@/components/autenticacao/LogoutLink"
import { AppCheckbox } from "@/components/common/AppCheckbox"
import { FormField } from "@/components/common/FormField"
import { PageBreadcrumb } from "@/components/common/PageBreadcrumb"
import { SectionCard } from "@/components/common/SectionCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { DataState } from "@/components/feedback/DataState"
import { useApi } from "@/hooks/useApi"
import { useEnvio } from "@/hooks/useEnvio"
import { useSessao } from "@/hooks/useSessao"
import { minhaContaService } from "@/services/minhaConta.service"
import { baixarJson } from "@/utils/baixarJson"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"
import type { MinhaConta, Preferencias } from "@/types/usuario"
import { AddressDialog, CardDialog, DeleteAccountDialog, PasswordDialog, PersonalDataDialog } from "./AccountDialogs"

type Janela = "dados" | "endereco" | "senha" | "cartao" | "excluir" | null

const PREFERENCIAS: { campo: keyof Preferencias; texto: string }[] = [
  { campo: "newsletter", texto: "Receber a Newsletter do Origem" },
  { campo: "novidadesArtesaos", texto: "Avisar quando um artesão que eu sigo publicar uma peça nova" },
  { campo: "whatsapp", texto: "Receber atualizações do pedido por WhatsApp" },
]

const formatarCep = (cep: string) => cep.replace(/^(\d{5})(\d{3})$/, "$1-$2")

// Minha conta: dados de GET /minha-conta e os 2 pedidos mais recentes de GET /minha-conta/pedidos.
export function AccountView() {
  const router = useRouter()
  const { sair } = useSessao()
  const { data, loading, error, recarregar } = useApi(() => minhaContaService.buscar(), [])
  const { data: pedidos } = useApi(() => minhaContaService.pedidos(), [])
  const [atualizada, setAtualizada] = useState<MinhaConta>()
  const [janela, setJanela] = useState<Janela>(null)
  const acoes = useEnvio("Não foi possível salvar.")
  const usuario = atualizada ?? data
  const fechar = () => setJanela(null)

  async function alternarPreferencia(campo: keyof Preferencias, valor: boolean) {
    if (!usuario) return
    await acoes.enviar(async () => setAtualizada(await minhaContaService.salvarPreferencias({ ...usuario.preferencias, [campo]: valor })))
  }

  async function removerCartao(indice: number) {
    await acoes.enviar(async () => setAtualizada(await minhaContaService.removerCartao(indice)))
  }

  async function contaExcluida() {
    await sair()
    router.push("/")
  }

  const endereco = usuario?.endereco
  const temEndereco = !!endereco?.cep

  return (
    <Box maxW="7xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Minha conta" }]} />

      <DataState loading={loading && !usuario} error={error} onRetry={recarregar}>
        {usuario && endereco && (
          <>
            <Box mt={6} mb={8}>
              <Heading as="h1" variant="titulo" fontSize={{ base: "3xl", md: "4xl" }} mb={2}>Minha conta</Heading>
              <Text color="origem.texto">Olá, {usuario.nome.split(" ")[0]}! Aqui você gerencia seus dados, pedidos e preferências.</Text>
            </Box>

            <Flex gap={10} flexDir={{ base: "column", lg: "row" }} align="flex-start">
              <AccountSidebar activeItem="dados-pessoais" />

              <Stack flex="1" gap={6} align="stretch" minW={0}>
                {acoes.erro && <Text color="origem.perigo" fontSize="sm" role="alert">{acoes.erro}</Text>}

                <SectionCard title="Dados pessoais" id="dados-pessoais" scrollMarginTop="6" action={<Button variant="ghost" size="sm" color="origem.laranja" onClick={() => setJanela("dados")}><BiPencil /> Editar dados</Button>}>
                  <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                    <FormField label="Nome completo" value={usuario.nome} readOnly />
                    <FormField label="CPF" value={usuario.cpf} readOnly />
                    <FormField label="Email" value={usuario.email} readOnly />
                    <FormField label="Telefone" value={usuario.telefone} readOnly />
                  </Grid>
                  <HStack justify="space-between" align="flex-end" gap={4}>
                    <Box flex="1"><FormField label="Senha" type="password" value="********" readOnly /></Box>
                    <Button variant="ghost" size="sm" color="origem.laranja" flexShrink={0} onClick={() => setJanela("senha")}><BiLockAlt /> Alterar senha</Button>
                  </HStack>
                </SectionCard>

                <SectionCard title="Endereço de entrega" id="endereco" scrollMarginTop="6" action={
                  <Button variant="ghost" size="sm" color="origem.laranja" onClick={() => setJanela("endereco")}>
                    {temEndereco ? <><BiPencil /> Editar endereço</> : <><BiPlus /> Adicionar endereço</>}
                  </Button>
                }>
                  {temEndereco ? (
                    <HStack align="flex-start" gap={3} bg="origem.fundo" borderRadius="lg" p={4}>
                      <Box color="origem.laranja" mt="2px"><BiMapPin /></Box>
                      <Text fontSize="sm" color="origem.textoSuave">
                        {endereco.rua}, {endereco.numero}{endereco.complemento && ` – ${endereco.complemento}`} · {endereco.bairro}, {endereco.cidade}/{endereco.estado} · CEP {formatarCep(endereco.cep)}
                      </Text>
                    </HStack>
                  ) : (
                    <Text textStyle="apoio">Nenhum endereço salvo.</Text>
                  )}
                </SectionCard>

                <SectionCard title="Pedidos recentes" id="pedidos" scrollMarginTop="6" action={<Link asChild color="origem.laranja" fontSize="sm" fontWeight="medium"><NextLink href="/pedidos">Ver todos →</NextLink></Link>}>
                  {pedidos && pedidos.length === 0 && <Text textStyle="apoio">Você ainda não fez nenhum pedido.</Text>}
                  <Stack gap={4}>
                    {(pedidos ?? []).slice(0, 2).map((pedido) => (
                      <HStack key={pedido.id} justify="space-between" bg="origem.fundo" borderRadius="lg" p={3} gap={4} flexWrap="wrap">
                        <HStack gap={3}>
                          <Image src={pedido.itens[0].imagemUrl} alt={pedido.itens[0].titulo} boxSize="48px" borderRadius="md" objectFit="cover" />
                          <Box>
                            <Text fontWeight="bold" color="origem.laranja" fontSize="sm">{pedido.itens[0].titulo}</Text>
                            <Text fontSize="xs" color="origem.textoSuave">Pedido {pedido.codigo} · {formatDate(pedido.criadoEm)}</Text>
                          </Box>
                        </HStack>
                        <HStack gap={4} flexWrap="wrap">
                          <StatusBadge status={pedido.status} />
                          <Text fontWeight="bold" color="origem.texto" fontSize="sm">{formatCurrency(pedido.total)}</Text>
                          <Button asChild variant="origem" size="sm"><NextLink href="/pedidos">Ver pedido</NextLink></Button>
                        </HStack>
                      </HStack>
                    ))}
                  </Stack>
                </SectionCard>

                <SectionCard title="Dados de pagamento" id="pagamento" scrollMarginTop="6" action={<Button variant="ghost" size="sm" color="origem.laranja" onClick={() => setJanela("cartao")}><BiPlus /> Adicionar cartão</Button>}>
                  {usuario.formasPagamento.length === 0 && <Text textStyle="apoio">Nenhuma forma de pagamento salva.</Text>}
                  <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                    {usuario.formasPagamento.map((forma, indice) => (
                      <HStack key={`${forma.titulo}-${forma.detalhe}-${indice}`} bg="origem.fundo" borderRadius="lg" p={4} gap={3} justify="space-between">
                        <HStack gap={3}>
                          <Box color="origem.laranja"><BiCreditCard size={20} /></Box>
                          <Box>
                            <Text fontWeight="bold" fontSize="sm" color="origem.texto">{forma.titulo}</Text>
                            <Text fontSize="xs" color="origem.textoSuave">{forma.detalhe}</Text>
                          </Box>
                        </HStack>
                        <IconButton aria-label={`Remover ${forma.titulo} ${forma.detalhe}`} variant="ghost" size="sm" onClick={() => removerCartao(indice)}><BiTrash /></IconButton>
                      </HStack>
                    ))}
                  </Grid>
                </SectionCard>

                <SectionCard title="Preferências" id="preferencias" scrollMarginTop="6">
                  <Stack gap={3}>
                    {PREFERENCIAS.map(({ campo, texto }) => (
                      <AppCheckbox key={campo} checked={usuario.preferencias[campo]} disabled={acoes.enviando} onCheckedChange={(e) => alternarPreferencia(campo, e.checked === true)}>
                        {texto}
                      </AppCheckbox>
                    ))}
                  </Stack>
                </SectionCard>

                <SectionCard title="Privacidade" id="privacidade" scrollMarginTop="6" action={
                  <Button variant="ghost" size="sm" color="origem.laranja" onClick={() => baixarJson("meus-dados-origem.json", { conta: usuario, pedidos: pedidos ?? [] })}>
                    <BiFile /> Baixar meus dados
                  </Button>
                }>
                  <Text fontSize="sm" color="origem.textoSuave">
                    Veja como tratamos seus dados na Política de Privacidade. Você pode baixar uma cópia dos seus dados a qualquer momento.
                  </Text>
                  <Separator borderColor="origem.busca" />
                  <Box>
                    <Text fontWeight="bold" color="origem.laranja" textTransform="uppercase" fontSize="sm" mb={1}>Excluir conta</Text>
                    <Text fontSize="sm" color="origem.textoSuave" mb={4} maxW="600px">
                      Ao excluir sua conta, seus dados pessoais, endereço e formas de pagamento serão apagados. Essa ação não poderá ser desfeita.
                    </Text>
                    <HStack gap={4}>
                      <Button variant="perigo" onClick={() => setJanela("excluir")}>Excluir a minha conta</Button>
                      <LogoutLink color="origem.perigo" fontWeight="medium" />
                    </HStack>
                  </Box>
                </SectionCard>
              </Stack>
            </Flex>

            {janela === "dados" && <PersonalDataDialog open onClose={fechar} conta={usuario} onSalvo={setAtualizada} />}
            {janela === "endereco" && <AddressDialog open onClose={fechar} conta={usuario} onSalvo={setAtualizada} />}
            {janela === "senha" && <PasswordDialog open onClose={fechar} />}
            {janela === "cartao" && <CardDialog open onClose={fechar} onSalvo={setAtualizada} />}
            {janela === "excluir" && <DeleteAccountDialog open onClose={fechar} onExcluida={contaExcluida} />}
          </>
        )}
      </DataState>
    </Box>
  )
}
