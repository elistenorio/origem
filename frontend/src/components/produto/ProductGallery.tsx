import { Box, Flex, Image, VStack } from "@chakra-ui/react"
import { BiSearch } from "react-icons/bi"

type ProductGalleryProps = {
  titulo: string
  imagemUrl: string   // capa, mostrada em destaque
  imagens: string[]   // miniaturas (a primeira é a capa)
}

// Galeria da página de detalhe: miniaturas à esquerda e a capa em destaque.
export function ProductGallery({ titulo, imagemUrl, imagens }: ProductGalleryProps) {
  return (
    <Flex gap={4} flex="1">
      <VStack gap={4}>
        {imagens.map((url, i) => (
          <Box key={url} w="80px" h="80px" borderRadius="md" overflow="hidden" borderWidth={i === 0 ? "2px" : "0"} borderColor="origem.laranja">
            <Image src={url} alt={`Foto ${i + 1} de ${titulo}`} w="full" h="full" objectFit="cover" />
          </Box>
        ))}
      </VStack>
      <Box flex="1" borderRadius="2xl" overflow="hidden" position="relative" h={{ base: "400px", md: "500px" }}>
        <Image src={imagemUrl} alt={titulo} w="full" h="full" objectFit="cover" />
        <Box position="absolute" bottom={4} right={4} bg="white" p={2} borderRadius="full" cursor="pointer" color="origem.texto">
          <BiSearch size={20} />
        </Box>
      </Box>
    </Flex>
  )
}
