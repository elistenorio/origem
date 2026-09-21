import { Box, Heading } from "@chakra-ui/react"

type AuthCardProps = {
  title: string
  children: React.ReactNode
}

export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <Box
      bg="origem.fundo"
      borderRadius="3xl"
      boxShadow="lg"
      p={{ base: 6, md: 10 }}
      w="full"
      maxW="md"
    >
      <Heading
        as="h1"
        size="3xl"
        textAlign="center"
        textTransform="uppercase"
        color="origem.laranja"
        mb="8"
      >
        {title}
      </Heading>
      {children}
    </Box>
  )
}