"use client"

import { Box, Flex, Grid, Heading, Text, VStack, Image } from "@chakra-ui/react"
import { ProductCard } from "@/components/home/ProductCard"

// Mock product data to reuse ProductCard
const CATALOG_PRODUCTS = Array(12).fill(null).map((_, i) => ({
  id: `cat-${i}`,
  title: "Jarro Tradicional",
  tags: ["Peça única", "Barro"],
  artisan: "Mestre Joãozinho",
  artisanId: "joaozinho",
  city: "Tracunhaém",
  dimensions: "15 x 27 x 15cm",
  price: 167.9,
  imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=300&auto=format&fit=crop"
}))

export default function PublicArtisanPage() {
  return (
    <Box pt={10}>
      
      {/* Top Section: Hero & Biography */}
      <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }} mb={16}>
        <Flex flexDir={{ base: "column", lg: "row" }} gap={12} alignItems="stretch">
          
          {/* Artisan Photo */}
          <Box flex={{ base: "none", lg: "0 0 45%" }} position="relative" borderRadius="2xl" overflow="hidden" minH={{ base: "400px", md: "600px" }}>
            <Image 
              src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=600&auto=format&fit=crop" 
              alt="Mestre Joãozinho" 
              w="full" 
              h="full" 
              objectFit="cover" 
            />
            
            <VStack position="absolute" bottom={8} right={8} align="flex-end" gap={0}>
              <Text color="origem.laranja" fontWeight="bold" fontSize="2xl" textTransform="uppercase" lineHeight="1">
                Ceramista
              </Text>
              <Text color="origem.fundo" fontWeight="bold" fontSize="lg" textTransform="uppercase" letterSpacing="wide">
                Tracunhaém, Pernambuco
              </Text>
            </VStack>
          </Box>

          {/* Artisan Bio */}
          <VStack flex="1" align="stretch" justify="center" gap={6}>
            <Box>
              <Text fontWeight="bold" fontSize="sm" color="origem.texto" textTransform="uppercase" mb={1}>
                SOBRE O ARTESÃO
              </Text>
              <Heading variant="titulo" fontSize={{ base: "4xl", md: "5xl" }}>
                Mestre Joãozinho
              </Heading>
            </Box>

            <VStack align="stretch" gap={4} color="origem.texto" fontSize="md" lineHeight="1.7">
              <Text fontStyle="italic" fontWeight="medium">
                "O barro guarda a memória de quem coloca a mão nele."
              </Text>
              <Text>
                Foi em Tracunhaém que comecei a trabalhar com o barro. Aprendi muito observando os mais velhos quando 
                produziam as quartinhas e, com o tempo, fui encontrando minha própria maneira de fazer as peças. 
                Algumas coisas continuam como aprendi no começo, outras fui mudando conforme fui trabalhando.
              </Text>
              <Text>
                Gosto do barro porque ele permite fazer muita coisa. Cada peça vai tomando sua forma durante o trabalho e 
                nem sempre o resultado é exatamente o que a gente imaginou no início. Acho que isso também faz parte do 
                trabalho artesanal.
              </Text>
              <Text>
                Hoje faço principalmente peças de cerâmica para decoração e uso. Procuro manter algumas formas e 
                maneiras de fazer que fazem parte da tradição de Tracunhaém, mas também gosto de experimentar e 
                criar peças diferentes.
              </Text>
            </VStack>
          </VStack>

        </Flex>
      </Box>

      {/* Middle Section: Detailed Info Strip */}
      <Box bg="origem.laranja" color="origem.fundo" py={16}>
        <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }}>
          <VStack align="stretch" gap={10}>
            
            <Box>
              <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" mb={4}>MEU TRABALHO</Text>
              <Text fontSize="sm" lineHeight="1.8">
                Trabalho principalmente com barro e cerâmica. A maior parte das peças é feita manualmente, desde a preparação do barro até o 
                acabamento. O processo exige tempo. Depois de modelada, a peça precisa secar no ritmo certo antes de ir para a queima. O clima 
                também influencia bastante. É preciso ter cuidado em cada etapa porque uma peça pode mudar bastante durante esse processo. Não 
                tenho como fazer duas peças exatamente iguais. Mesmo quando sigo o mesmo modelo, o barro, a secagem e a queima acabam 
                deixando pequenas diferenças em cada uma. É uma característica que eu gosto de manter no meu trabalho.
              </Text>
            </Box>

            <Box>
              <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" mb={4}>DE ONDE VEM O MEU TRABALHO</Text>
              <Text fontStyle="italic" mb={2}>
                "Tracunhaém faz parte do que eu faço."
              </Text>
              <Text fontSize="sm" lineHeight="1.8">
                Aqui o trabalho com o barro está muito presente e a gente aprende muito convivendo com outros artesãos. Foi nesse ambiente que 
                comecei a entender melhor a cerâmica e a importância de continuar fazendo esse trabalho. Aprendi algumas coisas com pessoas mais 
                velhas e outras fui aprendendo com a prática. Ainda hoje continuo aprendendo, porque trabalhar com barro é um processo que muda 
                de peça para peça, de barro para barro. Para mim, manter esse trabalho também é uma forma de continuar uma tradição que existe há 
                muito tempo na cidade.
              </Text>
            </Box>

            <Box>
              <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" mb={4}>O QUE GOSTO DE FAZER</Text>
              <Text fontSize="sm" lineHeight="1.8">
                Gosto principalmente de trabalhar com peças que tenham uma forma simples e que mostrem o próprio material. Não procuro 
                esconder completamente as marcas do processo. Para mim, algumas diferenças na superfície, na cor ou no formato mostram que 
                aquela peça foi feita à mão. Cada peça reflete na aparência a essência da sua natureza.
              </Text>
            </Box>

            <Box pt={4}>
              <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" mb={4}>PEÇA SOB ENCOMENDA. ENTRE EM CONTATO</Text>
              <Grid templateColumns={{ base: "1fr 1fr", lg: "repeat(4, 1fr)" }} gap={6}>
                <Box>
                  <Text fontSize="sm" mb={1}>WhatsApp</Text>
                  <Text fontSize="md" fontWeight="bold">(81) 90000-0000</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" mb={1}>Telefone</Text>
                  <Text fontSize="md" fontWeight="bold">(81) 0000-0000</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" mb={1}>Email</Text>
                  <Text fontSize="md" fontWeight="bold">contato@origem.com</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" mb={1}>Horário de Atendimento</Text>
                  <Text fontSize="md" fontWeight="bold">Segunda a Sábado - 09h00 às 19h30</Text>
                </Box>
              </Grid>
            </Box>

          </VStack>
        </Box>
      </Box>

      {/* Bottom Section: Catalog Grid */}
      <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }} py={16}>
        <Text fontWeight="bold" fontSize="lg" mb={8} textTransform="uppercase" color="origem.texto">
          MEU CATÁLOGO DE PEÇAS
        </Text>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
          {CATALOG_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Grid>
      </Box>

    </Box>
  )
}
