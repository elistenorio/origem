"use client"

import { useState } from "react"
import { Box, Flex, Grid, Heading, HStack, Text, VStack, Button, Input, Separator, IconButton } from "@chakra-ui/react"
import { BiPencil } from "react-icons/bi"
import { DashboardSidebar } from "@/components/artesao/DashboardSidebar"
import { Greeting } from "@/components/artesao/Greeting"
import { FormField } from "@/components/common/FormField"
import { SelectField } from "@/components/common/SelectField"
import { TextareaField } from "@/components/common/TextareaField"
import { TechniquesField } from "@/components/register/TechniquesField"

export default function ArtesaoPerfilPage() {
  const [tecnicas, setTecnicas] = useState<string[]>([])
  const [outraTecnica, setOutraTecnica] = useState("")

  return (
    <Flex>
      <DashboardSidebar activeItem="perfil" />

      {/* Main Content Area */}
      <Flex flex="1" p={{ base: 6, md: 10 }} gap={10} flexDir={{ base: "column", lg: "row" }} alignItems="flex-start">

        {/* Left Action Column */}
        <VStack w={{ base: "full", lg: "200px" }} gap={4} position={{ lg: "sticky" }} top={{ lg: "100px" }}>
          <Button variant="origem" w="full">Salvar alterações</Button>
          <Button variant="origem" w="full">Visualizar perfil</Button>
        </VStack>

        {/* Form Column */}
        <VStack flex="1" maxW="700px" align="stretch" gap={8}>

          {/* Avatar Section */}
          <Box position="relative" w="150px" h="180px" borderRadius="xl" overflow="hidden" bg="origem.passoFundo">
            <Box w="full" h="full" bgImage="url('https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=200&auto=format&fit=crop')" bgSize="cover" backgroundPosition="center" />
            <Button
              position="absolute"
              bottom={2}
              left="50%"
              transform="translateX(-50%)"
              variant="origem"
              size="xs"
              h="24px"
              px={3}
              fontSize="xs"
            >
              Editar Foto
            </Button>
          </Box>

          {/* Name Section */}
          <Box>
            <Greeting mb={1} />
            <HStack bg="origem.busca" w="fit-content" borderRadius="full" px={4} py={2} mb={1}>
              <Input
                variant="unstyled"
                defaultValue="Mestre Joãozinho"
                fontFamily="heading"
                fontSize="4xl"
                color="origem.laranja"
                fontWeight="normal"
                w="300px"
              />
              <IconButton aria-label="Editar nome" variant="ghost" color="origem.marrom" bg="white" borderRadius="full" size="xs" w="24px" h="24px" _hover={{ bg: "whiteAlpha.80" }}>
                <BiPencil />
              </IconButton>
            </HStack>
            <Text color="origem.textoSuave" fontSize="xs">
              Nome pelo qual você deseja ser apresentado no Origem.
            </Text>
          </Box>

          {/* Basic Info Grid */}
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
            <FormField label="CIDADE" placeholder="" />
            <FormField label="ESTADO" placeholder="" />
            <Grid gridColumn={{ md: "span 2" }}>
              <FormField label="EMAIL" placeholder="email@exemplo.com" />
            </Grid>
            <FormField label="TELEFONE" placeholder="(DDD) 00000-0000" />
            <FormField label="CELULAR" placeholder="(DDD) 00000-0000" />
          </Grid>

          <Separator borderColor="origem.passoFundo" borderWidth="1px" />

          {/* Sobre Você Section */}
          <Box>
            <Heading color="origem.laranja" variant="destaque" fontSize="sm" mb={6}>
              SOBRE VOCÊ
            </Heading>
            <VStack align="stretch" gap={6}>
              <TextareaField label="Sua história" minH="120px" defaultValue="Texto atual de passos para que ela possa ler e alterar" resize="vertical" />
              <TextareaField label="Seu trabalho" minH="120px" defaultValue="Texto atual de passos para que ela possa ler e alterar" resize="vertical" />
              <TextareaField label="De onde vem o seu trabalho?" minH="120px" defaultValue="Texto atual de passos para que ela possa ler e alterar" resize="vertical" />
              <TextareaField label="O que você gosta de fazer?" minH="120px" defaultValue="Texto atual de passos para que ela possa ler e alterar" resize="vertical" />
            </VStack>
          </Box>

          <Separator borderColor="origem.passoFundo" borderWidth="1px" />

          {/* Sobre O Seu Trabalho Section */}
          <Box>
            <Heading color="origem.laranja" variant="destaque" fontSize="sm" mb={6}>
              SOBRE O SEU TRABALHO
            </Heading>
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} mb={8}>
              <SelectField
                label="TEMPO DE ATUAÇÃO"
                value="Menos de 1 ano"
                onChange={() => {}}
                options={[
                  { value: "Menos de 1 ano", label: "Menos de 1 ano" },
                  { value: "1 a 3 anos", label: "1 a 3 anos" },
                ]}
              />
              <SelectField
                label="ÁREA DE ATUAÇÃO"
                value="Cerâmica"
                onChange={() => {}}
                options={[
                  { value: "Cerâmica", label: "Cerâmica" },
                  { value: "Madeira", label: "Madeira" },
                ]}
              />
            </Grid>

            {/* Reuse TechniquesField */}
            <Box>
               <TechniquesField
                  selected={tecnicas}
                  onChange={setTecnicas}
                  other={outraTecnica}
                  onOtherChange={setOutraTecnica}
               />
            </Box>
          </Box>

          <Separator borderColor="origem.passoFundo" borderWidth="1px" mt={4} />

          {/* Excluir Conta Section */}
          <Box pb={10}>
            <Heading color="origem.laranja" variant="destaque" fontSize="sm" mb={2}>
              EXCLUIR CONTA
            </Heading>
            <Text color="origem.textoSuave" fontSize="sm" mb={4} maxW="600px">
              Ao excluir sua conta, seu perfil e suas informações deixarão de estar disponíveis no Origem.
              <Text as="span" fontWeight="bold"> Essa ação não poderá ser desfeita.</Text> Antes de continuar,
              certifique-se de que não possui pedidos ou outras atividades pendentes.
            </Text>
            <Button bg="origem.marrom" color="origem.fundo" borderRadius="lg" px={6} py={6} _hover={{ opacity: 0.9 }}>
              Excluir a minha conta
            </Button>
          </Box>

        </VStack>
      </Flex>
    </Flex>
  )
}
