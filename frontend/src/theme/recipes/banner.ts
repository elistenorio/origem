import { defineRecipe } from "@chakra-ui/react"

// Faixa de destaque com imagem de fundo escurecida (home, sobre nós).
// Uso: const Banner = chakra("section", bannerRecipe)
export const bannerRecipe = defineRecipe({
  base: {
    position: "relative",
    borderRadius: "2xl",
    overflow: "hidden",
    color: "origem.fundo",
    backgroundSize: "cover",
    backgroundPosition: "center",
    _before: { content: '""', position: "absolute", inset: "0", bg: "origem.texto/60" },
    "& > *": { position: "relative" },
  },
  variants: {
    tom: {
      imagem: {},
      laranja: { bg: "origem.laranja", _before: { display: "none" } },
    },
  },
  defaultVariants: { tom: "imagem" },
})
