import NextLink from "next/link"
import { Box, Button, Grid, Heading, Image, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { BiGroup, BiMapPin, BiShield, BiTransferAlt } from "react-icons/bi"
import { Banner } from "@/components/common/Banner"
import { Tile } from "@/components/common/Tile"
import { Quote } from "@/components/institucional/Quote"
import { StatHighlight } from "@/components/institucional/StatHighlight"
import { ValueCard } from "@/components/institucional/ValueCard"

const VALORES = [
  { icon: BiMapPin, title: "Origem", description: "Toda peça vem com a história de quem fez e de onde veio." },
  { icon: BiShield, title: "Curadoria", description: "Cada artesão e cada peça passam por uma análise cuidadosa." },
  { icon: BiGroup, title: "Comércio justo", description: "Taxas transparentes e a maior parte do valor para quem produz." },
  { icon: BiTransferAlt, title: "Continuidade", description: "Valorizar técnicas tradicionais para que passem adiante." },
]

const NUMEROS = [
  { value: "164", label: "Artesãos cadastrados" },
  { value: "38", label: "Municípios de Pernambuco" },
  { value: "1.286", label: "Peças publicadas" },
  { value: "5,9 mil", label: "Clientes atendidos" },
]

export default function SobrePage() {
  return (
    <Box>
      {/* Hero */}
      <Box position="relative" h={{ base: "280px", md: "360px" }} overflow="hidden">
        <Image
          src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=1400&auto=format&fit=crop"
          alt=""
          w="full"
          h="full"
          objectFit="cover"
          filter="brightness(0.45)"
        />
        <Box position="absolute" inset={0} display="flex" alignItems="center">
          <Stack maxW="container.xl" mx="auto" w="full" px={{ base: 4, md: 8 }} gap={2} color="white">
            <Text fontWeight="bold" textTransform="uppercase" fontSize="sm" letterSpacing="wide">
              Sobre nós
            </Text>
            <Heading as="h1" fontFamily="heading" fontSize={{ base: "3xl", md: "5xl" }} fontWeight="normal">
              Feito à mão, com origem.
            </Heading>
            <Text maxW="500px" fontSize={{ base: "sm", md: "md" }}>
              O O.R.I.G.E.M. conecta artesãos e produtores criativos de Pernambuco a quem valoriza a
              história por trás de cada peça.
            </Text>
          </Stack>
        </Box>
      </Box>

      <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }}>
        {/* Nossa história */}
        <Grid templateColumns={{ base: "1fr", md: "1.1fr 1fr" }} gap={10} py={16} alignItems="center">
          <Stack gap={4}>
            <Heading as="h2" variant="destaque" fontSize="2xl">Nossa história</Heading>
            <Text color="origem.texto">
              O Origem nasceu em 2026, num projeto de estudantes da CESAR School que se perguntaram
              por que peças tão ricas em técnica e história chegavam ao comprador sem o nome de quem
              as fez.
            </Text>
            <Text color="origem.texto">
              Começamos visitando feiras em Caruaru, Tracunhaém e Passira. Ouvimos artesãs e artesãos
              que dependiam de atravessadores, tinham pouca visibilidade digital e controlavam
              pedidos e estoque no caderno.
            </Text>
          </Stack>
          <Image
            src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=700&auto=format&fit=crop"
            alt="Jarro de barro tradicional"
            w="full"
            h={{ base: "260px", md: "320px" }}
            objectFit="cover"
            borderRadius="2xl"
          />
        </Grid>

        {/* Nosso propósito */}
        <Grid templateColumns={{ base: "1fr", md: "1fr 1.1fr" }} gap={10} pb={16} alignItems="center">
          <Image
            src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=700&auto=format&fit=crop"
            alt="Peça artesanal em tecido"
            w="full"
            h={{ base: "260px", md: "320px" }}
            objectFit="cover"
            borderRadius="2xl"
          />
          <Stack gap={4}>
            <Heading as="h2" variant="destaque" fontSize="2xl">Nosso propósito</Heading>
            <Text color="origem.texto">
              Criar um canal direto entre quem produz e quem compra, destacando a origem, a técnica e
              o impacto de comprar de quem faz.
            </Text>
            <Text color="origem.texto">
              Aqui cada peça tem nome, sobrenome e endereço. E a maior parte do valor fica com o
              artesão.
            </Text>
          </Stack>
        </Grid>

        {/* Nossos valores */}
        <Box pb={16}>
          <Heading as="h2" variant="secao" fontSize="lg" mb={6}>Nossos valores</Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6}>
            {VALORES.map((valor) => (
              <ValueCard key={valor.title} icon={valor.icon} title={valor.title} description={valor.description} />
            ))}
          </SimpleGrid>
        </Box>

        {/* Como atuamos */}
        <Box pb={16}>
          <Heading as="h2" variant="secao" fontSize="lg" mb={6}>Como atuamos</Heading>
          <SimpleGrid columns={{ base: 2, lg: 4 }} gap={6}>
            {NUMEROS.map((numero) => (
              <StatHighlight key={numero.label} value={numero.value} label={numero.label} />
            ))}
          </SimpleGrid>
        </Box>

        {/* Relação com os artesãos */}
        <Tile
          display="grid"
          gridTemplateColumns={{ base: "1fr", md: "1.2fr 1fr" }}
          gap={8}
          p={{ base: 6, md: 10 }}
          mb={16}
          alignItems="stretch"
        >
          <Stack gap={3} justify="center">
            <Heading as="h2" variant="destaque" fontSize="xl">Relação com os artesãos</Heading>
            <Text color="origem.texto">
              Oferecemos um painel simples para cadastrar peças, controlar estoque e acompanhar
              pedidos, além de orientação para fotografar e precificar o trabalho. A curadoria é
              feita por pessoas, com retorno claro em cada etapa.
            </Text>
            <Text fontSize="xs" color="origem.textoSuave">
              Sobre a plataforma: o Origem é uma aplicação web com vitrine para compradores, painel
              do artesão e painel administrativo, com indicadores de venda para todos.
            </Text>
          </Stack>
          <Quote author="Mestre Joãozinho, Tracunhaém">
            Antes eu vendia só na feira. Hoje minhas peças chegam no Brasil inteiro, e o cliente sabe
            quem fez.
          </Quote>
        </Tile>

        {/* CTA final */}
        <Banner tom="laranja" p={{ base: 8, md: 12 }} mb={16} textAlign="center">
          <Heading as="h2" fontFamily="heading" fontWeight="normal" fontSize={{ base: "2xl", md: "3xl" }} mb={2}>
            Faça parte dessa história
          </Heading>
          <Text mb={6}>Compre de quem faz ou venda o seu trabalho no Origem.</Text>
          <Stack direction={{ base: "column", sm: "row" }} justify="center" gap={4}>
            <Button asChild variant="claro">
              <NextLink href="/artesaos">→ Conheça os artesãos</NextLink>
            </Button>
            <Button asChild variant="secundario">
              <NextLink href="/cadastro">+ Faça parte</NextLink>
            </Button>
          </Stack>
        </Banner>
      </Box>
    </Box>
  )
}
