import { test } from "node:test"
import assert from "node:assert/strict"
import { SENHA_TAMANHO_MINIMO, emailValido } from "./validation.ts"


test("a senha precisa ter pelo menos 8 caracteres", () => {
  assert.equal(SENHA_TAMANHO_MINIMO, 8)
})

test("aceita e-mail com @", () => {
  assert.equal(emailValido("nome@dominio.com"), true)
})

test("recusa e-mail sem @", () => {
  assert.equal(emailValido("nomedominio.com"), false)
  assert.equal(emailValido(""), false)
})

test('recusa "a@b", porque o domínio precisa ter ponto (como no backend)', () => {
  assert.equal(emailValido("a@b"), false)
  assert.equal(emailValido("a@b."), false)
})

test("recusa e-mail com espaço no meio", () => {
  assert.equal(emailValido("a b@c.com"), false)
})

test("ignora espaços nas pontas (como no backend)", () => {
  assert.equal(emailValido(" nome@dominio.com "), true)
})
