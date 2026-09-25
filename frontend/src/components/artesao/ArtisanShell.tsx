import { Box, Flex } from "@chakra-ui/react"
import { DashboardSidebar, type ItemMenuArtesao } from "./DashboardSidebar"

// Moldura das telas do artesão: menu lateral + área de conteúdo.
export function ArtisanShell({ ativo, children }: { ativo: ItemMenuArtesao; children: React.ReactNode }) {
  return (
    <Flex>
      <DashboardSidebar activeItem={ativo} />
      <Box flex="1" minW="0" px={{ base: 4, md: 10 }} py={{ base: 6, md: 8 }}>
        {children}
      </Box>
    </Flex>
  )
}
