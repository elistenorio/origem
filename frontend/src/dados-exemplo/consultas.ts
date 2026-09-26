import type { Paginated } from "@/types/api"
import { normalizeText } from "@/utils/normalizeText"
import { atividadesExemplo, curadoriaExemplo } from "./admin"
import { artesaosExemplo } from "./artesaos"
import { pedidosExemplo } from "./pedidos"
import { produtosExemplo } from "./produtos"
import type { Acompanhamento, TipoCuradoria } from "@/types/admin"
import type { FiltrosProduto, StatusProduto } from "@/types/produto"

// Filtros e contas feitos direto nos dados de exemplo, só para as telas terem o que mostrar.
// Ao integrar com a Fake API, cada função aqui vira uma chamada a um service.

export function paginar<T>(itens: T[], page = 1, pageSize = 12): Paginated<T> {
  const atual = Math.max(1, page)
  const inicio = (atual - 1) * pageSize
  return { items: itens.slice(inicio, inicio + pageSize), page: atual, pageSize, total: itens.length }
}

export function filtrarProdutos(filtros: FiltrosProduto & { status?: StatusProduto }) {
  const busca = normalizeText(filtros.busca ?? "")
  const precoMin = filtros.precoMin ?? 0
  const precoMax = filtros.precoMax ?? Infinity

  const filtrados = produtosExemplo.filter((p) => {
    if (busca) {
      const texto = normalizeText([p.titulo, p.artesaoNome, p.cidade, p.tecnica, p.material, ...p.tags].join(" "))
      if (!texto.includes(busca)) return false
    }
    if (filtros.categoria && p.categoria !== filtros.categoria) return false
    if (filtros.tecnica && p.tecnica !== filtros.tecnica) return false
    if (filtros.material && p.material !== filtros.material) return false
    if (filtros.regiao && p.regiao !== filtros.regiao) return false
    if (filtros.status && p.status !== filtros.status) return false
    if (filtros.artesaoId && p.artesaoId !== filtros.artesaoId) return false
    if (p.preco < precoMin || p.preco > precoMax) return false
    if (filtros.disponivel === "sim" && p.estoque <= 0) return false
    return true
  })

  if (filtros.ordenar === "menor_preco") filtrados.sort((a, b) => a.preco - b.preco)
  if (filtros.ordenar === "maior_preco") filtrados.sort((a, b) => b.preco - a.preco)
  if (filtros.ordenar === "recentes") filtrados.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))

  return paginar(filtrados, filtros.page, filtros.pageSize)
}

const contarPedidos = (status: string) => pedidosExemplo.filter((p) => p.status === status).length

export const acompanhamento: Acompanhamento = {
  contagem: {
    processando: contarPedidos("processando") + contarPedidos("emSeparacao"),
    enviado: contarPedidos("enviado"),
    entregue: contarPedidos("entregue"),
    cancelado: contarPedidos("cancelado"),
  },
  alertas: [
    { id: "al1", titulo: "Envio atrasado", descricao: "Pedido #10471 sem código de rastreio há 6 dias", gravidade: "alta" },
    { id: "al2", titulo: "Troca solicitada", descricao: "Pedido #10431: peça chegou trincada", gravidade: "media" },
  ],
  artesaosRecentes: [...artesaosExemplo].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).slice(0, 3),
  produtosPendentes: produtosExemplo.filter((p) => p.status === "emAnalise"),
  atividades: atividadesExemplo.slice(0, 3),
}

export const filaCuradoria = (tipo: TipoCuradoria) =>
  curadoriaExemplo.filter((c) => c.tipo === tipo).sort((a, b) => b.enviadoEm.localeCompare(a.enviadoEm))
