import { defineRecipe } from "@chakra-ui/react"

export const buttonRecipe = defineRecipe({
  // Foco pelo teclado (Tab) sempre visível, em todos os botões.
  base: { fontWeight: "bold", fontSize: "md", _focusVisible: { outline: "3px solid", outlineColor: "origem.texto", outlineOffset: "2px" } },
  variants: {
    variant: {
      origem: {
        bg: "origem.laranja",
        color: "white",
        borderRadius: "full",
        minH: "52px",
        px: "8",
        _hover: { bg: "origem.laranjaEscuro" },
      },
      tracejado: {
        bg: "transparent",
        color: "origem.laranja",
        borderWidth: "1px",
        borderStyle: "dashed",
        borderColor: "origem.laranja",
        borderRadius: "full",
        minH: "52px",
        px: "4",
        justifyContent: "space-between",
        _hover: { bg: "origem.laranja/10" },
      },
      outline: {
        bg: "transparent",
        color: "origem.laranja",
        borderWidth: "1px",
        borderColor: "origem.laranja",
        borderRadius: "full",
        minH: "52px",
        px: "6",
        _hover: { bg: "origem.laranja", color: "white" },
      },
      // botão neutro (Voltar, Visualizar, ações secundárias)
      claro: {
        bg: "origem.passoFundo",
        color: "origem.texto",
        borderWidth: "1.5px",
        borderColor: "origem.texto",
        borderRadius: "full",
        minH: "52px",
        px: "6",
        _hover: { bg: "origem.busca" },
      },
      // botão marrom (Cancelar pedido, Solicitar ajustes)
      secundario: {
        bg: "origem.textoSuave",
        color: "white",
        borderRadius: "full",
        minH: "52px",
        px: "6",
        _hover: { opacity: 0.9 },
      },
      perigo: {
        bg: "origem.perigo",
        color: "white",
        borderRadius: "full",
        minH: "52px",
        px: "8",
        _hover: { opacity: 0.9 },
      },
      // Chips de filtro (ex.: categorias do FAQ) — mesmo tamanho nos dois estados,
      // para o chip selecionado não "pular" de altura.
      chip: {
        bg: "origem.busca",
        color: "origem.texto",
        borderRadius: "full",
        fontWeight: "bold",
        fontSize: "md",
        minH: "44px",
        px: "5",
        _hover: { bg: "origem.passoInativo", color: "origem.laranja", outline: "2px solid", outlineColor: "origem.laranja", outlineOffset: "-2px" },
      },
      chipSelecionado: {
        bg: "origem.laranja",
        color: "white",
        borderRadius: "full",
        fontWeight: "bold",
        fontSize: "md",
        minH: "44px",
        px: "5",
        _hover: { bg: "origem.laranjaEscuro" },
      },
    },
  },
  defaultVariants: { variant: "origem" },
})