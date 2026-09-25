import { Heading, HStack, Stack, Text, type BoxProps } from "@chakra-ui/react"
import { Tile } from "@/components/common/Tile"

interface SectionCardProps extends BoxProps {
  title: string
  description?: React.ReactNode // legenda abaixo do título, ex.: "Últimos 12 meses"
  action?: React.ReactNode // botão/link no canto direito do título, ex.: "Editar dados"
}

export function SectionCard({ title, description, action, children, ...rest }: SectionCardProps) {
  return (
    <Tile display="flex" flexDirection="column" gap={4} {...rest}>
      <Stack gap={1}>
        <HStack justify="space-between" align="center">
          <Heading variant="secao" fontSize="md">
            {title}
          </Heading>
          {action}
        </HStack>
        {description && (
          <Text color="origem.textoSuave" fontSize="sm">
            {description}
          </Text>
        )}
      </Stack>
      {children}
    </Tile>
  )
}
