"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import NextLink from "next/link"
import { Button, Card, HStack, Link, SimpleGrid, Text } from "@chakra-ui/react"
import { BiShow, BiTrash } from "react-icons/bi"
import { SectionCard } from "@/components/common/SectionCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { OrigemDialog } from "@/components/common/OrigemDialog"
import { EmptyMessage } from "@/components/feedback/EmptyMessage"
import { buscarProduto } from "@/dados-exemplo/consultas"
import { produtoParaFormulario } from "@/utils/productForm"
import { formatDate } from "@/utils/formatDate"
import { ArtisanShell } from "./ArtisanShell"
import { PanelPageHeader } from "@/components/layout/PanelPageHeader"
import { ProductForm } from "./ProductForm"

// Editar peça existente no catálogo (Tela 06.1 - edição). Por enquanto com a peça de exemplo (sem API).
export function EditProductView({ id }: { id: string }) {
  const router = useRouter()
  const produto = buscarProduto(id)
  const [confirmarExclusao, setConfirmarExclusao] = useState(false)

  return (
    <ArtisanShell ativo="catalogo">
      <Link asChild variant="suave" mb="3">
        <NextLink href="/artesao/catalogo">← Voltar para Meu catálogo</NextLink>
      </Link>
      {!produto ? (
        <EmptyMessage titulo="Peça não encontrada" />
      ) : (
          <>
            <PanelPageHeader titulo="Editar peça" descricao="Mudanças em fotos, nome, descrição ou preço passam por uma nova análise rápida da curadoria.">
              <Button asChild variant="claro">
                <NextLink href={`/produto/${produto.id}`}><BiShow /> Visualizar peça</NextLink>
              </Button>
            </PanelPageHeader>
            <ProductForm
              key={produto.id}
              inicial={produtoParaFormulario(produto)}
              textoEnviar="Salvar alterações"
              onSalvar={() => router.push("/artesao/catalogo")}
              lateral={
                <>
                  <SectionCard title="Status da peça">
                    <HStack gap="3" wrap="wrap">
                      <StatusBadge status={produto.status} />
                      <Text textStyle="apoio">Cadastrada em {formatDate(produto.criadoEm)}</Text>
                    </HStack>
                  </SectionCard>
                  <SectionCard title="Vendas e estoque">
                    <SimpleGrid columns={2} gap="3">
                      <Card.Root variant="item">
                        <Card.Body>
                          <Text textStyle="numero">{produto.estoque}</Text>
                          <Text textStyle="apoio">Em estoque</Text>
                        </Card.Body>
                      </Card.Root>
                      <Card.Root variant="item">
                        <Card.Body>
                          <Text textStyle="numero">{produto.pecaUnica ? "Única" : "Várias"}</Text>
                          <Text textStyle="apoio">Tipo de peça</Text>
                        </Card.Body>
                      </Card.Root>
                    </SimpleGrid>
                  </SectionCard>
                  <Button variant="perigo" onClick={() => setConfirmarExclusao(true)}><BiTrash /> Excluir peça</Button>
                </>
              }
            />
            <OrigemDialog
              open={confirmarExclusao}
              onClose={() => setConfirmarExclusao(false)}
              titulo="Excluir peça?"
              descricao={`"${produto.titulo}" sairá do seu catálogo. Essa ação não pode ser desfeita.`}
              size="sm"
              rodape={
                <>
                  <Button variant="claro" onClick={() => setConfirmarExclusao(false)}>Voltar</Button>
                  <Button variant="perigo" onClick={() => router.push("/artesao/catalogo")}>Excluir</Button>
                </>
              }
            />
          </>
      )}
    </ArtisanShell>
  )
}
