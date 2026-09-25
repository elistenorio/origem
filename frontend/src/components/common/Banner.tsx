"use client"

import { chakra } from "@chakra-ui/react"
import { bannerRecipe } from "@/theme/recipes/banner"

// Faixa de destaque (estilo na recipe "banner"). Aceita tom="imagem" (padrão, com bgImage) ou tom="laranja".
export const Banner = chakra("section", bannerRecipe)
