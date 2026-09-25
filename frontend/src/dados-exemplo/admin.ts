import type { Atividade, Indicadores, ItemCuradoria, PeriodoIndicadores } from "./tipos"
import { FOTO_JARRO, imagem } from "./imagens"

export const atividadesExemplo: Atividade[] = [
  { id: "at1", autor: "Maria Clara", descricao: "aprovou a peça “Natureza Onírica”", data: "2026-09-25T13:55:00Z" },
  { id: "at2", autor: "Sarah Cyrne", descricao: "suspendeu o cliente joao.silva@email.com", data: "2026-09-25T13:38:00Z" },
  { id: "at3", autor: "Elis Tenório", descricao: "publicou o conteúdo “As Bordadeiras de Passira”", data: "2026-09-25T13:00:00Z" },
  { id: "at4", autor: "Giulia Ferreira", descricao: "criou a categoria “Instrumentos Musicais”", data: "2026-09-25T11:00:00Z" },
  { id: "at5", autor: "Caliel Melo", descricao: "respondeu a solicitação de troca do pedido #10431", data: "2026-09-24T17:00:00Z" },
]

export const notificacoesAdminExemplo = [
  { id: "n1", titulo: "Novo artesão cadastrado", descricao: "Zezinha do Barro, Caruaru, enviou documentos para análise." },
  { id: "n2", titulo: "Pedido #10402 entregue", descricao: "Renda Renascença entregue em Recife/PE." },
  { id: "n3", titulo: "Avaliação negativa", descricao: "Cliente avaliou o pedido #10455 com 2 estrelas." },
  { id: "n4", titulo: "Pagamento recusado", descricao: "Pedido #10490 teve o pagamento recusado pelo cartão." },
]

const MESES = ["out", "nov", "dez", "jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set"]
const ATUAL = [12400, 14100, 21800, 11200, 10900, 13500, 14800, 16200, 15100, 17900, 20300, 24400]
const ANTERIOR = [8100, 9400, 15200, 7800, 7500, 9200, 10100, 10800, 11400, 12000, 13900, 15600]

// Um conjunto de números por período (o filtro de período da tela troca o conjunto).
const escala: Record<PeriodoIndicadores, number> = { "7d": 0.25, "30d": 1, "12m": 9 }

export const indicadoresExemplo = (periodo: PeriodoIndicadores): Indicadores => {
  const k = escala[periodo]
  return {
    periodo,
    faturamento: Math.round(24380 * k),
    pedidos: Math.round(312 * k),
    ticketMedio: 78.14,
    pecasVendidas: Math.round(402 * k),
    artesaosAtivos: 142,
    clientes: 5914,
    produtosPublicados: 1286,
    visualizacoes: Math.round(48200 * k),
    variacoes: { faturamento: 20, pedidos: 14, ticketMedio: 5, pecasVendidas: 11 },
    faturamentoMensal: MESES.map((mes, i) => ({ mes, atual: ATUAL[i], anterior: ANTERIOR[i] })),
    vendasPorCategoria: [
      { categoria: "Cerâmica e Barro", quantidade: Math.round(128 * k) },
      { categoria: "Tecidos e Bordados", quantidade: Math.round(84 * k) },
      { categoria: "Pintura", quantidade: Math.round(61 * k) },
      { categoria: "Palha e Fibras", quantidade: Math.round(47 * k) },
      { categoria: "Madeira", quantidade: Math.round(33 * k) },
      { categoria: "Outras", quantidade: Math.round(49 * k) },
    ],
    pedidosPorSemana: [52, 61, 48, 70, 66, 74, 81, 92].map((q, i) => ({ semana: `S${i + 1}`, quantidade: Math.round(q * Math.max(k, 0.5)) })),
  }
}

export const curadoriaExemplo: ItemCuradoria[] = [
  {
    id: "c1", tipo: "artesaos", titulo: "Zezinha do Barro", subtitulo: "Caruaru/PE · Cerâmica", enviadoEm: "2026-09-23T14:32:00Z",
    imagemUrl: imagem("zezinha", 600, 800), fotos: [imagem("conj-brasileiro"), FOTO_JARRO, imagem("painel-azulejado"), imagem("zezinha-4")],
    descricao: "Peças utilitárias e decorativas em barro vermelho, modeladas à mão e pintadas com pigmentos naturais. Produção familiar, com a filha e o genro.",
    trajetoria: "Aprendeu com a mãe no Alto do Moura. Participa da Fenearte desde 2012 e vende hoje em feiras de Caruaru e Recife.",
    documentos: [{ nome: "RG_frente_verso.pdf", tamanho: "1,2 MB" }, { nome: "Comprovante_residencia.pdf", tamanho: "640 KB" }, { nome: "Carteira_artesao.jpg", tamanho: "2,4 MB" }],
    historico: [{ titulo: "Cadastro concluído", data: "2026-09-23T14:32:00Z" }, { titulo: "Documentos verificados automaticamente", data: "2026-09-23T14:35:00Z" }],
  },
  {
    id: "c2", tipo: "artesaos", titulo: "Antônio Lopes", subtitulo: "Bezerros/PE · Entalhe", enviadoEm: "2026-09-21T10:00:00Z",
    imagemUrl: imagem("antonio", 600, 800), fotos: [imagem("mascara-1"), imagem("mascara-2"), imagem("mascara-3")],
    descricao: "Máscaras de papangu entalhadas em madeira e pintadas à mão.",
    trajetoria: "Faz máscaras do carnaval de Bezerros desde menino.",
    documentos: [{ nome: "RG.pdf", tamanho: "900 KB" }],
    historico: [{ titulo: "Cadastro concluído", data: "2026-09-21T10:00:00Z" }],
  },
  {
    id: "c3", tipo: "artesaos", titulo: "Maria de Fátima", subtitulo: "Passira/PE · Bordado", enviadoEm: "2026-09-20T09:00:00Z",
    imagemUrl: imagem("fatima", 600, 800), fotos: [imagem("bordado-1"), imagem("bordado-2")],
    descricao: "Toalhas e roupas bordadas em ponto cheio com motivos florais.",
    trajetoria: "Borda desde os doze anos e participa da associação de bordadeiras de Passira.",
    documentos: [{ nome: "RG.pdf", tamanho: "1,1 MB" }, { nome: "Declaracao_associacao.pdf", tamanho: "300 KB" }],
    historico: [{ titulo: "Cadastro concluído", data: "2026-09-20T09:00:00Z" }],
  },
  {
    id: "c4", tipo: "pecas", titulo: "Céu de Agreste", subtitulo: "Carla Maria · Pintura", enviadoEm: "2026-09-22T12:00:00Z",
    imagemUrl: imagem("ceu-agreste"), fotos: [imagem("ceu-agreste"), imagem("p8-2"), imagem("p8-3")],
    descricao: "Pintura em acrílica do céu do agreste ao entardecer. 60 × 40 × 3cm, R$ 275,00.",
    documentos: [],
    historico: [{ titulo: "Peça enviada para análise", data: "2026-09-22T12:00:00Z" }],
  },
]
