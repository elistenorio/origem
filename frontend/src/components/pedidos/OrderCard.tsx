import { Box, Button, Card, Flex, Heading, HStack, Image, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { BiStar, BiX, BiPackage } from "react-icons/bi"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Timeline } from "@/components/common/Timeline"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"
import type { Pedido } from "@/types/pedido"

type OrderCardProps = {
  pedido: Pedido
  onCancelar: () => void
  onAvaliar: () => void
}

const podeCancelar = (p: Pedido) => p.status === "processando" || p.status === "emSeparacao"

// Card de um pedido em "Meus pedidos": itens, status, valores, rastreio, endereço e ações.
export function OrderCard({ pedido, onCancelar, onAvaliar }: OrderCardProps) {
  const [principal] = pedido.itens
  const outros = pedido.itens.length - 1

  return (
    <Card.Root variant="origem">
      <Card.Body gap="6">
        <Flex gap="6" direction={{ base: "column", md: "row" }}>
          <HStack gap="4" align="flex-start" flex="1.2">
            <Image src={principal.imagemUrl} alt={principal.titulo} boxSize="120px" borderRadius="lg" objectFit="cover" flexShrink={0} />
            <Stack gap="1">
              <Heading as="h2" size="2xl">{principal.titulo}{outros > 0 ? ` + ${outros}` : ""}</Heading>
              <Text textStyle="rotulo">Pedido {pedido.codigo} · realizado em {formatDate(pedido.criadoEm)}</Text>
              <Text textStyle="apoio">{principal.artesaoNome}</Text>
            </Stack>
          </HStack>

          <SimpleGrid columns={{ base: 1, sm: 3 }} gap="5" flex="2">
            <Stack gap="3">
              <HStack><Text textStyle="rotulo">Status:</Text><StatusBadge status={pedido.status} /></HStack>
              <Box><Text textStyle="rotulo">Total do pedido</Text><Text>{formatCurrency(pedido.total)}</Text></Box>
              <Box><Text textStyle="rotulo">Entrega</Text><Text>{pedido.frete.modalidade.toUpperCase()} · {pedido.frete.prazo}</Text></Box>
            </Stack>
            <Stack gap="3">
              <Box>
                <Text textStyle="rotulo">Código de rastreamento</Text>
                <Text>{pedido.codigoRastreio ?? "Disponível após o envio"}</Text>
              </Box>
              {pedido.previsaoEntrega && <Box><Text textStyle="rotulo">Previsão de entrega</Text><Text>{formatDate(pedido.previsaoEntrega)}</Text></Box>}
              <Timeline eventos={pedido.eventos.slice(-2)} />
            </Stack>
            <Box>
              <Text textStyle="rotulo">Endereço de entrega</Text>
              <Text fontSize="sm">
                {pedido.comprador.nome}<br />
                {pedido.endereco.rua}, {pedido.endereco.numero} {pedido.endereco.complemento}<br />
                {pedido.endereco.bairro}, {pedido.endereco.cidade}/{pedido.endereco.estado}<br />
                CEP {pedido.endereco.cep}
              </Text>
            </Box>
          </SimpleGrid>
        </Flex>

        {pedido.status === "cancelado" && pedido.motivoCancelamento && (
          <Text textStyle="apoio">Motivo do cancelamento: {pedido.motivoCancelamento}</Text>
        )}

        <Flex gap="3" justify="flex-end" wrap="wrap">
          {pedido.codigoRastreio && pedido.status !== "cancelado" && (
            <Button asChild variant="origem">
              <a href="https://rastreamento.correios.com.br/app/index.php" target="_blank" rel="noreferrer">
                <BiPackage /> Rastrear na transportadora
              </a>
            </Button>
          )}
          {pedido.status === "entregue" && !pedido.avaliado && (
            <Button variant="origem" onClick={onAvaliar}><BiStar /> Avaliar o pedido</Button>
          )}
          {pedido.avaliado && <Text textStyle="apoio" alignSelf="center">Pedido avaliado. Obrigada!</Text>}
          {podeCancelar(pedido) && (
            <Button variant="secundario" onClick={onCancelar}><BiX /> Cancelar o pedido</Button>
          )}
        </Flex>
      </Card.Body>
    </Card.Root>
  )
}
