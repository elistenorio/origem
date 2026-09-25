"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import NextLink from "next/link"
import { Box, Button, chakra, Flex, Heading, HStack, Link } from "@chakra-ui/react"
import { BiUser, BiBasket } from "react-icons/bi"
import { SearchField } from "@/components/common/SearchField"

export function Header() {
  const router = useRouter()
  const [busca, setBusca] = useState("")

  function handleBuscar(e: React.FormEvent) {
    e.preventDefault()
    router.push(`/catalogo${busca.trim() ? `?busca=${encodeURIComponent(busca.trim())}` : ""}`)
  }

  return (
    <Box py={4} px={{ base: 4, md: 10 }}>
      <Flex gap={{ base: 4, md: 8 }} align="center" justify="space-between" wrap={{ base: "wrap", lg: "nowrap" }}>
        <Link asChild _hover={{ textDecoration: "none", opacity: 0.8 }}>
          <NextLink href="/">
            <Heading variant="titulo" textTransform="uppercase" letterSpacing="widest" fontSize="3xl">
              Origem
            </Heading>
          </NextLink>
        </Link>

        <chakra.form onSubmit={handleBuscar} flex="1" maxW="600px" minW={{ base: "full", md: "280px" }} order={{ base: 3, lg: 0 }} role="search">
          <SearchField
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Pesquise palavras-chave, ex.: vaso, renda, xilogravura..."
            aria-label="Buscar peças"
          />
        </chakra.form>

        <HStack gap={3}>
          <Button asChild variant="outline" px={5}>
            <NextLink href="/minha-conta">
              <BiUser /> Acesso / Minha Conta
            </NextLink>
          </Button>
          <Button asChild variant="origem" px={5}>
            <NextLink href="/carrinho">
              <BiBasket /> Meu carrinho
            </NextLink>
          </Button>
        </HStack>
      </Flex>
    </Box>
  )
}
