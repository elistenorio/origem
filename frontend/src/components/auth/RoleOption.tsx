import NextLink from "next/link"
import { Stack, Text } from "@chakra-ui/react"
import { Button } from "@chakra-ui/react"

type RoleOptionProps = {
  href: string
  label: string       // parte normal do botão: "Sou"
  highlight: string   // parte em negrito: "Artesão"
  description: string
}

export function RoleOption({ href, label, highlight, description }: RoleOptionProps) {
  return (
    <Stack align="center" gap="2" textAlign="center">
      <Button asChild>
        <NextLink href={href}>
          {label}{" "}
          <Text as="span" fontWeight="bold">{highlight}</Text>
        </NextLink>
      </Button>
      <Text color="origem.texto" maxW="260px">
        {description}
      </Text>
    </Stack>
  )
}