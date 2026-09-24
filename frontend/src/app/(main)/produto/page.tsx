"use client"

import { Box, Flex, Grid, Heading, HStack, Text, VStack, Button, Input, Separator, Badge, Image, Accordion } from "@chakra-ui/react"
import { BiPlus, BiMinus, BiSearch } from "react-icons/bi"
import { ProductCard } from "@/components/home/ProductCard"

// Mock product data to reuse ProductCard
const RELATED_PRODUCTS = Array(8).fill(null).map((_, i) => ({
  id: `rel-${i}`,
  title: "Jarro Tradicional",
  tags: ["Peça única", "Barro"],
  artisan: "Mestre Joãozinho",
  artisanId: "joaozinho",
  city: "Tracunhaém - PE",
  dimensions: "15 x 27 x 15cm",
  price: 167.9,
  imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=300&auto=format&fit=crop"
}))

export default function ProdutoDetailPage() {
  return (
    <Box maxW="container.xl" mx="auto" p={{ base: 4, md: 8 }} mt={4}>
      {/* Top Section: Images and Actions */}
      <Flex flexDir={{ base: "column", lg: "row" }} gap={10} mb={16}>
        
        {/* Left: Product Images */}
        <Flex gap={4} flex="1">
          <VStack gap={4}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i} w="80px" h="80px" borderRadius="md" overflow="hidden" borderWidth={i === 1 ? "2px" : "0"} borderColor="origem.laranja">
                <Image src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=100&auto=format&fit=crop" alt="thumbnail" w="full" h="full" objectFit="cover" />
              </Box>
            ))}
          </VStack>
          <Box flex="1" borderRadius="2xl" overflow="hidden" position="relative" h={{ base: "400px", md: "500px" }}>
            <Image src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop" alt="Jarro" w="full" h="full" objectFit="cover" />
            <Box position="absolute" bottom={4} right={4} bg="white" p={2} borderRadius="full" cursor="pointer">
              <BiSearch color="#432A25" size={20} />
            </Box>
          </Box>
        </Flex>

        {/* Right: Product Actions */}
        <VStack flex="1" align="stretch" gap={6} maxW={{ lg: "450px" }}>
          
          <Box>
            <HStack gap={2} mb={3}>
              <Badge variant="origem">PEÇA ÚNICA</Badge>
              <Badge variant="origem">NOVO</Badge>
            </HStack>
            <Heading variant="titulo" fontSize="5xl" lineHeight="1" mb={2}>Jarro Tradicional</Heading>
            <Text color="origem.texto" fontWeight="bold" textTransform="uppercase" fontSize="sm">
              MESTRE JOÃOZINHO, TRACUNHAÉM
            </Text>
          </Box>

          <Text color="origem.texto" fontSize="4xl" mt={2}>
            R$ 167,90
          </Text>

          <Separator borderColor="origem.passoFundo" />

          <Box>
            <Text color="origem.texto" fontWeight="bold" fontSize="sm" mb={1}>Disponibilidade</Text>
            <Text color="origem.textoSuave" fontSize="sm">Estoque: em 3 dias úteis</Text>
          </Box>

          <Box>
            <Text color="origem.texto" fontWeight="bold" fontSize="sm" mb={1}>Quantidade</Text>
            <HStack bg="origem.busca" w="fit-content" borderRadius="md" px={3} py={1}>
              <BiMinus cursor="pointer" color="#432A25" />
              <Text w="40px" textAlign="center" fontWeight="bold">1</Text>
              <BiPlus cursor="pointer" color="#432A25" />
            </HStack>
          </Box>

          <Box>
            <Text color="origem.texto" fontWeight="bold" fontSize="sm" mb={1}>Frete</Text>
            <Text color="origem.textoSuave" fontSize="sm" mb={2}>Calcular o CEP</Text>
            <HStack gap={2}>
              <Input bg="origem.busca" placeholder="00000-000" variant="unstyled" px={4} py={2} w="150px" borderRadius="md" />
              <Button bg="origem.passoFundo" color="origem.texto" borderRadius="md" px={6} _hover={{ bg: "origem.busca" }}>Calcular</Button>
            </HStack>
            <Text fontSize="xs" color="origem.textoSuave" mt={2}>
              Frete expresso: R$ 45<br/>
              Entrega de 5 a 10 dias úteis<br/>
              *Não fazemos entregas fora do estado de PE
            </Text>
          </Box>

          <Box bg="origem.passoFundo" p={4} borderRadius="md">
            <Text fontWeight="bold" fontSize="sm" mb={2}>Formas de pagamento</Text>
            <Grid templateColumns="1fr 1fr" gap={4}>
              <Text fontSize="xs">Cartão de crédito<br/><strong>Até 12x sem juros</strong></Text>
              <Text fontSize="xs">Pix<br/><strong>5% de desconto</strong></Text>
            </Grid>
          </Box>

          <HStack gap={4} mt={2}>
            <Button variant="origem" flex="1">Comprar agora</Button>
            <Button variant="origem" flex="1">Adicionar ao carrinho</Button>
          </HStack>

        </VStack>
      </Flex>

      {/* Middle Section: Details and Text */}
      <Flex flexDir={{ base: "column", lg: "row" }} gap={10} mb={20}>
        <VStack flex="1" align="stretch" gap={10} maxW="800px">
          
          <Box>
            <Text fontWeight="bold" fontSize="sm" mb={2}>SOBRE A PEÇA</Text>
            <Text fontSize="sm" color="origem.texto" mb={4}>
              Peça decorativa feita com barro, num formato tradicional com um toque contemporâneo.
              Essa cerâmica partiu de Tracunhaém, da casa do mestre e traz os saberes de muito tempo.
              A argila vem crua, é preparada com paciência num processo que exalta a tradição local.
            </Text>
            <Text fontWeight="bold" fontSize="sm" mb={1}>Ficha Técnica</Text>
            <Text fontSize="sm" color="origem.texto" lineHeight="1.8">
              Material: Barro<br/>
              Técnica: Modelagem manual<br/>
              Dimensões: 15 x 27 x 15cm<br/>
              Origem: Tracunhaém, Pernambuco<br/>
              Peça única
            </Text>
          </Box>

          <Box>
            <Text fontWeight="bold" fontSize="sm" mb={2}>SOBRE O ARTESÃO</Text>
            <Heading color="origem.laranja" variant="titulo" fontSize="3xl" mb={2}>Mestre Joãozinho</Heading>
            <Text fontSize="sm" color="origem.texto" mb={4}>
              Nascido e criado em Tracunhaém, Mestre Joãozinho começou a trabalhar com barro 
              ainda jovem, aprendendo os processos técnicos com familiares e vizinhos de bairro. 
              Ao longo dos anos, desenvolveu um jeito único de moldar e finalizar as peças.
            </Text>
            <Text as="a" href="#" color="origem.laranja" fontSize="sm" textDecoration="underline">
              Conheça mais sobre Mestre Joãozinho →
            </Text>
          </Box>

          <Box>
            <Text fontWeight="bold" fontSize="sm" mb={2}>CUIDADOS COM A PEÇA</Text>
            <Text fontSize="sm" color="origem.texto" mb={2}>
              Por se tratar de uma peça artesanal, pequenas variações de tamanho, 
              textura e tonalidade podem fazer parte da sua singularidade.
            </Text>
            <Box as="ul" pl={5} fontSize="sm" color="origem.texto">
              <li>Manter em local seco e preferencialmente fresco;</li>
              <li>Para limpeza, utilizar pano macio e seco;</li>
              <li>Evitar produtos abrasivos;</li>
              <li>Não submeter a choques e diferenças bruscas de temperatura.</li>
            </Box>
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
            <Accordion.Root collapsible>
              {["Política de troca e devolução", "Política de entrega", "Política de pagamento", "Dúvidas sobre sua compra?"].map((item, index) => (
                <Accordion.Item key={index} value={item} mb={2} border="none">
                  <Accordion.ItemTrigger bg="origem.passoFundo" p={4} borderRadius="md" _hover={{ bg: "origem.busca" }}>
                    <Text fontSize="sm" fontWeight="medium" color="origem.texto">{item}</Text>
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent p={4} bg="origem.fundo">
                    <Text fontSize="sm" color="origem.textoSuave">Detalhes sobre {item.toLowerCase()}...</Text>
                  </Accordion.ItemContent>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </Box>
        </VStack>
      </Flex>

      {/* Bottom Section: Related Products */}
      <Box mb={10}>
        <Text fontWeight="bold" fontSize="lg" mb={6} textTransform="uppercase">PEÇAS RELACIONADAS</Text>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
          {RELATED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Grid>
      </Box>

    </Box>
  )
}
