import type { ProdutoDetalhe } from "./tipos"
import { FOTO_JARRO, imagem } from "./imagens"

type Base = Omit<ProdutoDetalhe, "imagens" | "cuidados" | "criadoEm"> & { criadoEm?: string }

const CUIDADOS_PADRAO =
  "Por se tratar de uma peça artesanal, pequenas diferenças de tamanho, textura e tonalidade são naturais. Manter em local seco, limpar com pano macio e evitar produtos abrasivos."

const peca = (p: Base, capa: string): ProdutoDetalhe => ({
  cuidados: CUIDADOS_PADRAO,
  criadoEm: "2026-09-01T10:00:00Z",
  ...p,
  imagemUrl: capa,
  imagens: [capa, imagem(`${p.id}-2`), imagem(`${p.id}-3`), imagem(`${p.id}-4`)],
})

export const produtosExemplo: ProdutoDetalhe[] = [
  peca({ id: "p1", titulo: "Jarro Tradicional", artesaoId: "a1", artesaoNome: "Mestre Joãozinho", cidade: "Tracunhaém", tags: ["Peça única", "Barro"], medidas: "15 × 27 × 15cm", preco: 167.9, imagemUrl: "", categoria: "ceramica-barro", tecnica: "modelagem-manual", material: "barro", regiao: "zona-da-mata", estoque: 1, pecaUnica: true, status: "publicado", criadoEm: "2026-09-20T10:00:00Z",
    descricao: "Produzido manualmente em barro, o Jarro Tradicional carrega a simplicidade e a força da cerâmica popular de Tracunhaém. Sua forma arredondada e o acabamento natural revelam as marcas do processo artesanal, tornando cada peça única." }, FOTO_JARRO),
  peca({ id: "p2", titulo: "Natureza Onírica", artesaoId: "a2", artesaoNome: "Carla Maria", cidade: "Recife", tags: ["Peça única", "Pintura"], medidas: "50 × 72 × 4cm", preco: 242.12, imagemUrl: "", categoria: "pintura", tecnica: "pintura-mao", material: "tela", regiao: "metropolitana", estoque: 1, pecaUnica: true, status: "publicado",
    descricao: "Pintura em acrílica sobre tela com paisagem onírica inspirada nas cores do litoral pernambucano." }, imagem("natureza-onirica")),
  peca({ id: "p3", titulo: "Conj. Brasileiro", artesaoId: "a3", artesaoNome: "Zezinha do Barro", cidade: "Caruaru", tags: ["Conjunto", "Cerâmica"], medidas: "10 × 10 × 1,5cm", preco: 167.9, imagemUrl: "", categoria: "ceramica-barro", tecnica: "pintura-mao", material: "barro", regiao: "agreste", estoque: 6, pecaUnica: false, status: "publicado",
    descricao: "Conjunto de azulejos pintados à mão com padrões geométricos inspirados na azulejaria colonial." }, imagem("conj-brasileiro")),
  peca({ id: "p4", titulo: "Renda Renascença", artesaoId: "a4", artesaoNome: "Nara Azevedo", cidade: "Passira", tags: ["Peça única", "Tecido"], medidas: "156 × 156cm", preco: 557, imagemUrl: "", categoria: "tecidos-bordados", tecnica: "renda", material: "algodao", regiao: "agreste", estoque: 1, pecaUnica: true, status: "publicado",
    descricao: "Toalha em renda renascença feita à mão por bordadeiras de Passira, com motivos florais tradicionais." }, imagem("renda-renascenca")),
  peca({ id: "p5", titulo: "Moringa Pintada", artesaoId: "a1", artesaoNome: "Mestre Joãozinho", cidade: "Tracunhaém", tags: ["Barro", "Pintura"], medidas: "18 × 32 × 18cm", preco: 189, imagemUrl: "", categoria: "ceramica-barro", tecnica: "pintura-mao", material: "barro", regiao: "zona-da-mata", estoque: 0, pecaUnica: false, status: "indisponivel",
    descricao: "Moringa de barro com pintura à mão em pigmentos naturais. Mantém a água fresca." }, imagem("moringa")),
  peca({ id: "p6", titulo: "Painel Azulejado", artesaoId: "a3", artesaoNome: "Zezinha do Barro", cidade: "Caruaru", tags: ["Peça única", "Cerâmica"], medidas: "40 × 40 × 2cm", preco: 320, imagemUrl: "", categoria: "decoracao", tecnica: "pintura-mao", material: "barro", regiao: "agreste", estoque: 1, pecaUnica: true, status: "publicado",
    descricao: "Painel de azulejos pintados à mão, pronto para pendurar." }, imagem("painel-azulejado")),
  peca({ id: "p7", titulo: "Toalha de Renda", artesaoId: "a4", artesaoNome: "Nara Azevedo", cidade: "Passira", tags: ["Tecido", "Bordado"], medidas: "120 × 80cm", preco: 389.9, imagemUrl: "", categoria: "tecidos-bordados", tecnica: "bordado", material: "algodao", regiao: "agreste", estoque: 3, pecaUnica: false, status: "publicado",
    descricao: "Toalha de mesa bordada em ponto cheio com barrado de renda." }, imagem("toalha-renda")),
  peca({ id: "p8", titulo: "Céu de Agreste", artesaoId: "a2", artesaoNome: "Carla Maria", cidade: "Recife", tags: ["Peça única", "Pintura"], medidas: "60 × 40 × 3cm", preco: 275, imagemUrl: "", categoria: "pintura", tecnica: "pintura-mao", material: "tela", regiao: "metropolitana", estoque: 1, pecaUnica: true, status: "emAnalise",
    descricao: "Pintura em acrílica do céu do agreste ao entardecer." }, imagem("ceu-agreste")),
  peca({ id: "p9", titulo: "Vaso de Barro Biscoito", artesaoId: "a1", artesaoNome: "Mestre Joãozinho", cidade: "Tracunhaém", tags: ["Barro"], medidas: "20 × 30 × 20cm", preco: 120.46, imagemUrl: "", categoria: "ceramica-barro", tecnica: "torneamento", material: "barro", regiao: "zona-da-mata", estoque: 4, pecaUnica: false, status: "publicado",
    descricao: "Vaso em barro biscoito (queimado sem esmalte), torneado e acabado à mão." }, imagem("vaso-biscoito")),
  peca({ id: "p10", titulo: "Quartinha", artesaoId: "a1", artesaoNome: "Mestre Joãozinho", cidade: "Tracunhaém", tags: ["Barro"], medidas: "14 × 24 × 14cm", preco: 98, imagemUrl: "", categoria: "ceramica-barro", tecnica: "modelagem-manual", material: "barro", regiao: "zona-da-mata", estoque: 8, pecaUnica: false, status: "publicado",
    descricao: "Quartinha tradicional de barro para água, modelada à mão." }, imagem("quartinha")),
  peca({ id: "p11", titulo: "Cesto de Ouricuri", artesaoId: "a6", artesaoNome: "Rita Bezerra", cidade: "Goiana", tags: ["Palha"], medidas: "30 × 30 × 20cm", preco: 89, imagemUrl: "", categoria: "palha-fibras", tecnica: "cestaria", material: "palha", regiao: "zona-da-mata", estoque: 5, pecaUnica: false, status: "publicado",
    descricao: "Cesto trançado à mão com palha de ouricuri colhida em Goiana." }, imagem("cesto-ouricuri")),
  peca({ id: "p12", titulo: "Xilogravura do Cangaço", artesaoId: "a5", artesaoNome: "Severino Lima", cidade: "Bezerros", tags: ["Gravura", "Cordel"], medidas: "30 × 42cm", preco: 145, imagemUrl: "", categoria: "gravura", tecnica: "xilogravura", material: "madeira", regiao: "agreste", estoque: 10, pecaUnica: false, status: "publicado",
    descricao: "Impressão de xilogravura em papel artesanal com cena do cangaço." }, imagem("xilogravura")),
  peca({ id: "p13", titulo: "Santo de Barro", artesaoId: "a1", artesaoNome: "Mestre Joãozinho", cidade: "Tracunhaém", tags: ["Peça única", "Barro"], medidas: "12 × 35 × 12cm", preco: 210, imagemUrl: "", categoria: "ceramica-barro", tecnica: "modelagem-manual", material: "barro", regiao: "zona-da-mata", estoque: 1, pecaUnica: true, status: "rascunho",
    descricao: "Imagem sacra modelada em barro, com acabamento natural." }, imagem("santo-barro")),
  peca({ id: "p14", titulo: "Luminária de Palha", artesaoId: "a6", artesaoNome: "Rita Bezerra", cidade: "Goiana", tags: ["Palha", "Decoração"], medidas: "35 × 45 × 35cm", preco: 159, imagemUrl: "", categoria: "palha-fibras", tecnica: "cestaria", material: "palha", regiao: "zona-da-mata", estoque: 2, pecaUnica: false, status: "publicado",
    descricao: "Luminária pendente trançada em palha de ouricuri." }, imagem("luminaria-palha")),
]
