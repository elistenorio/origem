import { defineRecipe, defineStyle } from "@chakra-ui/react"

// Visual comum a input e textarea
const campoOrigem = defineStyle({
  bg: "origem.busca",
  borderWidth: "0",
  borderRadius: "lg",
  color: "origem.texto",
  minH: "50px",
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

export const inputRecipe = defineRecipe({
  variants: { variant: { origem: campoOrigem } },
  defaultVariants: { variant: "origem" }, // vira o padrão de todo <Input />
})

export const textareaRecipe = defineRecipe({
  variants: { variant: { origem: campoOrigem } },
  defaultVariants: { variant: "origem" },
})