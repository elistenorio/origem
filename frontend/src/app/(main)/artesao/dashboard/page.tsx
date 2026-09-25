import { Box, Flex, Heading, HStack, Text, VStack, IconButton, Button, SimpleGrid } from "@chakra-ui/react"
import { BiSearch, BiBarChart, BiStar } from "react-icons/bi"
import { DashboardSidebar } from "@/components/artesao/DashboardSidebar"
import { Greeting } from "@/components/artesao/Greeting"
import { StatCard } from "@/components/common/StatCard"
import { SectionCard } from "@/components/common/SectionCard"
import { NotificationItem } from "@/components/artesao/NotificationItem"
import { EducationalDialog } from "@/components/artesao/EducationalDialog"
import NextLink from "next/link"

export default function ArtesaoDashboardPage() {
  return (
    <Flex>
      <DashboardSidebar />
      <Box flex="1" p={{ base: 6, md: 10 }}>
        {/* Header */}
        <Box mb={8}>
          <Greeting />
          <Heading variant="titulo" fontSize="5xl">
            Mestre Joãozinho
          </Heading>
        </Box>

        {/* Stats Section */}
        <HStack alignItems="stretch" gap={6} mb={8} flexWrap="wrap">
          <StatCard
            title="PEÇAS PUBLICAS"
            subtitle="Quantas peças você tem disponível atualmente no site"
            value="12"
          />
          <StatCard
            title="PEÇAS VENDIDAS"
            subtitle="Quantas peças você vendeu nos últimos 7 dias"
            value="4"
          />
          <StatCard
            title="VENDAS DO MÊS"
            subtitle="Quantos reais você vendeu no último 1 mês"
            value={
              <HStack justify="center" gap={1} alignItems="baseline">
                <Text fontSize="2xl">R$</Text>
                <Text>1.240</Text>
                <Text fontSize="2xl">,00</Text>
              </HStack>
            }
          />
          <StatCard
            title="AVALIAÇÃO"
            subtitle="Sua média de notas na plataforma"
            value={
              <HStack justify="center" gap={1} alignItems="center">
                <Text>4,8</Text>
                <BiStar size={32} />
              </HStack>
            }
          />

          <Flex alignItems="center" justify="center" pl={2} gap={3}>
            <EducationalDialog />
            <IconButton
              aria-label="Buscar"
              bg="origem.passoFundo"
              color="origem.laranja"
              borderRadius="full"
              size="lg"
              w="60px"
              h="60px"
              _hover={{ bg: "origem.busca" }}
            >
              <BiSearch size={28} />
            </IconButton>
          </Flex>
        </HStack>

        {/* Action Button Section */}
        <HStack mb={10} gap={4}>
          <Button variant="origem">
            <BiBarChart size={20} />
            Ver indicadores
          </Button>
          <Text color="origem.textoSuave" fontSize="sm" maxW="200px" lineHeight="1.2">
            Veja o desempenho das suas peças ao longo do tempo
          </Text>
        </HStack>

        {/* Bottom Sections */}
        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
          <SectionCard title="NOTIFICAÇÕES">
            <VStack alignItems="stretch" gap={4}>
              <NotificationItem
                title="Novo pedido recebido"
                description={<>O Jarro Tradicional foi comprado<br />R$ 167,90</>}
              />
              <NotificationItem
                title="Sua peça recebeu uma avaliação"
                description={<>Um cliente avaliou o Jarro<br />Tradicional em 5 estrelas</>}
              />
              <NotificationItem
                title="Seu perfil foi aprovado"
                description={<>Seu perfil esta disponível para<br />os visitantes do Origem</>}
              />
            </VStack>
          </SectionCard>

          <SectionCard title="PEDIDOS RECENTES">
            <VStack alignItems="stretch" gap={6}>
              <Box>
                <Text fontWeight="bold" color="origem.texto" fontSize="sm" mb={1}>Jarro Tradicional</Text>
                <Text fontSize="sm" color="origem.textoSuave">1 unidade - R$ 167,90</Text>
                <Text fontSize="sm" color="origem.textoSuave" fontStyle="italic">Aguardando envio</Text>
              </Box>

              <Box>
                <Text fontWeight="bold" color="origem.texto" fontSize="sm" mb={1}>Vaso de Barro Biscoito</Text>
                <Text fontSize="sm" color="origem.textoSuave">2 unidades - R$ 240,92</Text>
                <Text fontSize="sm" color="origem.textoSuave" fontStyle="italic">Entregue</Text>
              </Box>
            </VStack>
          </SectionCard>

          <SectionCard title="MEU CATÁLOGO">
            <VStack alignItems="stretch" gap={4}>
              <Button asChild variant="origem" w="full">
                <NextLink href="/artesao/catalogo">Editar catálogo</NextLink>
              </Button>
              <Button asChild variant="origem" w="full">
                <NextLink href="/artesao/catalogo/nova">Adicionar nova peça</NextLink>
              </Button>
              <Button asChild variant="claro" w="full">
                <NextLink href="/artesao/estoque">Ver estoque</NextLink>
              </Button>
            </VStack>
          </SectionCard>
        </SimpleGrid>
      </Box>
    </Flex>
  )
}
