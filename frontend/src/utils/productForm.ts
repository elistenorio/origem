import type { ProdutoDetalhe, ProdutoInput } from "@/dados-exemplo/tipos"

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
export const produtoParaFormulario = (p: ProdutoDetalhe): ProdutoInput => ({
  ...PRODUTO_VAZIO,
  ...lerMedidas(p.medidas),
  titulo: p.titulo, categoria: p.categoria, descricao: p.descricao, material: p.material, tecnica: p.tecnica,
  pecaUnica: p.pecaUnica, estoque: p.estoque, preco: p.preco, cuidadosEnvio: p.cuidados,
})

export function validarFormularioProduto(dados: ProdutoInput): Partial<Record<keyof ProdutoInput, string>> {
  const erros: Partial<Record<keyof ProdutoInput, string>> = {}
  if (!dados.titulo.trim()) erros.titulo = "Informe o nome da peça."
  if (!dados.categoria) erros.categoria = "Escolha a categoria."
  if (dados.enviarParaAnalise) {
    if (!dados.descricao.trim()) erros.descricao = "Escreva a descrição da peça."
    if (!(dados.preco > 0)) erros.preco = "Informe um preço maior que zero."
    if (!dados.pecaUnica && !(dados.estoque > 0)) erros.estoque = "Informe a quantidade disponível."
  }
  return erros
}
