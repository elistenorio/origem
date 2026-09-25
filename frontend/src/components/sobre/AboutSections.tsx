import NextLink from "next/link"
import { Button, Flex, Heading, HStack, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { BiMap, BiBadgeCheck, BiGroup, BiRefresh } from "react-icons/bi"
import { Panel } from "@/components/common/Panel"
import { Banner } from "@/components/common/Banner"


const VALORES = [
  { icone: <BiMap />, titulo: "Origem", texto: "Toda peça vem com a história de quem fez e de onde veio." },
  { icone: <BiBadgeCheck />, titulo: "Curadoria", texto: "Cada artesão e cada peça passam por uma análise cuidadosa." },
  { icone: <BiGroup />, titulo: "Comércio justo", texto: "Taxas transparentes e a maior parte do valor para quem produz." },
  { icone: <BiRefresh />, titulo: "Continuidade", texto: "Valorizar técnicas tradicionais para que passem adiante." },
]

const NUMEROS = [
  ["164", "artesãos cadastrados"],
  ["38", "municípios de Pernambuco"],
  ["1.286", "peças publicadas"],
  ["5,9 mil", "clientes atendidos"],
]

// Conteúdo institucional da página Sobre nós (Tela D).
export function AboutSections() {
  return (
    <Stack gap="16">
      <Banner bgImage="url('/images/bg-login.png')" px={{ base: "6", md: "14" }} py={{ base: "12", md: "20" }}>
        <Stack gap="4" maxW="2xl">
          <Text textStyle="rotulo" color="origem.fundo">Sobre nós</Text>
          <Heading as="h1" variant="titulo" color="origem.fundo" fontSize={{ base: "4xl", md: "6xl" }} lineHeight="1">Feito à mão, com origem.</Heading>
          <Text fontSize="lg">O O.R.I.G.E.M. conecta artesãos e produtores criativos de Pernambuco a quem valoriza a história por trás de cada peça.</Text>
        </Stack>
      </Banner>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap="10">
        <Stack gap="3">
          <Heading as="h2" variant="secao" fontSize="xl" color="origem.laranja">Nossa história</Heading>
          <Text>O Origem nasceu em 2026, num projeto de estudantes da CESAR School que se perguntaram por que peças tão ricas em técnica e história chegavam ao comprador sem o nome de quem as fez.</Text>
          <Text>Começamos visitando feiras em Caruaru, Tracunhaém e Passira e ouvindo artesãos que dependiam de intermediários e tinham pouca visibilidade digital.</Text>
        </Stack>
        <Stack gap="3">
          <Heading as="h2" variant="secao" fontSize="xl" color="origem.laranja">Nosso propósito</Heading>
          <Text>Criar um canal direto entre quem produz e quem compra, destacando a origem, a técnica e o impacto de comprar de quem faz.</Text>
          <Text>Aqui cada peça tem nome, sobrenome e endereço. E a maior parte do valor fica com o artesão.</Text>
        </Stack>
      </SimpleGrid>

      <Stack gap="6">
        <Heading as="h2" variant="secao" fontSize="xl" color="origem.laranja">Nossos valores</Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap="4">
          {VALORES.map((v) => (
            <Panel key={v.titulo} title={<HStack gap="2"><Text as="span" color="origem.laranja" fontSize="xl">{v.icone}</Text>{v.titulo}</HStack>}>
              <Text textStyle="apoio">{v.texto}</Text>
            </Panel>
          ))}
        </SimpleGrid>
      </Stack>

      <Stack gap="6">
        <Heading as="h2" variant="secao" fontSize="xl" color="origem.laranja">Como atuamos</Heading>
        <SimpleGrid columns={{ base: 2, lg: 4 }} gap="6">
          {NUMEROS.map(([valor, rotulo]) => (
            <Stack key={rotulo} align="center" gap="1" textAlign="center">
              <Text textStyle="numero" fontSize="6xl">{valor}</Text>
              <Text textStyle="rotulo">{rotulo}</Text>
            </Stack>
          ))}
        </SimpleGrid>
      </Stack>

      <Panel title="Relação com os artesãos">
        <Flex gap="8" direction={{ base: "column", md: "row" }}>
          <Stack gap="3" flex="1">
            <Text>Oferecemos um painel simples para cadastrar peças, controlar estoque e acompanhar pedidos, além de orientação para fotografar e precificar o trabalho. A curadoria é feita por pessoas, com retorno claro em cada etapa.</Text>
            <Text textStyle="apoio">Sobre a plataforma: o Origem é uma aplicação web com vitrine para compradores, painel do artesão e painel administrativo.</Text>
          </Stack>
          <Stack flex="1" bg="origem.fundo" borderRadius="xl" p="6" gap="2">
            <Heading as="p" variant="titulo" fontSize="3xl">“Antes eu vendia só na feira. Hoje minhas peças chegam no Brasil inteiro, e o cliente sabe quem fez.”</Heading>
            <Text textStyle="rotulo">Mestre Joãozinho, Tracunhaém</Text>
          </Stack>
        </Flex>
      </Panel>

      <Banner tom="laranja" px="6" py="14" textAlign="center">
        <Stack gap="4" align="center">
          <Heading as="h2" variant="titulo" color="origem.fundo" fontSize={{ base: "3xl", md: "5xl" }}>Faça parte dessa história</Heading>
          <Text>Compre de quem faz ou venda o seu trabalho no Origem.</Text>
          <HStack gap="3" wrap="wrap" justify="center">
            <Button asChild variant="claro"><NextLink href="/artesaos">Conheça os artesãos</NextLink></Button>
            <Button asChild variant="secundario"><NextLink href="/cadastro">Faça parte</NextLink></Button>
          </HStack>
        </Stack>
      </Banner>
    </Stack>
  )
}
