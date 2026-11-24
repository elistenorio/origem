"use client"

import { useState } from "react"
import { Box, Flex, Image, Link, chakra } from "@chakra-ui/react"
import { BiSearch } from "react-icons/bi"

type ProductGalleryProps = {
  titulo: string
  imagemUrl: string   // capa, usada quando a peça não tem miniaturas
  imagens: string[]   // miniaturas (a primeira é a capa)
}

// Galeria da página de detalhe: foto quadrada em destaque e miniaturas à esquerda (no celular, embaixo).
// Clicar numa miniatura troca a foto em destaque; a lupa abre a foto em tamanho grande numa aba nova.
// minW="0" deixa a galeria encolher: sem ele, uma foto larga empurra a galeria por cima do painel de compra.
export function ProductGallery({ titulo, imagemUrl, imagens }: ProductGalleryProps) {
  const [selecionada, setSelecionada] = useState(0)
  const fotoAtual = imagens[selecionada] ?? imagemUrl

  return (
    <Flex gap={4} flex="1" minW="0" align="flex-start" direction={{ base: "column-reverse", md: "row" }}>
      {imagens.length > 1 && (
        <Flex gap={3} flexShrink={0} direction={{ base: "row", md: "column" }} overflowX={{ base: "auto", md: "visible" }} maxW="full" p="1">
          {imagens.map((url, i) => {
            const ativa = i === selecionada
            return (
              <chakra.button
                key={url}
                type="button"
                onClick={() => setSelecionada(i)}
                aria-label={`Ver foto ${i + 1} de ${imagens.length}`}
                aria-pressed={ativa}
                w="80px"
                h="80px"
                flexShrink={0}
                borderRadius="md"
                overflow="hidden"
                cursor="pointer"
                outline="3px solid"
                outlineColor={ativa ? "origem.laranja" : "transparent"}
                outlineOffset="2px"
                opacity={ativa ? 1 : 0.75}
                transition="opacity 0.2s"
                _hover={{ opacity: 1, outlineColor: ativa ? "origem.laranja" : "origem.passoInativo" }}
                _focusVisible={{ outlineColor: "origem.texto" }}
              >
                <Image src={url} alt="" w="full" h="full" objectFit="cover" />
              </chakra.button>
            )
          })}
        </Flex>
      )}
      <Box flex="1" minW="0" w="full" maxW={{ md: "600px" }} aspectRatio="1" borderRadius="2xl" overflow="hidden" position="relative" bg="origem.busca">
        <Image src={fotoAtual} alt={`${titulo}, foto ${selecionada + 1}`} w="full" h="full" objectFit="cover" />
        <Link
          href={fotoAtual}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ampliar foto (abre em nova aba)"
          position="absolute"
          bottom={4}
          right={4}
          bg="white"
          p={2}
          borderRadius="full"
          color="origem.texto"
          boxShadow="md"
          _hover={{ bg: "origem.passoInativo" }}
        >
          <BiSearch size={20} />
        </Link>
      </Box>
    </Flex>
  )
}
