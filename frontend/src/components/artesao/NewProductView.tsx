"use client"

import { useRouter } from "next/navigation"
import NextLink from "next/link"
import { Link } from "@chakra-ui/react"
import { PRODUTO_VAZIO } from "@/utils/productForm"
import { ArtisanShell } from "./ArtisanShell"
import { ArtisanPageHeader } from "./ArtisanPageHeader"
import { ProductForm } from "./ProductForm"

// Adicionar peça ao catálogo (Tela 06.1). Por enquanto salvar só volta para o catálogo (sem API).
export function NewProductView() {
  const router = useRouter()

  return (
    <ArtisanShell ativo="catalogo">
      <Link asChild variant="suave" mb="3">
        <NextLink href="/artesao/catalogo">← Voltar para Meu catálogo</NextLink>
      </Link>
      <ArtisanPageHeader titulo="Adicionar peça" descricao="Preencha as informações da sua peça. Depois de enviada, ela passa pela curadoria do Origem antes de aparecer na vitrine." />
      <ProductForm
        inicial={PRODUTO_VAZIO}
        onSalvar={() => router.push("/artesao/catalogo")}
      />
    </ArtisanShell>
  )
}
