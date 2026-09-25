"use client"

import { useState } from "react"
import { Box, Flex, Grid, Heading, HStack, Text, VStack, Button, Separator, Badge, Image, Link } from "@chakra-ui/react"
import NextLink from "next/link"
import { useParams, useRouter } from "next/navigation"
import { BiSearch } from "react-icons/bi"
import { ProductGrid } from "@/components/inicio/ProductGrid"
import { FaqAccordion } from "@/components/common/FaqAccordion"
import { FreightCalculator } from "@/components/common/FreightCalculator"
import { QuantityStepper } from "@/components/common/QuantityStepper"
import { DataState } from "@/components/feedback/DataState"
import { CATEGORIAS } from "@/constants/categorias"
import { MATERIAIS } from "@/constants/materiais"
import { TECNICAS } from "@/constants/tecnicas"
import { useApi } from "@/hooks/useApi"
import { artesaosService } from "@/services/artesaos.service"
import { produtosService } from "@/services/produtos.service"
import { useCartStore } from "@/store/cartStore"
import { formatCurrency } from "@/utils/formatCurrency"

// A peça guarda ids ("modelagem-manual"); a ficha técnica mostra o texto ("Modelagem manual").
const rotulo = (opcoes: { value: string; label: string }[], valor: string) => opcoes.find((o) => o.value === valor)?.label ?? valor

// Detalhe da peça (/produtos/{id}): dados de GET /produtos/{id}, do artesão e das peças relacionadas.
export default function ProdutoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const [quantidade, setQuantidade] = useState(1)
  const [adicionado, setAdicionado] = useState(false)

  const { data: produto, loading, error, recarregar } = useApi(() => produtosService.buscarPorId(id), [id])
  const { data: relacionados, loading: carregandoRelacionados, error: erroRelacionados, recarregar: recarregarRelacionados } =
    useApi(() => produtosService.relacionados(id), [id])
  // "Sobre o artesão": só aparece se o perfil estiver publicado (senão a API responde 404 e a seção mostra só o nome).
  const artesaoId = produto?.artesaoId
  const { data: artesao } = useApi(async () => (artesaoId ? artesaosService.buscarPorId(artesaoId) : undefined), [artesaoId])

  const esgotado = (produto?.estoque ?? 0) <= 0

  function adicionarAoCarrinho() {
    if (!produto) return
    addItem(produto, quantidade)
    setAdicionado(true)
  }

  function comprarAgora() {
    if (!produto) return
    addItem(produto, quantidade)
    router.push("/carrinho")
  }

  return (
    <Box maxW="container.xl" mx="auto" p={{ base: 4, md: 8 }} mt={4}>
      {/* 404 não tem "tentar de novo": a peça não existe ou não está publicada */}
      <DataState loading={loading} error={error} onRetry={error?.status === 404 ? undefined : recarregar}>
        {produto && (
          <>
            {/* Top Section: Images and Actions */}
            <Flex flexDir={{ base: "column", lg: "row" }} gap={10} mb={16}>

              {/* Left: Product Images */}
              <Flex gap={4} flex="1">
                <VStack gap={4}>
                  {produto.imagens.map((url, i) => (
                    <Box key={url} w="80px" h="80px" borderRadius="md" overflow="hidden" borderWidth={i === 0 ? "2px" : "0"} borderColor="origem.laranja">
                      <Image src={url} alt={`Foto ${i + 1} de ${produto.titulo}`} w="full" h="full" objectFit="cover" />
                    </Box>
                  ))}
                </VStack>
                <Box flex="1" borderRadius="2xl" overflow="hidden" position="relative" h={{ base: "400px", md: "500px" }}>
                  <Image src={produto.imagemUrl} alt={produto.titulo} w="full" h="full" objectFit="cover" />
                  <Box position="absolute" bottom={4} right={4} bg="white" p={2} borderRadius="full" cursor="pointer" color="origem.texto">
                    <BiSearch size={20} />
                  </Box>
                </Box>
              </Flex>

              {/* Right: Product Actions */}
              <VStack flex="1" align="stretch" gap={6} maxW={{ lg: "450px" }}>

                <Box>
                  <HStack gap={2} mb={3} wrap="wrap">
                    {produto.tags.map((tag) => (
                      <Badge key={tag} variant="origem">{tag.toUpperCase()}</Badge>
                    ))}
                  </HStack>
                  <Heading variant="titulo" fontSize="5xl" lineHeight="1" mb={2}>{produto.titulo}</Heading>
                  <Text color="origem.texto" fontWeight="bold" textTransform="uppercase" fontSize="sm">
                    {produto.artesaoNome}, {produto.cidade}
                  </Text>
                </Box>

                <Text color="origem.texto" fontSize="4xl" mt={2}>
                  {formatCurrency(produto.preco)}
                </Text>

                <Separator borderColor="origem.passoFundo" />

                <Box>
                  <Text color="origem.texto" fontWeight="bold" fontSize="sm" mb={1}>Disponibilidade</Text>
                  <Text color="origem.textoSuave" fontSize="sm">
                    {esgotado ? "Esgotado" : `Estoque: ${produto.estoque} ${produto.estoque === 1 ? "unidade" : "unidades"}`}
                  </Text>
                </Box>

                {!esgotado && (
                  <Box>
                    <Text color="origem.texto" fontWeight="bold" fontSize="sm" mb={1}>Quantidade</Text>
                    <QuantityStepper value={quantidade} onChange={setQuantidade} max={produto.estoque} />
                  </Box>
                )}

                <FreightCalculator />

                <Box bg="origem.passoFundo" p={4} borderRadius="md">
                  <Text fontWeight="bold" fontSize="sm" mb={2}>Formas de pagamento</Text>
                  <Grid templateColumns="1fr 1fr" gap={4}>
                    <Text fontSize="xs">Cartão de crédito<br/><strong>Até 12x sem juros</strong></Text>
                    <Text fontSize="xs">Pix<br/><strong>5% de desconto</strong></Text>
                  </Grid>
                </Box>

                <HStack gap={4} mt={2}>
                  <Button variant="origem" flex="1" onClick={comprarAgora} disabled={esgotado}>Comprar agora</Button>
                  <Button variant="origem" flex="1" onClick={adicionarAoCarrinho} disabled={esgotado}>Adicionar ao carrinho</Button>
                </HStack>

                {adicionado && (
                  <Text fontSize="sm" color="origem.texto" role="status">
                    Peça adicionada ao carrinho.{" "}
                    <Link asChild color="origem.laranja" textDecoration="underline">
                      <NextLink href="/carrinho">Ver carrinho</NextLink>
                    </Link>
                  </Text>
                )}

              </VStack>
            </Flex>

            {/* Middle Section: Details and Text */}
            <Flex flexDir={{ base: "column", lg: "row" }} gap={10} mb={20}>
              <VStack flex="1" align="stretch" gap={10} maxW="800px">

                <Box>
                  <Text fontWeight="bold" fontSize="sm" mb={2}>SOBRE A PEÇA</Text>
                  <Text fontSize="sm" color="origem.texto" mb={4}>
                    {produto.descricao}
                  </Text>
                  <Text fontWeight="bold" fontSize="sm" mb={1}>Ficha Técnica</Text>
                  <Text fontSize="sm" color="origem.texto" lineHeight="1.8">
                    Categoria: {rotulo(CATEGORIAS, produto.categoria)}<br/>
                    Material: {rotulo(MATERIAIS, produto.material)}<br/>
                    Técnica: {rotulo(TECNICAS, produto.tecnica)}<br/>
                    Dimensões: {produto.medidas}<br/>
                    Origem: {produto.cidade}, Pernambuco
                    {produto.pecaUnica && <><br/>Peça única</>}
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" fontSize="sm" mb={2}>SOBRE O ARTESÃO</Text>
                  <Heading color="origem.laranja" variant="titulo" fontSize="3xl" mb={2}>{produto.artesaoNome}</Heading>
                  {artesao && (
                    <>
                      <Text fontSize="sm" color="origem.texto" mb={4}>
                        {artesao.bio}
                      </Text>
                      <Link asChild color="origem.laranja" fontSize="sm" textDecoration="underline">
                        <NextLink href={`/artesaos/${artesao.id}`}>Conheça mais sobre {artesao.nome} →</NextLink>
                      </Link>
                    </>
                  )}
                </Box>

                <Box>
                  <Text fontWeight="bold" fontSize="sm" mb={2}>CUIDADOS COM A PEÇA</Text>
                  <Text fontSize="sm" color="origem.texto" mb={2}>
                    {produto.cuidados}
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" fontSize="sm" mb={4}>ENTREGA</Text>

                  <Text fontWeight="bold" fontSize="sm">Prazo de envio</Text>
                  <Text fontSize="sm" color="origem.texto" mb={4}>
                    Após a confirmação de pagamento, o pedido será preparado e enviado
                    em até 3 dias úteis. O prazo de entrega varia de acordo com a localização.
                  </Text>

                  <Text fontWeight="bold" fontSize="sm">Embalagem</Text>
                  <Text fontSize="sm" color="origem.texto" mb={4}>
                    As peças são embaladas cuidadosamente para não sofrer danos
                    durante o transporte. Por serem feitas de produtos artesanais...
                  </Text>

                  <Text fontWeight="bold" fontSize="sm">Acompanhamento</Text>
                  <Text fontSize="sm" color="origem.texto" mb={4}>
                    Após o envio, você receberá o código de rastreamento por e-mail para acompanhar a entrega.
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" fontSize="sm" mb={4}>TROCAS E DEVOLUÇÕES</Text>
                  <FaqAccordion
                    items={["Política de troca e devolução", "Política de entrega", "Política de pagamento", "Dúvidas sobre sua compra?"].map((item) => ({
                      question: item,
                      answer: `Detalhes sobre ${item.toLowerCase()}...`,
                    }))}
                  />
                </Box>
              </VStack>
            </Flex>

            {/* Bottom Section: Related Products */}
            <Box mb={10}>
              <Text fontWeight="bold" fontSize="lg" mb={6} textTransform="uppercase">PEÇAS RELACIONADAS</Text>
              <DataState loading={carregandoRelacionados} error={erroRelacionados} onRetry={recarregarRelacionados} vazio={relacionados?.length === 0} mensagemVazio="Nenhuma peça relacionada">
                {relacionados && <ProductGrid produtos={relacionados} />}
              </DataState>
            </Box>
          </>
        )}
      </DataState>
    </Box>
  )
}
