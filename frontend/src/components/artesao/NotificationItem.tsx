import { Box, HStack, Text } from "@chakra-ui/react"
import { BiBell } from "react-icons/bi"

type NotificationItemProps = {
  title: string
  description: React.ReactNode
}

export function NotificationItem({ title, description }: NotificationItemProps) {
  return (
    <Box>
      <HStack color="origem.texto" mb={1}>
        <BiBell />
        <Text fontWeight="bold" fontSize="sm">{title}</Text>
      </HStack>
      <Text fontSize="sm" color="origem.textoSuave" ml={6}>
        {description}
      </Text>
    </Box>
  )
}
