"use client"

import { useState } from "react"
import { Box, chakra, Flex, Image, Stack } from "@chakra-ui/react"
import { thumbnailRecipe } from "@/theme/recipes/thumbnail"

const Thumbnail = chakra("button", thumbnailRecipe)

type ProductGalleryProps = {
  titulo: string
  imagens: string[]
}

// Galeria da página da peça: miniaturas ao lado (embaixo, no celular) e a foto escolhida em destaque.
export function ProductGallery({ titulo, imagens }: ProductGalleryProps) {
  const [atual, setAtual] = useState(0)

  return (
    <Flex gap="4" direction={{ base: "column-reverse", md: "row" }} flex="1" minW="0">
      <Stack direction={{ base: "row", md: "column" }} gap="3" flexShrink={0} overflowX="auto">
        {imagens.map((url, i) => (
          <Thumbnail
            key={url}
            type="button"
            onClick={() => setAtual(i)}
            aria-label={`Ver foto ${i + 1} de ${imagens.length}`}
            aria-pressed={i === atual}
            boxSize={{ base: "72px", md: "110px" }}
          >
            <Image src={url} alt="" w="full" h="full" objectFit="cover" />
          </Thumbnail>
        ))}
      </Stack>
      <Box flex="1" borderRadius="2xl" overflow="hidden" h={{ base: "360px", md: "560px", lg: "700px" }}>
        <Image src={imagens[atual]} alt={titulo} w="full" h="full" objectFit="cover" />
      </Box>
    </Flex>
  )
}
