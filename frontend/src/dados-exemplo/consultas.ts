import type { Paginated } from "@/types/api"
import { LIMITE_BAIXO_ESTOQUE } from "@/constants/pedidos"
import { normalizeText } from "@/utils/normalizeText"
import { atividadesExemplo, curadoriaExemplo, notificacoesAdminExemplo } from "./admin"
import { artesaosExemplo } from "./artesaos"
import { EMAIL_COMPRADOR_DEMO, pedidosExemplo } from "./pedidos"
import { produtosExemplo } from "./produtos"
import type { Acompanhamento, PainelAdmin, TipoCuradoria } from "@/types/admin"
import type { ResumoPainelArtesao } from "@/types/artesao"
import type { FiltrosProduto, Produto, StatusProduto } from "@/types/produto"
import type { OpcaoFrete } from "@/types/frete"

// Filtros e contas feitos direto nos dados de exemplo, só para as telas terem o que mostrar.
// Ao integrar com a Fake API, cada função aqui vira uma chamada a um service.

// Sem login ainda: as áreas logadas usam um artesão de demonstração.
export const ARTESAO_LOGADO_ID = "a1"

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

export const buscarProduto = (id: string) => produtosExemplo.find((p) => p.id === id)

export const meusPedidos = () => pedidosExemplo.filter((p) => p.comprador.email === EMAIL_COMPRADOR_DEMO)

export const meusProdutos = () => produtosExemplo.filter((p) => p.artesaoId === ARTESAO_LOGADO_ID)

// Números do catálogo e do estoque calculados a partir das peças do artesão.
export function resumoPainelArtesao(minhas: Produto[] = meusProdutos()): ResumoPainelArtesao {
  const vendidas = pedidosExemplo
    .filter((pedido) => pedido.status !== "cancelado")
    .flatMap((pedido) => pedido.itens)
    .filter((item) => minhas.some((p) => p.id === item.produtoId))
    .reduce((soma, item) => soma + item.quantidade, 0)
  const ativas = minhas.filter((p) => p.status === "publicado" || p.status === "indisponivel")

  return {
    catalogo: {
      publicadas: minhas.filter((p) => p.status === "publicado").length,
      emAnalise: minhas.filter((p) => p.status === "emAnalise").length,
      vendidas,
      indisponiveis: minhas.filter((p) => p.status === "indisponivel").length,
    },
    estoque: {
      disponiveis: ativas.filter((p) => p.estoque > LIMITE_BAIXO_ESTOQUE).length,
      baixoEstoque: ativas.filter((p) => p.estoque > 0 && p.estoque <= LIMITE_BAIXO_ESTOQUE).length,
      esgotadas: ativas.filter((p) => p.estoque === 0).length,
    },
  }
}

// Simulação de frete: CEPs de Pernambuco (50 a 56) pagam menos.
export function opcoesFrete(cep: string): OpcaoFrete[] {
  const prefixo = Number(cep.replace(/\D/g, "").slice(0, 2))
  const local = prefixo >= 50 && prefixo <= 56
  return [
    { modalidade: "pac", nome: "PAC", valor: local ? 18.9 : 32.4, prazo: local ? "6 a 8 dias úteis" : "8 a 12 dias úteis" },
    { modalidade: "sedex", nome: "SEDEX", valor: local ? 27.5 : 49.9, prazo: local ? "2 a 4 dias úteis" : "4 a 6 dias úteis" },
  ]
}

export const painelAdmin: PainelAdmin = {
  resumo: {
    pedidosHoje: 18,
    vendasMes: 24380,
    artesaosAtivos: artesaosExemplo.filter((a) => a.status === "publicado").length,
    produtosPublicados: produtosExemplo.filter((p) => p.status === "publicado").length,
    clientes: 5,
  },
  pendencias: [
    { id: "pd1", titulo: "Artesãos aguardando curadoria", quantidade: curadoriaExemplo.filter((c) => c.tipo === "artesaos").length, href: "/admin/curadoria" },
    { id: "pd2", titulo: "Peças aguardando aprovação", quantidade: curadoriaExemplo.filter((c) => c.tipo === "pecas").length, href: "/admin/curadoria" },
    { id: "pd3", titulo: "Pedidos em processamento", quantidade: pedidosExemplo.filter((p) => p.status === "processando" || p.status === "emSeparacao").length, href: "/admin/acompanhamento" },
  ],
  notificacoes: notificacoesAdminExemplo,
  atividades: atividadesExemplo,
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
