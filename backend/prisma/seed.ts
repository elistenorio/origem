// Seed do banco: transforma o db.json da Fake API (Avaliação 1) em registros do Prisma.
// Rodar: npm run prisma:seed (também roda sozinho depois de "prisma migrate dev" num banco novo).
//
// Todas as contas criadas aqui usam a mesma senha de desenvolvimento (SENHA_PADRAO).
import fs from "node:fs"
import path from "node:path"
import bcrypt from "bcryptjs"
import { createClient } from "redis"
import {
  PrismaClient,
  type FormaPagamento,
  type Prisma,
  type StatusArtesao,
  type StatusPedido,
  type StatusProduto,
  type StatusUsuario,
} from "@prisma/client"

const prisma = new PrismaClient()

// Zera o cache de peças (GET /produtos), para a vitrine não mostrar dados de antes do seed.
// Usa o mesmo mecanismo da API (soma 1 na versão). Sem REDIS_URL ou com o Redis fora do ar, só avisa.
async function zerarCacheDePecas() {
  const url = process.env.REDIS_URL
  if (!url) return
  const cliente = createClient({ url, socket: { connectTimeout: 2000, reconnectStrategy: false } })
  cliente.on("error", () => {})
  try {
    await cliente.connect()
    await cliente.incr("produtos:versao")
    console.log("Cache de peças zerado.")
  } catch {
    console.log("Redis indisponível: cache não zerado (ele expira sozinho em 5 minutos).")
  } finally {
    if (cliente.isOpen) await cliente.quit()
  }
}

const SENHA_PADRAO = "Origem@123"

// ---------- Formato do db.json (só os campos usados aqui) ----------

type ProdutoJson = {
  id: string
  titulo: string
  artesaoId: string
  tags: string[]
  medidas: string
  preco: number
  imagemUrl: string
  imagens: string[]
  categoria: string
  tecnica: string
  material: string
  regiao: string
  estoque: number
  pecaUnica: boolean
  status: StatusProduto
  descricao: string
  cuidados: string
  criadoEm: string
}

type ArtesaoJson = {
  id: string
  nome: string
  oficio: string
  cidade: string
  estado: string
  regiao: string
  bio: string
  historia: string
  citacao: string
  trabalho?: string
  origemTrabalho?: string
  citacaoOrigem?: string
  gostaDeFazer?: string
  fotoUrl: string
  tecnicas: string[]
  categorias: string[]
  email: string
  status: StatusArtesao
  criadoEm: string
}

type UsuarioJson = {
  id: string
  nome: string
  email: string
  status: StatusUsuario
  cidade: string
  criadoEm: string
}

type ContaJson = {
  usuarioId: string
  cpf: string
  telefone: string
  endereco: Prisma.InputJsonValue
  formasPagamento: Prisma.InputJsonValue
}

type PedidoJson = {
  id: string
  status: StatusPedido
  criadoEm: string
  itens: {
    produtoId: string
    titulo: string
    imagemUrl: string
    artesaoNome: string
    precoUnitario: number
    quantidade: number
  }[]
  subtotal: number
  frete: Prisma.InputJsonValue
  total: number
  comprador: { email: string } & Record<string, string>
  endereco: Prisma.InputJsonValue
  pagamento: FormaPagamento
  parcelas: number
  codigoRastreio?: string
  previsaoEntrega?: string
  eventos: { titulo: string; data: string }[]
  avaliado: boolean
  motivoCancelamento?: string
}

type Db = {
  produtos: ProdutoJson[]
  artesaos: ArtesaoJson[]
  usuarios: UsuarioJson[]
  contas: ContaJson[]
  pedidos: PedidoJson[]
  atividades: { id: string; autor: string; descricao: string; data: string }[]
  notificacoesAdmin: { id: string; titulo: string; descricao: string }[]
}

// ---------- Filtros (copiados de frontend/src/constants) ----------

type Opcao = { id: string; label: string }

const CATEGORIAS: Opcao[] = [
  { id: "ceramica-barro", label: "Cerâmica e Barro" },
  { id: "tecidos-bordados", label: "Tecidos e Bordados" },
  { id: "moda-autoral", label: "Roupas e Moda Autoral" },
  { id: "madeira", label: "Madeira" },
  { id: "pintura", label: "Pintura" },
  { id: "gravura", label: "Gravura" },
  { id: "palha-fibras", label: "Palha e Fibras Naturais" },
  { id: "couro", label: "Couro" },
  { id: "bijuterias", label: "Bijuterias e Acessórios" },
  { id: "instrumentos", label: "Instrumentos Musicais" },
  { id: "metal", label: "Metal" },
  { id: "papel-cordel", label: "Papel e Cordel" },
  { id: "decoracao", label: "Decoração e Utilidades" },
]

const TECNICAS: Opcao[] = [
  { id: "modelagem-manual", label: "Modelagem manual" },
  { id: "torneamento", label: "Torneamento" },
  { id: "bordado", label: "Bordado" },
  { id: "renda", label: "Renda renascença" },
  { id: "tecelagem", label: "Tecelagem" },
  { id: "entalhe", label: "Entalhe" },
  { id: "cestaria", label: "Cestaria" },
  { id: "xilogravura", label: "Xilogravura" },
  { id: "pintura-mao", label: "Pintura à mão" },
]

const MATERIAIS: Opcao[] = [
  { id: "barro", label: "Barro" },
  { id: "algodao", label: "Algodão" },
  { id: "madeira", label: "Madeira" },
  { id: "palha", label: "Palha" },
  { id: "tela", label: "Tela e tinta" },
  { id: "couro", label: "Couro" },
]

const REGIOES: Opcao[] = [
  { id: "metropolitana", label: "Região Metropolitana" },
  { id: "zona-da-mata", label: "Zona da Mata" },
  { id: "agreste", label: "Agreste" },
  { id: "sertao", label: "Sertão" },
]

// ---------- Seed ----------

function lerDb(): Db {
  const arquivo = path.join(__dirname, "data", "db.json")
  return JSON.parse(fs.readFileSync(arquivo, "utf-8")) as Db
}

async function limparBanco() {
  // Ordem inversa das dependências (filhos antes dos pais).
  await prisma.avaliacao.deleteMany()
  await prisma.eventoPedido.deleteMany()
  await prisma.itemPedido.deleteMany()
  await prisma.pedido.deleteMany()
  await prisma.produto.deleteMany()
  await prisma.artesao.deleteMany()
  await prisma.usuario.deleteMany()
  await prisma.categoria.deleteMany()
  await prisma.tecnica.deleteMany()
  await prisma.material.deleteMany()
  await prisma.regiao.deleteMany()
  await prisma.notificacao.deleteMany()
  await prisma.atividade.deleteMany()
  await prisma.analiseCuradoria.deleteMany()
}

async function main() {
  const db = lerDb()
  const senhaHash = await bcrypt.hash(SENHA_PADRAO, 10)

  console.log("Limpando dados existentes...")
  await limparBanco()

  console.log("Criando filtros...")
  // "ordem" guarda a posição de cada opção, para GET /filtros devolver na mesma ordem das constantes.
  const comOrdem = (lista: Opcao[]) => lista.map((opcao, i) => ({ ...opcao, ordem: i + 1 }))
  await prisma.categoria.createMany({ data: comOrdem(CATEGORIAS) })
  await prisma.tecnica.createMany({ data: comOrdem(TECNICAS) })
  await prisma.material.createMany({ data: comOrdem(MATERIAIS) })
  await prisma.regiao.createMany({ data: comOrdem(REGIOES) })

  console.log("Criando compradores...")
  for (const u of db.usuarios) {
    const conta = db.contas.find((c) => c.usuarioId === u.id)
    await prisma.usuario.create({
      data: {
        id: u.id,
        nome: u.nome,
        email: u.email,
        senhaHash,
        perfil: "comprador",
        status: u.status,
        cidade: u.cidade,
        criadoEm: new Date(u.criadoEm),
        cpf: conta?.cpf,
        telefone: conta?.telefone,
        endereco: conta?.endereco,
        formasPagamento: conta?.formasPagamento,
      },
    })
  }

  console.log("Criando administrador...")
  await prisma.usuario.create({
    data: {
      id: "adm1",
      nome: "Maria Clara",
      email: "admin@origem.com",
      senhaHash,
      perfil: "admin",
      cidade: "Recife/PE",
      criadoEm: new Date("2026-01-05T10:00:00Z"),
    },
  })

  console.log("Criando artesãos (cada um com seu usuário de login)...")
  for (const [indice, a] of db.artesaos.entries()) {
    await prisma.artesao.create({
      data: {
        id: a.id,
        // Mantém a ordem do db.json na listagem (o primeiro tem a maior relevância).
        relevancia: db.artesaos.length - indice,
        nome: a.nome,
        oficio: a.oficio,
        cidade: a.cidade,
        estado: a.estado,
        bio: a.bio,
        historia: a.historia,
        citacao: a.citacao,
        trabalho: a.trabalho,
        origemTrabalho: a.origemTrabalho,
        citacaoOrigem: a.citacaoOrigem,
        gostaDeFazer: a.gostaDeFazer,
        fotoUrl: a.fotoUrl,
        tecnicas: a.tecnicas,
        categorias: a.categorias,
        status: a.status,
        criadoEm: new Date(a.criadoEm),
        regiao: { connect: { id: a.regiao } },
        usuario: {
          create: {
            id: `u-${a.id}`, // ex.: "u-a1"
            nome: a.nome,
            email: a.email,
            senhaHash,
            perfil: "artesao",
            cidade: `${a.cidade}/${a.estado}`,
            criadoEm: new Date(a.criadoEm),
          },
        },
      },
    })
  }

  console.log("Criando produtos...")
  for (const [indice, p] of db.produtos.entries()) {
    await prisma.produto.create({
      data: {
        id: p.id,
        // "relevancia" (ordem padrão da vitrine) repete a ordem do db.json, como fazia a Fake API.
        relevancia: db.produtos.length - indice,
        titulo: p.titulo,
        tags: p.tags,
        medidas: p.medidas,
        preco: p.preco,
        imagemUrl: p.imagemUrl,
        imagens: p.imagens,
        estoque: p.estoque,
        pecaUnica: p.pecaUnica,
        status: p.status,
        descricao: p.descricao,
        cuidados: p.cuidados,
        criadoEm: new Date(p.criadoEm),
        artesaoId: p.artesaoId,
        categoriaId: p.categoria,
        tecnicaId: p.tecnica,
        materialId: p.material,
        regiaoId: p.regiao,
      },
    })
  }

  console.log("Criando pedidos...")
  for (const p of db.pedidos) {
    // O dono do pedido é o usuário com o mesmo e-mail do comprador (se existir).
    const dono = db.usuarios.find((u) => u.email === p.comprador.email)
    await prisma.pedido.create({
      data: {
        id: p.id,
        status: p.status,
        criadoEm: new Date(p.criadoEm),
        subtotal: p.subtotal,
        frete: p.frete,
        total: p.total,
        comprador: p.comprador,
        endereco: p.endereco,
        pagamento: p.pagamento,
        parcelas: p.parcelas,
        codigoRastreio: p.codigoRastreio,
        previsaoEntrega: p.previsaoEntrega ? new Date(p.previsaoEntrega) : undefined,
        avaliado: p.avaliado,
        motivoCancelamento: p.motivoCancelamento,
        usuarioId: dono?.id,
        itens: { create: p.itens },
        eventos: { create: p.eventos.map((e) => ({ titulo: e.titulo, data: new Date(e.data) })) },
      },
    })
  }

  console.log("Criando notificações e atividades do painel do admin...")
  await prisma.atividade.createMany({
    data: db.atividades.map((a) => ({ id: a.id, autor: a.autor, descricao: a.descricao, data: new Date(a.data) })),
  })
  // As notificações do db.json não têm data: a primeira da lista fica como a mais recente.
  const agora = Date.now()
  await prisma.notificacao.createMany({
    data: db.notificacoesAdmin.map((n, i) => ({ ...n, criadoEm: new Date(agora - i * 60_000) })),
  })

  // Os pedidos do seed têm número fixo; o próximo pedido criado continua a partir do maior deles.
  await prisma.$executeRaw`
    SELECT setval('pedido_numero_seq', (SELECT MAX("id"::bigint) FROM "Pedido" WHERE "id" ~ '^[0-9]+$'))
  `

  await zerarCacheDePecas()

  console.log(`Seed concluído. Senha de todas as contas: ${SENHA_PADRAO}`)
}

main()
  .catch((err) => {
    console.error("Erro no seed:", err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
