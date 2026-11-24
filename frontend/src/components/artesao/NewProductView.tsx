"use client"

import { useRouter } from "next/navigation"
import NextLink from "next/link"
import { Link } from "@chakra-ui/react"
import { PRODUTO_VAZIO } from "@/utils/productForm"
import { ArtisanShell } from "./ArtisanShell"
import { PanelPageHeader } from "@/components/layout/PanelPageHeader"
import { ProductForm } from "./ProductForm"
import { minhaContaService } from "@/services/minhaConta.service"

// Adicionar peça ao catálogo (Tela 06.1). Salva com POST /minha-conta/produtos e volta para o catálogo.
export function NewProductView() {
  const router = useRouter()

  return (
    <ArtisanShell ativo="catalogo">
      <Link asChild variant="suave" mb="3">
        <NextLink href="/artesao/catalogo">← Voltar para Minhas peças</NextLink>
      </Link>
      <PanelPageHeader titulo="Adicionar peça" descricao="Preencha as informações da sua peça. Depois de enviada, ela passa pela curadoria do Origem antes de aparecer na vitrine." />
      <ProductForm
        inicial={PRODUTO_VAZIO}
        onSalvar={async (dados) => {
          await minhaContaService.criarProduto(dados)
          router.push("/artesao/catalogo")
        }}
      />
    </ArtisanShell>
  )
}
