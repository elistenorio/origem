import { HStack, Image, Stack, Text } from "@chakra-ui/react"

type AvatarItemProps = {
  src: string
  titulo: string
  subtitulo?: string
  formato?: "redondo" | "quadrado"   // redondo para pessoas, quadrado para peças
  tamanho?: string
}

// Foto pequena + nome + linha de apoio (listas e tabelas do admin).
export function AvatarItem({ src, titulo, subtitulo, formato = "quadrado", tamanho = "10" }: AvatarItemProps) {
  return (
    <HStack gap="3" minW="0">
      <Image src={src} alt="" boxSize={tamanho} borderRadius={formato === "redondo" ? "full" : "md"} objectFit="cover" flexShrink={0} />
      <Stack gap="0" minW="0">
        <Text fontWeight="bold" fontSize="sm">{titulo}</Text>
        {subtitulo && <Text textStyle="apoio">{subtitulo}</Text>}
      </Stack>
    </HStack>
  )
}
