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

test('aceita "a@b", como a regra antiga (includes("@"))', () => {
  assert.equal(emailValido("a@b"), true)
})
