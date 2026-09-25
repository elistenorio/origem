import { Box, Heading, HStack, type BoxProps } from "@chakra-ui/react"

interface SectionCardProps extends BoxProps {
  title: string
  action?: React.ReactNode // botão/link no canto direito do título, ex.: "Editar dados"
}

export function SectionCard({ title, action, children, ...rest }: SectionCardProps) {
  return (
    <Box
      bg="origem.passoFundo"
      borderRadius="xl"
      p={6}
      display="flex"
      flexDirection="column"
      gap={4}
      {...rest}
    >
      <HStack justify="space-between" align="center">
        <Heading variant="secao" fontSize="md">
          {title}
        </Heading>
        {action}
      </HStack>
      {children}
    </Box>
  )
}
