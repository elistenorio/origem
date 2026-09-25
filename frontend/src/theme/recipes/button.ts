import { defineRecipe } from "@chakra-ui/react"

export const buttonRecipe = defineRecipe({
  variants: {
    variant: {
      origem: {
        bg: "origem.laranja",
        color: "white",
        borderRadius: "lg",
        minH: "50px",
        px: "8",
        _hover: { opacity: 0.9 },
      },
      tracejado: {
        bg: "transparent",
        color: "origem.laranja",
        borderWidth: "1px",
        borderStyle: "dashed",
        borderColor: "origem.laranja",
        borderRadius: "lg",
        minH: "50px",
        px: "4",
        justifyContent: "space-between",
        _hover: { bg: "origem.laranja/10" },
      },
      outline: {
        bg: "transparent",
        color: "origem.laranja",
        borderWidth: "1px",
        borderColor: "origem.laranja",
        borderRadius: "lg",
        minH: "50px",
        px: "6",
        _hover: { bg: "origem.laranja", color: "white" },
      },
      // botão neutro (Voltar, Visualizar, ações secundárias)
      claro: {
        bg: "origem.passoFundo",
        color: "origem.texto",
        borderRadius: "lg",
        minH: "50px",
        px: "6",
        _hover: { bg: "origem.busca" },
      },
      // botão marrom (Cancelar pedido, Solicitar ajustes)
      secundario: {
        bg: "origem.textoSuave",
        color: "white",
        borderRadius: "lg",
        minH: "50px",
        px: "6",
        _hover: { opacity: 0.9 },
      },
      perigo: {
        bg: "origem.perigo",
        color: "white",
        borderRadius: "lg",
        minH: "50px",
        px: "8",
        _hover: { opacity: 0.9 },
      },
    },
  },
  defaultVariants: { variant: "origem" },
})