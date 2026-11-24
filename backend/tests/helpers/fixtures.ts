import type { PerfilUsuario } from "@prisma/client"
import type { UsuarioPublico } from "../../src/infrastructure/repositories/usuarios.repository"
import type { Pedido } from "../../src/shared/types/pedido"
import type { Produto } from "../../src/shared/types/produto"

export const compradorLogado = { id: "u1", perfil: "comprador" as PerfilUsuario }
export const outroComprador = { id: "u2", perfil: "comprador" as PerfilUsuario }
export const artesaoLogado = { id: "u10", perfil: "artesao" as PerfilUsuario }
export const adminLogado = { id: "admin", perfil: "admin" as PerfilUsuario }

export function usuarioFake(dados: Partial<UsuarioPublico> = {}): UsuarioPublico {
  return {
    id: "u1",
    nome: "Ana Beatriz Souza",
    email: "ana.beatriz@email.com",
    perfil: "comprador",
    status: "ativo",
    cidade: "Recife/PE",
    criadoEm: new Date("2026-06-12T10:00:00Z"),
    ...dados,
  }
}

export function produtoFake(dados: Partial<Produto> = {}): Produto {
  return {
    id: "p3",
    titulo: "Conj. Brasileiro",
    artesaoId: "a3",
    artesaoNome: "Zezinha do Barro",
    cidade: "Caruaru",
    tags: ["Conjunto"],
    medidas: "10 × 10 × 1,5cm",
    preco: 167.9,
    imagemUrl: "https://picsum.photos/seed/origem-conj-brasileiro/600/600",
    imagens: [],
    categoria: "ceramica-barro",
    tecnica: "pintura-mao",
    material: "barro",
    regiao: "agreste",
    estoque: 6,
    pecaUnica: false,
    status: "publicado",
    descricao: "Conjunto de azulejos pintados à mão.",
    cuidados: "Limpar com pano macio.",
    criadoEm: new Date("2026-09-01T10:00:00Z"),
    ...dados,
  }
}

export function pedidoFake(dados: Partial<Pedido> = {}): Pedido {
  return {
    id: "10500",
    codigo: "#10500",
    status: "processando",
    criadoEm: new Date("2026-11-20T10:00:00Z"),
    itens: [
      {
        produtoId: "p3",
        titulo: "Conj. Brasileiro",
        imagemUrl: "https://picsum.photos/seed/origem-conj-brasileiro/600/600",
        artesaoNome: "Zezinha do Barro",
        precoUnitario: 167.9,
        quantidade: 1,
      },
    ],
    subtotal: 167.9,
    frete: { modalidade: "pac", valor: 18.9, prazo: "6 a 8 dias úteis" },
    total: 186.8,
    comprador: { nome: "Ana Beatriz Souza", cpf: "123.***.***-00", email: "ana.beatriz@email.com", telefone: "(81) 99876-5432" },
    endereco: { cep: "50000-000", rua: "Rua da Aurora", numero: "100", complemento: "", bairro: "Boa Vista", cidade: "Recife", estado: "PE" },
    pagamento: "pix",
    parcelas: 1,
    eventos: [],
    avaliado: false,
    ...dados,
  }
}

export function pedidoEncontrado(dados: Partial<Pedido> = {}, usuarioId: string | null = compradorLogado.id) {
  return { pedido: pedidoFake(dados), usuarioId }
}
