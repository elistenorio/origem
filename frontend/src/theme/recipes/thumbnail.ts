import { defineRecipe } from "@chakra-ui/react"

// Miniatura clicável da galeria de fotos (página da peça). A selecionada (aria-pressed) ganha borda laranja.
// Uso: const Thumbnail = chakra("button", thumbnailRecipe)
export const thumbnailRecipe = defineRecipe({
  base: {
    flexShrink: 0,
    borderRadius: "xl",
    overflow: "hidden",
    borderWidth: "2px",
    borderColor: "transparent",
    cursor: "pointer",
    _pressed: { borderColor: "origem.laranja" },
    _focusVisible: { outlineWidth: "2px", outlineStyle: "solid", outlineColor: "origem.laranja", outlineOffset: "2px" },
  },
})
