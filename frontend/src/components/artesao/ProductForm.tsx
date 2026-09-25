"use client"

import { useState } from "react"
import { Alert, Button, Flex, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { Panel } from "@/components/common/Panel"
import { FormField } from "@/components/common/FormField"
import { TextareaField } from "@/components/common/TextareaField"
import { SelectField } from "@/components/common/SelectField"
import { AppCheckbox } from "@/components/common/AppCheckbox"
import { FileField } from "@/components/common/FileField"
import { CATEGORIAS } from "@/constants/categorias"
import { TECNICAS } from "@/constants/tecnicas"
import { MATERIAIS } from "@/constants/materiais"
import { validarFormularioProduto } from "@/utils/productForm"
import { formatCurrency } from "@/utils/formatCurrency"
import type { ProdutoInput } from "@/dados-exemplo/tipos"

const TAXA_ORIGEM = 0.12
const PRAZOS = [{ value: "1", label: "Até 1 dia útil" }, { value: "3", label: "Até 3 dias úteis" }, { value: "7", label: "Até 7 dias úteis (sob encomenda)" }]
const EMBALAGENS = [{ value: "caixa", label: "Caixa reforçada" }, { value: "envelope", label: "Envelope acolchoado" }, { value: "tubo", label: "Tubo (gravuras e telas)" }]
const selecione = (opcoes: { value: string; label: string }[]) => [{ value: "", label: "Selecione" }, ...opcoes]

type ProductFormProps = {
  inicial: ProdutoInput
  onSalvar: (dados: ProdutoInput) => void
  lateral?: React.ReactNode   // painéis extras na coluna lateral (tela de edição)
  textoEnviar?: string
}

// Formulário de peça do artesão, usado em "Adicionar peça" e "Editar peça".
export function ProductForm({ inicial, onSalvar, lateral, textoEnviar = "Enviar para análise" }: ProductFormProps) {
  const [dados, setDados] = useState<ProdutoInput>(inicial)
  const [erros, setErros] = useState<ReturnType<typeof validarFormularioProduto>>({})
  const [fotos, setFotos] = useState<File[]>([])

  const alterar = <K extends keyof ProdutoInput>(campo: K, valor: ProdutoInput[K]) => setDados((d) => ({ ...d, [campo]: valor }))
  const texto = (campo: "titulo" | "altura" | "largura" | "profundidade" | "peso") => ({
    value: dados[campo], onChange: (e: React.ChangeEvent<HTMLInputElement>) => alterar(campo, e.target.value), error: erros[campo],
  })

  function salvar(enviarParaAnalise: boolean) {
    const final = { ...dados, enviarParaAnalise }
    const encontrados = validarFormularioProduto(final)
    setErros(encontrados)
    if (Object.keys(encontrados).length === 0) onSalvar(final)
  }

  return (
    <Stack gap="6">
      <Flex gap="6" direction={{ base: "column", lg: "row" }} align="flex-start">
        <Stack w={{ base: "full", lg: "380px" }} gap="6" flexShrink={0}>
          <Panel title="Fotos da peça" description="Adicione de 3 a 8 fotos com boa iluminação. A primeira será a capa.">
            <FileField label="Fotos da peça" value={fotos} onChange={setFotos} multiple />
            <Text textStyle="apoio">Dica: mostre a peça de frente, de lado, os detalhes da técnica e uma foto em uso para dar noção de tamanho.</Text>
          </Panel>
          {lateral}
        </Stack>

        <Stack flex="1" gap="6" w="full">
          <Panel title="Sobre a peça">
            <FormField label="Nome da peça" placeholder="Ex.: Jarro Tradicional" {...texto("titulo")} />
            <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
              <SelectField label="Categoria" options={selecione(CATEGORIAS)} value={dados.categoria} onChange={(v) => alterar("categoria", v)} error={erros.categoria} />
              <SelectField label="Técnica" options={selecione(TECNICAS)} value={dados.tecnica} onChange={(v) => alterar("tecnica", v)} />
            </SimpleGrid>
            <TextareaField label="Descrição" placeholder="Conte a história da peça, como ela foi feita e o que a torna especial." value={dados.descricao} onChange={(e) => alterar("descricao", e.target.value)} error={erros.descricao} rows={5} />
            <SelectField label="Material principal" options={selecione(MATERIAIS)} value={dados.material} onChange={(v) => alterar("material", v)} />
          </Panel>

          <Panel title="Medidas e peso" description="Informe as medidas da peça pronta, sem a embalagem.">
            <SimpleGrid columns={{ base: 2, md: 4 }} gap="4">
              <FormField label="Altura (cm)" inputMode="decimal" {...texto("altura")} />
              <FormField label="Largura (cm)" inputMode="decimal" {...texto("largura")} />
              <FormField label="Prof. (cm)" inputMode="decimal" {...texto("profundidade")} />
              <FormField label="Peso (kg)" inputMode="decimal" {...texto("peso")} />
            </SimpleGrid>
          </Panel>

          <Panel title="Estoque e preço">
            <AppCheckbox checked={dados.pecaUnica} onCheckedChange={(e) => { alterar("pecaUnica", !!e.checked); if (e.checked) alterar("estoque", 1) }}>
              Peça única (apenas 1 unidade)
            </AppCheckbox>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
              <FormField label="Quantidade disponível" type="number" min={0} disabled={dados.pecaUnica} value={String(dados.estoque)} onChange={(e) => alterar("estoque", Number(e.target.value))} error={erros.estoque} />
              <FormField label="Preço (R$)" type="number" min={0} step="0.01" value={dados.preco ? String(dados.preco) : ""} onChange={(e) => alterar("preco", Number(e.target.value))} error={erros.preco} />
            </SimpleGrid>
            <Text textStyle="apoio">
              O Origem retém {TAXA_ORIGEM * 100}% do valor de cada venda. Você recebe {formatCurrency(dados.preco * (1 - TAXA_ORIGEM))} por unidade.
            </Text>
          </Panel>

          <Panel title="Informações de envio" description="Usamos esses dados para calcular o frete e o prazo para o comprador.">
            <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
              <SelectField label="Prazo para postagem" options={PRAZOS} value={dados.prazoPostagem} onChange={(v) => alterar("prazoPostagem", v)} />
              <SelectField label="Tipo de embalagem" options={EMBALAGENS} value={dados.embalagem} onChange={(v) => alterar("embalagem", v)} />
            </SimpleGrid>
            <TextareaField label="Cuidados no envio (opcional)" placeholder="Ex.: peça frágil, enviar com plástico bolha." value={dados.cuidadosEnvio} onChange={(e) => alterar("cuidadosEnvio", e.target.value)} />
          </Panel>
        </Stack>
      </Flex>

      {Object.keys(erros).length > 0 && <Alert.Root status="warning"><Alert.Indicator /><Alert.Title>Revise os campos destacados.</Alert.Title></Alert.Root>}
      <Flex gap="3" justify="flex-end" wrap="wrap">
        <Button variant="claro" onClick={() => salvar(false)}>Salvar rascunho</Button>
        <Button variant="origem" onClick={() => salvar(true)}>{textoEnviar}</Button>
      </Flex>
    </Stack>
  )
}
