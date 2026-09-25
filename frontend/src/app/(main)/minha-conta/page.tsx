import NextLink from "next/link"
import { Box, Button, Flex, Grid, HStack, Image, Link, Separator, Stack, Text } from "@chakra-ui/react"
import { BiCreditCard, BiFile, BiLockAlt, BiMapPin, BiPencil, BiPlus, BiTrash } from "react-icons/bi"
import { AccountSidebar } from "@/components/conta/AccountSidebar"
import { AppCheckbox } from "@/components/common/AppCheckbox"
import { FormField } from "@/components/common/FormField"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/common/SectionCard"
import { StatusBadge, type StatusKey } from "@/components/common/StatusBadge"

// Estático por enquanto — entra pela Fake API (GET /api/usuario) numa leva futura.
const usuario = {
  nome: "Ana Beatriz Souza",
  cpf: "***.456.789-**",
  email: "ana.beatriz@email.com",
  telefone: "(81) 99876-5432",
}

const endereco = {
  rotulo: "Casa · Principal",
  linha: "Rua do Bom Jesus, 123 – Apto. 402 · Recife Antigo, Recife/PE · CEP 50030-170",
}

const pedidos: {
  id: string
  titulo: string
  imagemUrl: string
  data: string
  status: StatusKey
  valor: string
}[] = [
  {
    id: "10495",
    titulo: "Jarro Tradicional",
    imagemUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=100&auto=format&fit=crop",
    data: "25/09/2026",
    status: "processando",
    valor: "R$ 335,80",
  },
  {
    id: "10402",
    titulo: "Renda Renascença",
    imagemUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=100&auto=format&fit=crop",
    data: "02/09/2026",
    status: "entregue",
    valor: "R$ 557,00",
  },
]

const formasPagamento = [
  { titulo: "Cartão de crédito final 4821", detalhe: "Visa · vence em 08/2029 · Principal" },
  { titulo: "Pix", detalhe: "Pagamento na hora, sem cadastro" },
]

export default function MinhaContaPage() {
  return (
    <PageContainer>
      <PageHeader
        trilha={[{ label: "Home", href: "/" }, { label: "Minha conta" }]}
        titulo="Minha conta"
        subtitulo={`Olá, ${usuario.nome.split(" ")[0]}! Aqui você gerencia seus dados, pedidos e preferências.`}
      />

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
              <FormField label="Nome completo" defaultValue={usuario.nome} readOnly />
              <FormField label="CPF" defaultValue={usuario.cpf} readOnly />
              <FormField label="Email" defaultValue={usuario.email} readOnly />
              <FormField label="Telefone" defaultValue={usuario.telefone} readOnly />
            </Grid>
            <HStack justify="space-between" align="flex-end" gap={4}>
              <Box flex="1">
                <FormField label="Senha" type="password" defaultValue="obfuscada" readOnly />
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
            <HStack justify="space-between" align="flex-start" bg="origem.fundo" borderRadius="lg" p={4}>
              <HStack align="flex-start" gap={3}>
                <Box color="origem.laranja" mt="2px"><BiMapPin /></Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="origem.texto" textTransform="uppercase">
                    {endereco.rotulo}
                  </Text>
                  <Text fontSize="sm" color="origem.textoSuave">{endereco.linha}</Text>
                </Box>
              </HStack>
              <Link color="origem.laranja" fontSize="sm" fontWeight="medium">Editar</Link>
            </HStack>
          </SectionCard>

          <SectionCard
            title="Pedidos recentes"
            action={
              <Link asChild color="origem.laranja" fontSize="sm" fontWeight="medium">
                <NextLink href="/minha-conta/pedidos">Ver todos →</NextLink>
              </Link>
            }
          >
            <Stack gap={4}>
              {pedidos.map((pedido) => (
                <HStack key={pedido.id} justify="space-between" bg="origem.fundo" borderRadius="lg" p={3} gap={4} flexWrap="wrap">
                  <HStack gap={3}>
                    <Image src={pedido.imagemUrl} alt={pedido.titulo} boxSize="48px" borderRadius="md" objectFit="cover" />
                    <Box>
                      <Text fontWeight="bold" color="origem.laranja" fontSize="sm">{pedido.titulo}</Text>
                      <Text fontSize="xs" color="origem.textoSuave">Pedido #{pedido.id} · {pedido.data}</Text>
                    </Box>
                  </HStack>
                  <HStack gap={4}>
                    <StatusBadge status={pedido.status} />
                    <Text fontWeight="bold" color="origem.texto" fontSize="sm">{pedido.valor}</Text>
                    <Button variant="origem" size="sm">Ver pedido</Button>
                  </HStack>
                </HStack>
              ))}
            </Stack>
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
              {formasPagamento.map((forma) => (
                <HStack key={forma.titulo} bg="origem.fundo" borderRadius="lg" p={4} gap={3}>
                  <Box color="origem.laranja"><BiCreditCard size={20} /></Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="origem.texto">{forma.titulo}</Text>
                    <Text fontSize="xs" color="origem.textoSuave">{forma.detalhe}</Text>
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
            <Text fontSize="sm" color="origem.textoSuave">
              Veja como tratamos seus dados na Política de Privacidade. Você pode solicitar uma
              cópia dos seus dados a qualquer momento.
            </Text>

            <Separator borderColor="origem.busca" />

            <Box>
              <Text fontWeight="bold" color="origem.laranja" textTransform="uppercase" fontSize="sm" mb={1}>
                Excluir conta
              </Text>
              <Text fontSize="sm" color="origem.textoSuave" mb={4} maxW="600px">
                Ao excluir sua conta, seus dados pessoais, endereços e histórico de pedidos serão
                removidos. Essa ação não poderá ser desfeita.
              </Text>
              <HStack gap={4}>
                <Button variant="perigo"><BiTrash /> Excluir a minha conta</Button>
                <Link color="origem.perigo" fontWeight="medium">Sair</Link>
              </HStack>
            </Box>
          </SectionCard>
        </Stack>
      </Flex>
    </PageContainer>
  )
}
