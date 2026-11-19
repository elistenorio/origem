import { CATEGORIAS } from "@/constants/categorias"
import { MATERIAIS } from "@/constants/materiais"
import { TECNICAS } from "@/constants/tecnicas"
import { validarFormularioProduto } from "@/utils/productForm"
import type { Produto, ProdutoInput } from "@/types/produto"

// Apoio das rotas de criar e editar peça da Fake API (mesmas regras do backend em minhaConta.service.ts).

// Foto das peças novas, enquanto o envio de fotos não existe.
export const FOTO_PADRAO_PECA = "https://picsum.photos/seed/origem-peca-nova/600/600"

// Primeira mensagem de erro do formulário, ou undefined se estiver tudo certo.
export function erroDaPeca(input: ProdutoInput | null): string | undefined {
  if (!input || typeof input.titulo !== "string") return "Dados da peça inválidos."
  const erros = Object.values(validarFormularioProduto(input))
  if (erros.length > 0) return erros[0]
  if (!CATEGORIAS.some((c) => c.value === input.categoria)) return "Categoria inválida."
  if (!TECNICAS.some((t) => t.value === input.tecnica)) return "Técnica inválida."
  if (!MATERIAIS.some((m) => m.value === input.material)) return "Material inválido."
  return undefined
}

// Campos da peça que vêm do formulário: medidas "largura × altura × profundidade cm", etiquetas,
// peça única com 1 unidade e o status (rascunho ou em análise).
export function camposDaPeca(input: ProdutoInput) {
  const lados = [input.largura, input.altura, input.profundidade]
  const material = MATERIAIS.find((m) => m.value === input.material)?.label ?? input.material
  return {
    titulo: input.titulo.trim(),
    tags: input.pecaUnica ? ["Peça única", material] : [material],
    medidas: lados.some((lado) => lado) ? `${lados.join(" × ")}cm` : "",
    preco: input.preco,
    categoria: input.categoria,
    tecnica: input.tecnica,
    material: input.material,
    estoque: input.pecaUnica ? 1 : input.estoque,
    pecaUnica: input.pecaUnica,
    status: (input.enviarParaAnalise ? "emAnalise" : "rascunho") as Produto["status"],
    descricao: input.descricao.trim(),
    cuidados: input.cuidadosEnvio.trim(),
    peso: input.peso || undefined,
    prazoPostagem: input.prazoPostagem,
    embalagem: input.embalagem,
  }
}
