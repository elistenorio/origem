import { Box, Flex, HStack, Stack, Text } from "@chakra-ui/react"
import type { IconType } from "react-icons"

type StepCardProps = {
  icon: IconType
  number: string // "01", "02"...
  title: string
  description: string
}

export function StepCard({ icon: Icon, number, title, description }: StepCardProps) {
  return (
    <Stack bg="origem.passoFundo" borderRadius="xl" p={6} gap={4}>
      <HStack justify="space-between" align="flex-start">
        <Flex boxSize="40px" bg="origem.laranja" color="white" borderRadius="full" align="center" justify="center">
          <Icon size={18} />
        </Flex>
        <Text fontFamily="heading" fontSize="4xl" color="origem.passoInativo" lineHeight="1">
          {number}
        </Text>
      </HStack>
      <Box>
        <Text fontWeight="bold" textTransform="uppercase" fontSize="sm" color="origem.texto" mb={1}>
          {title}
        </Text>
        <Text fontSize="sm" color="origem.textoSuave">
          {description}
        </Text>
      </Box>
    </Stack>
  )
}
