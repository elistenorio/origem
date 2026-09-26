"use client"

import { useState, useSyncExternalStore } from "react"
import NextLink from "next/link"
import { Alert, Button, Flex, SimpleGrid, Stack } from "@chakra-ui/react"
import { BiCheck } from "react-icons/bi"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/common/SectionCard"
import { FormField } from "@/components/common/FormField"
import { SelectField } from "@/components/common/SelectField"
import { EmptyMessage } from "@/components/feedback/EmptyMessage"
import { LoadingState } from "@/components/feedback/LoadingState"
import { OrderSummary } from "@/components/carrinho/OrderSummary"
import { ApiError } from "@/services/api"
import { pedidosService } from "@/services/pedidos.service"
import { useCartStore } from "@/store/cartStore"
import { useOrdersStore } from "@/store/ordersStore"
import { validateCheckout } from "@/utils/validateCheckout"
import { ESTADOS } from "@/constants/regioes"
import type { DadosCheckout, ErrosCheckout } from "@/types/checkout"
import { CheckoutSteps } from "./CheckoutSteps"
import { PaymentFields } from "./PaymentFields"
import { LoginPromptDialog } from "./LoginPromptDialog"
import { OrderPlacedDialog, type PedidoRealizado } from "./OrderPlacedDialog"

const INICIAL: DadosCheckout = {
  nome: "", cpf: "", email: "", telefone: "",
  cep: "", rua: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "",
  pagamento: "cartao", parcelas: "1", numeroCartao: "", nomeCartao: "", validade: "", cvv: "",
}

// Checkout (Tela 07): identificação, endereço, pagamento e resumo.
// Itens e frete vêm do cartStore; "Finalizar compra" cria o pedido em POST /pedidos.
export function CheckoutView() {
  const itens = useCartStore((state) => state.items)
  const frete = useCartStore((state) => state.frete)
  const subtotal = useCartStore((state) => state.totalPrice())
  const quantidade = useCartStore((state) => state.totalItems())
  const clearCart = useCartStore((state) => state.clearCart)
  const addOrder = useOrdersStore((state) => state.addOrder)
  const [dados, setDados] = useState<DadosCheckout>(INICIAL)
  const [erros, setErros] = useState<ErrosCheckout>({})
  const [pedidoCriado, setPedidoCriado] = useState<PedidoRealizado | null>(null)
  const [convidarLogin, setConvidarLogin] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState<string>()

  // O carrinho fica salvo no navegador; até a tela abrir nele, mostra "carregando" (evita erro de hidratação).
  const noNavegador = useSyncExternalStore(() => () => {}, () => true, () => false)

  const alterar = <K extends keyof DadosCheckout>(campo: K, valor: DadosCheckout[K]) => setDados((d) => ({ ...d, [campo]: valor }))
  // props prontas para um campo de texto (valor, onChange e erro)
  const campo = (nome: Exclude<keyof DadosCheckout, "pagamento">) => ({
    value: dados[nome],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => alterar(nome, e.target.value),
    error: erros[nome],
  })

  async function handleFinalizar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const encontrados = validateCheckout(dados)
    setErros(encontrados)
    if (Object.keys(encontrados).length > 0 || !frete) return

    setEnviando(true)
    setErroEnvio(undefined)
    try {
      // Os dados do cartão não são enviados na Avaliação 1.
      const pedido = await pedidosService.criar({
        itens: itens.map((item) => ({ produtoId: item.produto.id, quantidade: item.quantidade })),
        comprador: { nome: dados.nome, cpf: dados.cpf, email: dados.email, telefone: dados.telefone },
        endereco: { cep: dados.cep, rua: dados.rua, numero: dados.numero, complemento: dados.complemento, bairro: dados.bairro, cidade: dados.cidade, estado: dados.estado },
        frete,
        pagamento: dados.pagamento,
        parcelas: Number(dados.parcelas),
      })
      addOrder(pedido) // para "Meus pedidos" mostrar o pedido mesmo no deploy (ver store/ordersStore.ts)
      setPedidoCriado({ nome: pedido.comprador.nome, codigo: pedido.codigo, total: pedido.total })
      clearCart()
    } catch (erro) {
      setErroEnvio(erro instanceof ApiError ? erro.message : "Não foi possível finalizar a compra.")
    } finally {
      setEnviando(false)
    }
  }

  if (!noNavegador) return <PageContainer><LoadingState /></PageContainer>

  if (itens.length === 0 && !pedidoCriado) {
    return (
      <PageContainer>
        <EmptyMessage titulo="Seu carrinho está vazio" descricao="Adicione peças ao carrinho para finalizar a compra.">
          <Button asChild variant="origem"><NextLink href="/catalogo">Ir para o catálogo</NextLink></Button>
        </EmptyMessage>
      </PageContainer>
    )
  }

  // Chegou ao checkout sem escolher o frete no carrinho (ex.: digitou o endereço direto).
  if (!frete && !pedidoCriado) {
    return (
      <PageContainer>
        <EmptyMessage titulo="Calcule o frete para continuar" descricao="Volte ao carrinho, informe o CEP e escolha a forma de envio.">
          <Button asChild variant="origem"><NextLink href="/carrinho">Voltar ao carrinho</NextLink></Button>
        </EmptyMessage>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader trilha={[{ label: "Home", href: "/" }, { label: "Carrinho", href: "/carrinho" }, { label: "Pagamento" }]} titulo="Finalizar compra" />
      <CheckoutSteps atual={pedidoCriado ? 2 : 1} />

      <form onSubmit={handleFinalizar} noValidate>
        <Flex gap="6" direction={{ base: "column", lg: "row" }} align="flex-start">
          <Stack flex="1" gap="6" w="full">
            <SectionCard title="Identificação">
              <FormField label="Nome completo" autoComplete="name" {...campo("nome")} />
              <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
                <FormField label="CPF" inputMode="numeric" placeholder="000.000.000-00" {...campo("cpf")} />
                <FormField label="Telefone" inputMode="tel" placeholder="(DDD) 00000-0000" autoComplete="tel" {...campo("telefone")} />
              </SimpleGrid>
              <FormField label="E-mail" type="email" placeholder="email@exemplo.com" autoComplete="email" {...campo("email")} />
            </SectionCard>
            <SectionCard title="Endereço de entrega">
              <SimpleGrid columns={{ base: 1, md: 3 }} gap="4">
                <FormField label="CEP" inputMode="numeric" placeholder="00000-000" autoComplete="postal-code" {...campo("cep")} />
                <FormField label="Rua" autoComplete="address-line1" {...campo("rua")} />
                <FormField label="Número" {...campo("numero")} />
              </SimpleGrid>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
                <FormField label="Complemento" placeholder="Bloco, apto." {...campo("complemento")} />
                <FormField label="Bairro" {...campo("bairro")} />
              </SimpleGrid>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
                <FormField label="Cidade" autoComplete="address-level2" {...campo("cidade")} />
                <SelectField label="Estado" options={[{ value: "", label: "UF" }, ...ESTADOS]} value={dados.estado} onChange={(v) => alterar("estado", v)} error={erros.estado} />
              </SimpleGrid>
            </SectionCard>
          </Stack>

          <Stack w={{ base: "full", lg: "420px" }} gap="6" flexShrink={0}>
            <SectionCard title="Forma de pagamento">
              <PaymentFields dados={dados} erros={erros} total={subtotal + (frete?.valor ?? 0)} onChange={alterar} />
            </SectionCard>
            <OrderSummary quantidade={quantidade} subtotal={subtotal} frete={frete}>
              {Object.keys(erros).length > 0 && (
                <Alert.Root status="warning">
                  <Alert.Indicator />
                  <Alert.Title>Revise os campos destacados.</Alert.Title>
                </Alert.Root>
              )}
              {erroEnvio && (
                <Alert.Root status="error">
                  <Alert.Indicator />
                  <Alert.Title>{erroEnvio}</Alert.Title>
                </Alert.Root>
              )}
              <Button type="submit" variant="origem" w="full" disabled={!!pedidoCriado} loading={enviando}>
                <BiCheck /> Finalizar compra
              </Button>
            </OrderSummary>
          </Stack>
        </Flex>
      </form>

      <LoginPromptDialog open={convidarLogin && !pedidoCriado} onClose={() => setConvidarLogin(false)} />
      <OrderPlacedDialog pedido={pedidoCriado} onClose={() => setPedidoCriado(null)} />
    </PageContainer>
  )
}
