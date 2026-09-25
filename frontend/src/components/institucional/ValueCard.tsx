import { Box, Flex, Stack, Text } from "@chakra-ui/react"
import type { IconType } from "react-icons"
import { Tile } from "@/components/common/Tile"

type ValueCardProps = {
  icon: IconType
  title: string
  description: string
}

export function ValueCard({ icon: Icon, title, description }: ValueCardProps) {
  return (
    <Tile flex="1">
      <Stack gap={3}>
        <Flex
          boxSize="44px"
          bg="origem.laranja"
          color="white"
          borderRadius="full"
          alignItems="center"
          justifyContent="center"
        >
          <Icon size={20} />
        </Flex>
        <Box>
          <Text fontWeight="bold" textTransform="uppercase" fontSize="sm" color="origem.texto" mb={1}>
            {title}
          </Text>
          <Text fontSize="sm" color="origem.textoSuave">
            {description}
          </Text>
        </Box>
      </Stack>
    </Tile>
  )
}
