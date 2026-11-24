// Teste do cenário de qualidade do ADR-001 (docs/adr): consistência do estoque em pedidos concorrentes.
// Cenário: 20 compras simultâneas da última unidade de uma peça. Só uma pode passar.
// Medida: 1 resposta 201, 19 respostas 409 OUT_OF_STOCK, nenhuma 500 e estoque final 0 (nunca negativo).
//
// Diferente dos testes do Jest (TC01 e TC02, com o repository falso), este teste usa o banco de verdade,
// porque a garantia está no UPDATE condicional dentro da transação, e só o PostgreSQL decide quem leva a peça.
//
// Roda contra a API já ligada (npm run dev) e com o seed aplicado (npm run prisma:seed).
// Para testar outro endereço (ex.: o backend no Render): API_URL=https://<backend>/api npm run test:estoque
// O teste deixa o banco como encontrou: cancela o pedido criado e devolve o estoque original da peça.
import { test } from "node:test"
import assert from "node:assert/strict"

const API_URL = process.env.API_URL ?? "http://localhost:3001/api"
const SENHA_SEED = "Origem@123" // senha de todas as contas do prisma/seed.ts
const PECA = "p10" // "Quartinha", do Mestre Joãozinho (joaozinho@email.com), publicada no seed
const COMPRAS_SIMULTANEAS = 20

// Faz login e devolve o cookie do token, para mandar nas próximas requisições.
async function login(email: string): Promise<string> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha: SENHA_SEED }),
  })
  assert.equal(res.status, 200, `login de ${email} falhou (o seed foi aplicado?)`)
  const cookie = res.headers.get("set-cookie")
  assert.ok(cookie, "o login não devolveu o cookie do token")
  return cookie.split(";")[0]
}

// Estoque lido pela área do artesão, que consulta o banco (a vitrine pode responder do cache).
async function estoqueDaPeca(cookieArtesao: string): Promise<number> {
  const res = await fetch(`${API_URL}/minha-conta/produtos`, { headers: { Cookie: cookieArtesao } })
  assert.equal(res.status, 200)
  const pecas = (await res.json()) as { id: string; estoque: number }[]
  const peca = pecas.find((p) => p.id === PECA)
  assert.ok(peca, `a peça ${PECA} não está no catálogo do artesão (o seed foi aplicado?)`)
  return peca.estoque
}

async function definirEstoque(cookieArtesao: string, estoque: number) {
  const res = await fetch(`${API_URL}/minha-conta/produtos/${PECA}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: cookieArtesao },
    body: JSON.stringify({ estoque }),
  })
  assert.equal(res.status, 200, `não foi possível definir o estoque da peça ${PECA}`)
}

// Compra como visitante: cada chamada é uma compradora diferente.
function comprar(n: number) {
  return fetch(`${API_URL}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      itens: [{ produtoId: PECA, quantidade: 1 }],
      comprador: { nome: `Compradora ${n}`, cpf: "123.456.789-00", email: `compradora${n}@email.com`, telefone: "(81) 99999-0000" },
      endereco: { cep: "50030-170", rua: "Rua do Bom Jesus", numero: "123", complemento: "", bairro: "Recife Antigo", cidade: "Recife", estado: "PE" },
      frete: { modalidade: "pac" },
      pagamento: "pix",
    }),
  })
}

test(`${COMPRAS_SIMULTANEAS} compras simultâneas da última unidade: só uma passa e o estoque termina em 0`, async () => {
  const cookieArtesao = await login("joaozinho@email.com")
  const cookieAdmin = await login("admin@origem.com")
  const estoqueOriginal = await estoqueDaPeca(cookieArtesao)
  const pedidosCriados: string[] = []

  try {
    await definirEstoque(cookieArtesao, 1)

    // Todas as compras saem ao mesmo tempo.
    const respostas = await Promise.all(Array.from({ length: COMPRAS_SIMULTANEAS }, (_, i) => comprar(i + 1)))
    const corpos = await Promise.all(respostas.map((r) => r.json()))

    const criados = respostas.filter((r) => r.status === 201).length
    const semEstoque = corpos.filter((c, i) => respostas[i].status === 409 && c.error?.code === "OUT_OF_STOCK").length
    const outros = respostas.map((r) => r.status).filter((s) => s !== 201 && s !== 409)
    corpos.forEach((c, i) => {
      if (respostas[i].status === 201) pedidosCriados.push(c.id)
    })

    assert.deepEqual(outros, [], "nenhuma compra pode terminar em 500 (por exemplo, deadlock) ou outro status")
    assert.equal(criados, 1, "exatamente um pedido deve ser criado")
    assert.equal(semEstoque, COMPRAS_SIMULTANEAS - 1, "as outras compras devem receber 409 OUT_OF_STOCK")
    assert.equal(await estoqueDaPeca(cookieArtesao), 0, "o estoque deve terminar em 0, nunca negativo")
  } finally {
    // Deixa o banco como estava: cancela o que foi criado (o admin pode cancelar pedido de visitante)
    // e devolve o estoque original. O cancelamento devolve a unidade; o PATCH fixa o valor de antes.
    for (const id of pedidosCriados) {
      await fetch(`${API_URL}/pedidos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Cookie: cookieAdmin },
        body: JSON.stringify({ status: "cancelado", motivo: "Teste de concorrência do ADR-001" }),
      })
    }
    await definirEstoque(cookieArtesao, estoqueOriginal)
  }
})
