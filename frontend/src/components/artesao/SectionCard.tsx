import { Box, Heading, BoxProps } from "@chakra-ui/react"

interface SectionCardProps extends BoxProps {
  title: string
}

export function SectionCard({ title, children, ...rest }: SectionCardProps) {
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
      <Heading variant="secao" fontSize="md" mb={2}>
        {title}
      </Heading>
      {children}
    </Box>
  )
}
