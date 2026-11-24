import NextLink from "next/link"
import { Button, Stack, Text } from "@chakra-ui/react"

// Passos para pedir uma senha nova à equipe Origem (o envio automático por e-mail ainda não existe).
export function PasswordRecoveryHelp() {
  return (
    <Stack gap="5">
      <Text>
        Fale com a equipe do Origem que a gente cria uma senha nova para você. Leva poucos minutos em horário de atendimento.
      </Text>
      <Stack gap="2" as="ol" ps="5" listStyleType="decimal">
        <Text as="li">Mande uma mensagem no WhatsApp <strong>(81) 90000-0000</strong> ou um e-mail para <strong>contato@origem.com</strong>.</Text>
        <Text as="li">Informe o e-mail que você usa para entrar no Origem.</Text>
        <Text as="li">A equipe confere seus dados e envia uma senha provisória.</Text>
        <Text as="li">Entre com ela e troque a senha em Minha conta.</Text>
      </Stack>
      <Text textStyle="apoio">Atendimento de segunda a sábado, das 9h às 19h30.</Text>
      <Button asChild variant="origem">
        <NextLink href="/login">Voltar para o login</NextLink>
      </Button>
    </Stack>
  )
}
