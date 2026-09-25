import type { Pedido } from "@/types/pedido"
import { FOTO_JARRO, imagem } from "./imagens"

const ENDERECO = { cep: "50030-170", rua: "Rua do Bom Jesus", numero: "123", complemento: "Apto. 402", bairro: "Recife Antigo", cidade: "Recife", estado: "PE" }
const COMPRADOR = { nome: "Ana Beatriz Souza", cpf: "123.456.789-00", email: "ana.beatriz@email.com", telefone: "(81) 99876-5432" }

// Pedidos da compradora de demonstração (Ana Beatriz) + pedidos de outros clientes (painel admin).
export const pedidosExemplo: Pedido[] = [
  {
    id: "10495", codigo: "#10495", status: "emSeparacao", criadoEm: "2026-09-20T11:43:00Z",
    itens: [
      { produtoId: "p1", titulo: "Jarro Tradicional", imagemUrl: FOTO_JARRO, artesaoNome: "Mestre Joãozinho", precoUnitario: 167.9, quantidade: 2 },
      { produtoId: "p10", titulo: "Quartinha", imagemUrl: imagem("quartinha"), artesaoNome: "Mestre Joãozinho", precoUnitario: 98, quantidade: 1 },
    ],
    subtotal: 433.8, frete: { modalidade: "pac", valor: 18.9, prazo: "6 a 8 dias úteis" }, total: 452.7,
    comprador: COMPRADOR, endereco: ENDERECO, pagamento: "cartao", parcelas: 2,
    codigoRastreio: "BR123456789BR", previsaoEntrega: "2026-10-02T00:00:00Z",
    eventos: [{ titulo: "Pagamento confirmado", data: "2026-09-20T11:43:00Z" }, { titulo: "Pedido separado", data: "2026-09-20T18:56:00Z" }],
    avaliado: false,
  },
  {
    id: "10402", codigo: "#10402", status: "entregue", criadoEm: "2026-09-02T09:10:00Z",
    itens: [{ produtoId: "p4", titulo: "Renda Renascença", imagemUrl: imagem("renda-renascenca"), artesaoNome: "Nara Azevedo", precoUnitario: 557, quantidade: 1 }],
    subtotal: 557, frete: { modalidade: "sedex", valor: 27.5, prazo: "2 a 4 dias úteis" }, total: 584.5,
    comprador: COMPRADOR, endereco: ENDERECO, pagamento: "pix", parcelas: 1,
    codigoRastreio: "BR987654321BR", previsaoEntrega: "2026-09-06T00:00:00Z",
    eventos: [{ titulo: "Pagamento confirmado", data: "2026-09-02T09:12:00Z" }, { titulo: "Pedido enviado", data: "2026-09-03T14:00:00Z" }, { titulo: "Pedido entregue", data: "2026-09-05T16:20:00Z" }],
    avaliado: false,
  },
  {
    id: "10494", codigo: "#10494", status: "enviado", criadoEm: "2026-09-19T15:00:00Z",
    itens: [{ produtoId: "p7", titulo: "Toalha de Renda", imagemUrl: imagem("toalha-renda"), artesaoNome: "Nara Azevedo", precoUnitario: 389.9, quantidade: 1 }],
    subtotal: 389.9, frete: { modalidade: "pac", valor: 18.9, prazo: "6 a 8 dias úteis" }, total: 408.8,
    comprador: { ...COMPRADOR, nome: "Pedro Henrique", email: "pedro.h@email.com" }, endereco: { ...ENDERECO, cidade: "Olinda" }, pagamento: "cartao", parcelas: 1,
    eventos: [{ titulo: "Pagamento confirmado", data: "2026-09-19T15:05:00Z" }], avaliado: false,
  },
  {
    id: "10490", codigo: "#10490", status: "cancelado", criadoEm: "2026-09-18T10:00:00Z",
    itens: [{ produtoId: "p12", titulo: "Xilogravura do Cangaço", imagemUrl: imagem("xilogravura"), artesaoNome: "Severino Lima", precoUnitario: 145, quantidade: 1 }],
    subtotal: 145, frete: { modalidade: "pac", valor: 18.9, prazo: "6 a 8 dias úteis" }, total: 163.9,
    comprador: { ...COMPRADOR, nome: "Júlia Rocha", email: "julia.rocha@email.com" }, endereco: { ...ENDERECO, cidade: "Natal", estado: "RN" }, pagamento: "boleto", parcelas: 1,
    eventos: [], avaliado: false, motivoCancelamento: "Comprei por engano",
  },
]

// Pedidos que aparecem em "Meus pedidos" (compradora de demonstração, sem login na Avaliação 1).
export const EMAIL_COMPRADOR_DEMO = COMPRADOR.email
