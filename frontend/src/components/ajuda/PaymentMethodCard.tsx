import { Box, Flex, HStack, Stack, Text } from "@chakra-ui/react"
import { BiCheck } from "react-icons/bi"
import type { IconType } from "react-icons"
import { Tile } from "@/components/common/Tile"

type PaymentMethodCardProps = {
  icon: IconType
  title: string
  description: string
  items: string[]
}

export function PaymentMethodCard({ icon: Icon, title, description, items }: PaymentMethodCardProps) {
  return (
    <Tile>
      <Stack gap={3}>
        <Flex boxSize="40px" bg="origem.laranja" color="white" borderRadius="full" align="center" justify="center">
          <Icon size={18} />
        </Flex>
        <Box>
          <Text fontWeight="bold" textTransform="uppercase" fontSize="sm" color="origem.texto" mb={1}>
            {title}
          </Text>
          <Text fontSize="sm" color="origem.textoSuave">{description}</Text>
        </Box>
        <Stack gap={2} mt={2}>
          {items.map((item) => (
            <HStack key={item} align="flex-start" gap={2}>
              <Box color="origem.laranja" flexShrink={0} mt="2px"><BiCheck size={16} /></Box>
              <Text fontSize="sm" color="origem.texto">{item}</Text>
            </HStack>
          ))}
        </Stack>
      </Stack>
    </Tile>
  )
}
