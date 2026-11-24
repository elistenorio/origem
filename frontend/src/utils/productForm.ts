import type { Produto, ProdutoInput } from "@/types/produto"
import { ESTOQUE_MAXIMO } from "@/utils/validation"

export const PRODUTO_VAZIO: ProdutoInput = {
  titulo: "", categoria: "", descricao: "", material: "", tecnica: "",
  altura: "", largura: "", profundidade: "", peso: "",
  pecaUnica: true, estoque: 1, preco: 0,
  prazoPostagem: "3", embalagem: "caixa", cuidadosEnvio: "", enviarParaAnalise: true,
}

// "15 × 27 × 15cm" -> largura, altura, profundidade
function lerMedidas(medidas: string) {
  const [largura = "", altura = "", profundidade = ""] = medidas.replace("cm", "").split("×").map((m) => m.trim())
  return { largura, altura, profundidade }
}

// Preenche o formulário de edição a partir da peça salva.
export const produtoParaFormulario = (p: Produto): ProdutoInput => ({
  ...PRODUTO_VAZIO,
  ...lerMedidas(p.medidas),
  titulo: p.titulo, categoria: p.categoria, descricao: p.descricao, material: p.material, tecnica: p.tecnica,
  pecaUnica: p.pecaUnica, estoque: p.estoque, preco: p.preco, cuidadosEnvio: p.cuidados,
  peso: p.peso ?? "", prazoPostagem: p.prazoPostagem ?? PRODUTO_VAZIO.prazoPostagem, embalagem: p.embalagem ?? PRODUTO_VAZIO.embalagem,
})

// Medida ou peso: vazio, ou número com vírgula ou ponto (ex.: "15", "1,2"). Mesma regra do backend.
const MEDIDA = /^\d+([.,]\d+)?$/
const CAMPOS_MEDIDA = ["altura", "largura", "profundidade", "peso"] as const

export function validarFormularioProduto(dados: ProdutoInput): Partial<Record<keyof ProdutoInput, string>> {
  const erros: Partial<Record<keyof ProdutoInput, string>> = {}
  if (!dados.titulo.trim()) erros.titulo = "Informe o nome da peça."
  if (!dados.categoria) erros.categoria = "Escolha a categoria."
  if (!dados.tecnica) erros.tecnica = "Escolha a técnica."
  if (!dados.material) erros.material = "Escolha o material principal."
  for (const campo of CAMPOS_MEDIDA) {
    if (dados[campo] && !MEDIDA.test(dados[campo])) erros[campo] = "Use só números (ex.: 15 ou 1,5)."
  }
  if (dados.estoque > ESTOQUE_MAXIMO) erros.estoque = `A quantidade pode ser no máximo ${ESTOQUE_MAXIMO} unidades.`
  if (dados.enviarParaAnalise) {
    if (!dados.descricao.trim()) erros.descricao = "Escreva a descrição da peça."
    if (!(dados.preco > 0)) erros.preco = "Informe um preço maior que zero."
    if (!dados.pecaUnica && !(dados.estoque > 0)) erros.estoque = "Informe a quantidade disponível."
  }
  return erros
}
