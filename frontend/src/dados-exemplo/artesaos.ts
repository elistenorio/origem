import type { Artesao } from "./tipos"
import { FOTO_MESTRE_JOAOZINHO, imagem } from "./imagens"

export const artesaosExemplo: Artesao[] = [
  {
    id: "a1", nome: "Mestre Joãozinho", oficio: "Ceramista", cidade: "Tracunhaém", estado: "PE", regiao: "zona-da-mata",
    bio: "Há mais de 40 anos transforma o barro de Tracunhaém em jarros, moringas e santos.",
    historia: "Foi em Tracunhaém que comecei a trabalhar com o barro. Aprendi muito observando os mais velhos quando produziam as quartinhas e, com o tempo, fui encontrando minha própria maneira de fazer as peças. Gosto do barro porque ele permite fazer muita coisa: cada peça tem um tempo e um jeito.",
    citacao: "O barro guarda a memória de quem coloca a mão nele.",
    fotoUrl: FOTO_MESTRE_JOAOZINHO, tecnicas: ["Cerâmica", "Modelagem manual"], categorias: ["ceramica-barro"],
    totalProdutos: 6, email: "joaozinho@email.com", status: "publicado", criadoEm: "2026-03-10T10:00:00Z",
  },
  {
    id: "a2", nome: "Carla Maria", oficio: "Pintora", cidade: "Recife", estado: "PE", regiao: "metropolitana",
    bio: "Pinta paisagens oníricas inspiradas nas cores do litoral e do agreste.",
    historia: "Comecei a pintar ainda criança, nas paredes de casa. Hoje trabalho com acrílica sobre tela e procuro traduzir em cor as memórias das viagens pelo interior de Pernambuco.",
    citacao: "Cada cor que eu uso vem de um lugar que eu conheci.",
    fotoUrl: imagem("carla", 600, 800), tecnicas: ["Pintura", "Acrílica"], categorias: ["pintura"],
    totalProdutos: 3, email: "carla.maria@email.com", status: "publicado", criadoEm: "2026-04-02T10:00:00Z",
  },
  {
    id: "a3", nome: "Zezinha do Barro", oficio: "Ceramista", cidade: "Caruaru", estado: "PE", regiao: "agreste",
    bio: "Aprendeu com a mãe no Alto do Moura e hoje cria peças e painéis azulejados.",
    historia: "Aprendi com a minha mãe no Alto do Moura. Participo da Fenearte desde 2012 e vendo em feiras de Caruaru e Recife. A produção é familiar, com a minha filha e o meu genro.",
    citacao: "O Alto do Moura mora nas minhas mãos.",
    fotoUrl: imagem("zezinha", 600, 800), tecnicas: ["Cerâmica", "Azulejaria"], categorias: ["ceramica-barro", "decoracao"],
    totalProdutos: 3, email: "zezinha@email.com", status: "publicado", criadoEm: "2026-02-20T10:00:00Z",
  },
  {
    id: "a4", nome: "Nara Azevedo", oficio: "Bordadeira", cidade: "Passira", estado: "PE", regiao: "agreste",
    bio: "Bordadeira de Passira, guarda o ponto renascença herdado da avó.",
    historia: "Na minha família todas as mulheres bordam. Aprendi a renda renascença com a minha avó e hoje ensino as meninas da associação de bordadeiras de Passira.",
    citacao: "Cada ponto é uma conversa com quem veio antes.",
    fotoUrl: imagem("nara", 600, 800), tecnicas: ["Bordado", "Renda renascença"], categorias: ["tecidos-bordados"],
    totalProdutos: 2, email: "nara.azevedo@email.com", status: "publicado", criadoEm: "2026-01-15T10:00:00Z",
  },
  {
    id: "a5", nome: "Severino Lima", oficio: "Xilogravurista", cidade: "Bezerros", estado: "PE", regiao: "agreste",
    bio: "Grava em madeira as histórias do sertão que ilustram cordéis.",
    historia: "Comecei ilustrando os cordéis do meu tio. Hoje minhas xilogravuras contam histórias do sertão, do cangaço e das festas juninas.",
    citacao: "A madeira fala quando a gente escuta.",
    fotoUrl: imagem("severino", 600, 800), tecnicas: ["Xilogravura", "Cordel"], categorias: ["gravura", "papel-cordel"],
    totalProdutos: 1, email: "severino.lima@email.com", status: "indisponivel", criadoEm: "2026-05-03T10:00:00Z",
  },
  {
    id: "a6", nome: "Rita Bezerra", oficio: "Cesteira", cidade: "Goiana", estado: "PE", regiao: "zona-da-mata",
    bio: "Tece cestos e luminárias com palha de ouricuri colhida na região.",
    historia: "A palha de ouricuri sempre fez parte da vida em Goiana. Transformo essa tradição em cestos, luminárias e peças de decoração.",
    citacao: "A palha ensina paciência.",
    fotoUrl: imagem("rita", 600, 800), tecnicas: ["Cestaria", "Palha"], categorias: ["palha-fibras"],
    totalProdutos: 1, email: "rita.b@email.com", status: "ajustesSolicitados", criadoEm: "2026-09-22T10:00:00Z",
  },
  {
    id: "a7", nome: "Antônio Lopes", oficio: "Mascareiro", cidade: "Bezerros", estado: "PE", regiao: "agreste",
    bio: "Máscaras e gravuras do carnaval de Bezerros, feitas à mão.",
    historia: "Faço as máscaras dos papangus de Bezerros desde menino. Cada máscara leva dias de trabalho entre modelagem e pintura.",
    citacao: "O papangu é a alegria que a gente veste.",
    fotoUrl: imagem("antonio", 600, 800), tecnicas: ["Entalhe", "Pintura à mão"], categorias: ["madeira"],
    totalProdutos: 0, email: "antonio.lopes@email.com", status: "emAnalise", criadoEm: "2026-09-21T10:00:00Z",
  },
  {
    id: "a8", nome: "Maria de Fátima", oficio: "Bordadeira", cidade: "Passira", estado: "PE", regiao: "agreste",
    bio: "Borda toalhas e roupas em ponto cheio com motivos florais.",
    historia: "Bordo desde os doze anos. Meus trabalhos têm flores do agreste e são feitos em linho e algodão.",
    citacao: "Bordar é desenhar com a linha.",
    fotoUrl: imagem("fatima", 600, 800), tecnicas: ["Bordado"], categorias: ["tecidos-bordados"],
    totalProdutos: 0, email: "fatima@email.com", status: "emAnalise", criadoEm: "2026-09-20T10:00:00Z",
  },
]
