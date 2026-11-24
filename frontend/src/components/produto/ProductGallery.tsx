import { Box, Flex, Image } from "@chakra-ui/react"
import { BiSearch } from "react-icons/bi"

type ProductGalleryProps = {
  titulo: string
  imagemUrl: string   // capa, mostrada em destaque
  imagens: string[]   // miniaturas (a primeira é a capa)
}

// Galeria da página de detalhe: capa em destaque e miniaturas à esquerda (no celular, embaixo da capa).
// minW="0" deixa a galeria encolher: sem ele, uma foto larga empurra a galeria por cima do painel de compra.
export function ProductGallery({ titulo, imagemUrl, imagens }: ProductGalleryProps) {
  return (
    <Flex gap={4} flex="1" minW="0" align="flex-start" direction={{ base: "column-reverse", md: "row" }}>
      <Flex gap={4} flexShrink={0} direction={{ base: "row", md: "column" }} overflowX={{ base: "auto", md: "visible" }} maxW="full">
        {imagens.map((url, i) => (
          <Box key={url} w="80px" h="80px" flexShrink={0} borderRadius="md" overflow="hidden" borderWidth={i === 0 ? "2px" : "0"} borderColor="origem.laranja">
            <Image src={url} alt={`Foto ${i + 1} de ${titulo}`} w="full" h="full" objectFit="cover" />
          </Box>
        ))}
      </Flex>
      <Box flex="1" minW="0" w="full" borderRadius="2xl" overflow="hidden" position="relative" aspectRatio="4 / 3" maxH={{ md: "560px" }} bg="origem.busca">
        <Image src={imagemUrl} alt={titulo} w="full" h="full" objectFit="cover" />
        <Box position="absolute" bottom={4} right={4} bg="white" p={2} borderRadius="full" cursor="pointer" color="origem.texto">
          <BiSearch size={20} />
        </Box>
      </Box>
    </Flex>
  )
}
