import { Box, HStack, Stack, Text } from "@chakra-ui/react"
import type { IconType } from "react-icons"

type InfoBoxProps = {
  icon: IconType
  title: string
  tone?: "aviso" | "neutro" // aviso: borda laranja (ex.: atraso). neutro: fundo bege (ex.: dica)
  children: React.ReactNode
}

export function InfoBox({ icon: Icon, title, tone = "neutro", children }: InfoBoxProps) {
  const isAviso = tone === "aviso"

  return (
    <HStack
      align="flex-start"
      gap={4}
      borderRadius="xl"
      p={5}
      bg={isAviso ? "origem.fundo" : "origem.passoFundo"}
      borderWidth={isAviso ? "1px" : "0"}
      borderColor="origem.laranja"
    >
      <Box color={isAviso ? "origem.laranja" : "origem.texto"} flexShrink={0} mt="2px">
        <Icon size={22} />
      </Box>
      <Stack gap={1}>
        <Text
          fontWeight="bold"
          textTransform="uppercase"
          fontSize="sm"
          color={isAviso ? "origem.laranja" : "origem.texto"}
        >
          {title}
        </Text>
        <Text fontSize="sm" color="origem.texto">
          {children}
        </Text>
      </Stack>
    </HStack>
  )
}
