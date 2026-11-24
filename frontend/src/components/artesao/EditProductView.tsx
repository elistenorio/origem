"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import NextLink from "next/link"
import { Alert, Button, Card, HStack, Link, SimpleGrid, Text } from "@chakra-ui/react"
import { BiShow, BiTrash } from "react-icons/bi"
import { SectionCard } from "@/components/common/SectionCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { OrigemDialog } from "@/components/common/OrigemDialog"
import { EmptyMessage } from "@/components/feedback/EmptyMessage"
import { DataState } from "@/components/feedback/DataState"
import { useApi } from "@/hooks/useApi"
import { minhaContaService } from "@/services/minhaConta.service"
import { ApiError } from "@/services/api"
import { produtoParaFormulario } from "@/utils/productForm"
import { formatDate } from "@/utils/formatDate"
import { ArtisanShell } from "./ArtisanShell"
import { PanelPageHeader } from "@/components/layout/PanelPageHeader"
import { CurationNotice } from "./CurationNotice"
import { ProductForm } from "./ProductForm"

// Editar peça existente no catálogo (Tela 06.1 - edição). A peça vem de GET /minha-conta/produtos.
// Salvar usa PUT /minha-conta/produtos/{id}; excluir, DELETE (peça já vendida não pode ser excluída).
export function EditProductView({ id }: { id: string }) {
  const router = useRouter()
  const { data: pecas, loading, error, recarregar } = useApi(() => minhaContaService.produtos(), [])
  const produto = pecas?.find((p) => p.id === id)
  const [confirmarExclusao, setConfirmarExclusao] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState<string>()

  async function excluir() {
    setExcluindo(true)
    setErroExclusao(undefined)
    try {
      await minhaContaService.excluirProduto(id)
      router.push("/artesao/catalogo")
    } catch (e) {
      setErroExclusao(e instanceof ApiError ? e.message : "Não foi possível excluir a peça.")
      setExcluindo(false)
    }
  }

  function fecharExclusao() {
    setConfirmarExclusao(false)
    setErroExclusao(undefined)
  }

  return (
    <ArtisanShell ativo="catalogo">
      <Link asChild variant="suave" mb="3">
        <NextLink href="/artesao/catalogo">← Voltar para Minhas peças</NextLink>
      </Link>
      <DataState loading={loading} error={error} onRetry={recarregar}>
      {!produto ? (
        <EmptyMessage titulo="Peça não encontrada" />
      ) : (
          <>
            <PanelPageHeader titulo="Editar peça" descricao="Mudanças em fotos, nome, descrição ou preço passam por uma nova análise rápida da curadoria.">
              <Button asChild variant="claro">
                <NextLink href={`/produtos/${produto.id}`}><BiShow /> Ver como fica no site</NextLink>
              </Button>
            </PanelPageHeader>
            <ProductForm
              key={produto.id}
              inicial={produtoParaFormulario(produto)}
              textoEnviar="Salvar alterações"
              onSalvar={async (dados) => {
                await minhaContaService.editarProduto(produto.id, dados)
                router.push("/artesao/catalogo")
              }}
              lateral={
                <>
                  <SectionCard title="Status da peça">
                    <HStack gap="3" wrap="wrap">
                      <StatusBadge status={produto.status} />
                      <Text textStyle="apoio">Cadastrada em {formatDate(produto.criadoEm)}</Text>
                    </HStack>
                    <CurationNotice status={produto.status} parecer={produto.parecerCuradoria} item="peca" />
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
              onClose={fecharExclusao}
              titulo="Excluir peça?"
              descricao={`"${produto.titulo}" sairá do seu catálogo. Essa ação não pode ser desfeita.`}
              size="sm"
              rodape={
                <>
                  <Button variant="claro" onClick={fecharExclusao}>Voltar</Button>
                  <Button variant="perigo" onClick={excluir} loading={excluindo}>Excluir</Button>
                </>
              }
            >
              {erroExclusao && <Alert.Root status="error"><Alert.Indicator /><Alert.Title>{erroExclusao}</Alert.Title></Alert.Root>}
            </OrigemDialog>
          </>
      )}
      </DataState>
    </ArtisanShell>
  )
}
