import { Box, HStack, Stack, Text } from "@chakra-ui/react"
import { BiCheck, BiX } from "react-icons/bi"
import { Tile } from "@/components/common/Tile"

type ChecklistCardProps = {
  title: string
  items: string[]
  tone: "permitido" | "proibido" // permitido: check verde. proibido: x vermelho.
}

export function ChecklistCard({ title, items, tone }: ChecklistCardProps) {
  const Icon = tone === "permitido" ? BiCheck : BiX
  const corIcone = tone === "permitido" ? "origem.sucesso" : "origem.perigo"

  return (
    <Tile>
      <Stack gap={4}>
        <Text fontWeight="bold" textTransform="uppercase" fontSize="sm" color="origem.texto">
          {title}
        </Text>
        <Stack gap={2}>
          {items.map((item) => (
            <HStack key={item} align="flex-start" gap={3}>
              <Box color={corIcone} flexShrink={0} mt="2px"><Icon size={18} /></Box>
              <Text fontSize="sm" color="origem.texto">{item}</Text>
            </HStack>
          ))}
        </Stack>
      </Stack>
    </Tile>
  )
}
