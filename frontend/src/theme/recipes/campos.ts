import { defineRecipe, defineStyle } from "@chakra-ui/react"

// Visual comum a input e textarea
export const campoOrigem = defineStyle({
  bg: "white",
  borderWidth: "1.5px",
  borderColor: "origem.borda",
  borderRadius: "xl",
  color: "origem.texto",
  fontSize: "md",
  minH: "56px",
  px: "4",
  _placeholder: { color: "origem.textoSuave" },
  // Ao trocar de variante, o anel de foco padrão do Chakra sai junto.
  // Sem isto, quem navega pelo teclado não vê qual campo está ativo.
  _focusVisible: {
    outlineWidth: "2px",
    outlineStyle: "solid",
    outlineColor: "origem.laranja",
    outlineOffset: "2px",
  },
})

// Para inputs que moram dentro de um pill/HStack que já tem o fundo:
// sem cor, sem borda, sem padding próprio.
const campoSemEstilo = defineStyle({
  bg: "transparent",
  borderWidth: "0",
  borderRadius: "0",
  minH: "auto",
  px: "0",
  _focusVisible: { outline: "none" },
})

export const inputRecipe = defineRecipe({
  variants: { variant: { origem: campoOrigem, unstyled: campoSemEstilo } },
  defaultVariants: { variant: "origem" }, // vira o padrão de todo <Input />
})

export const textareaRecipe = defineRecipe({
  variants: { variant: { origem: campoOrigem } },
  defaultVariants: { variant: "origem" },
})