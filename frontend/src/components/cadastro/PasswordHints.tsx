import { Box, Text } from "@chakra-ui/react"
import { SENHA_TAMANHO_MINIMO } from "@/utils/validation"

const hints = [
  "Utilize letras maiúsculas e minúsculas (ex: A, b, C).",
  "Inclua números (ex: 1, 2, 3).",
  "Adicione caracteres especiais (ex: @, #, $, !, &).",
  `Tenha no mínimo ${SENHA_TAMANHO_MINIMO} caracteres.`,
  "Evite informações pessoais como nome, data de nascimento ou sequências óbvias (1234, senha).",
]

export function PasswordHints() {
  return (
    <Box fontSize="xs" color="origem.texto">
      <Text fontWeight="bold">Crie uma senha forte</Text>
      <Box as="ul" listStyleType="disc" ps="5">
        {hints.map((hint) => (
          <li key={hint}>{hint}</li>
        ))}
      </Box>
    </Box>
  )
}