import type { PerfilArtesao } from "@/types/artesao"
import type { DadosCheckout } from "@/types/checkout"
import type { Produto, ProdutoInput } from "@/types/produto"
import type { FormularioPerfil } from "@/utils/perfilArtesao"

// Peças do seed (backend/prisma/data/db.json) usadas nos casos do plano de testes.
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
    criadoEm: "2026-09-01T10:00:00Z",
    ...dados,
  }
}

export const conjBrasileiro = produtoFake()

export const toalhaDeRenda = produtoFake({
  id: "p7",
  titulo: "Toalha de Renda",
  artesaoId: "a4",
  artesaoNome: "Nara Azevedo",
  cidade: "Passira",
  preco: 389.9,
  categoria: "tecidos-bordados",
  tecnica: "bordado",
  material: "algodao",
  estoque: 3,
})

export const vasoDeBarroBiscoito = produtoFake({
  id: "p9",
  titulo: "Vaso de Barro Biscoito",
  artesaoId: "a1",
  artesaoNome: "Mestre Joãozinho",
  cidade: "Tracunhaém",
  medidas: "20 × 30 × 20cm",
  preco: 120.46,
  tecnica: "torneamento",
  regiao: "zona-da-mata",
  estoque: 4,
})

// Checkout da Ana Beatriz preenchido por completo, com Pix.
export function dadosCheckoutFake(dados: Partial<DadosCheckout> = {}): DadosCheckout {
  return {
    nome: "Ana Beatriz Souza",
    cpf: "123.456.789-00",
    email: "ana.beatriz@email.com",
    telefone: "(81) 99876-5432",
    cep: "50050-000",
    rua: "Rua da Aurora",
    numero: "100",
    complemento: "",
    bairro: "Boa Vista",
    cidade: "Recife",
    estado: "PE",
    pagamento: "pix",
    parcelas: "1",
    numeroCartao: "",
    nomeCartao: "",
    validade: "",
    cvv: "",
    ...dados,
  }
}

// Formulário "Adicionar peça" com todos os campos obrigatórios, enviado para análise.
export function produtoInputFake(dados: Partial<ProdutoInput> = {}): ProdutoInput {
  return {
    titulo: "Vaso de Barro Biscoito",
    categoria: "ceramica-barro",
    descricao: "Vaso em barro biscoito (queimado sem esmalte), torneado e acabado à mão.",
    material: "barro",
    tecnica: "torneamento",
    altura: "30",
    largura: "20",
    profundidade: "20",
    peso: "1,2",
    pecaUnica: true,
    estoque: 1,
    preco: 120.46,
    prazoPostagem: "3",
    embalagem: "caixa",
    cuidadosEnvio: "",
    enviarParaAnalise: true,
    ...dados,
  }
}

// Perfil salvo do Mestre Joãozinho, como GET /minha-conta/perfil devolve.
export function perfilArtesaoFake(dados: Partial<PerfilArtesao> = {}): PerfilArtesao {
  return {
    id: "a1",
    nome: "Mestre Joãozinho",
    oficio: "Ceramista",
    cidade: "Tracunhaém",
    estado: "PE",
    regiao: "zona-da-mata",
    bio: "Ceramista de Tracunhaém.",
    historia: "Aprendi a modelar o barro com meu pai, em Tracunhaém.",
    citacao: "",
    fotoUrl: "",
    tecnicas: ["Modelagem manual"],
    categorias: ["ceramica-barro"],
    totalProdutos: 2,
    email: "joaozinho@email.com",
    status: "publicado",
    criadoEm: "2026-06-01T10:00:00Z",
    telefone: "(81) 99999-0000",
    tempoAtuacao: "mais-10",
    ...dados,
  }
}

// Formulário "Meu perfil" do Mestre Joãozinho preenchido por completo.
export function formularioPerfilFake(dados: Partial<FormularioPerfil> = {}): FormularioPerfil {
  return {
    nome: "Mestre Joãozinho",
    cidade: "Tracunhaém",
    estado: "PE",
    telefone: "(81) 99999-0000",
    historia: "Aprendi a modelar o barro com meu pai, em Tracunhaém.",
    trabalho: "",
    origemTrabalho: "",
    gostaDeFazer: "",
    tempoAtuacao: "mais-10",
    categorias: ["ceramica-barro"],
    tecnicasMarcadas: ["Modelagem manual"],
    outrasTecnicas: "",
    ...dados,
  }
}
