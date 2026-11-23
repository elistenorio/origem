import { test } from "node:test"
import assert from "node:assert/strict"
import { getOptionLabel } from "./getOptionLabel.ts"

// Mesmo formato das listas de constants/ (ex.: CATEGORIAS, TECNICAS).
const opcoes = [
  { value: "modelagem-manual", label: "Modelagem manual" },
  { value: "ceramica-barro", label: "Cerâmica e Barro" },
]

test("devolve o texto da opção quando o valor existe na lista", () => {
  assert.equal(getOptionLabel(opcoes, "modelagem-manual"), "Modelagem manual")
  assert.equal(getOptionLabel(opcoes, "ceramica-barro"), "Cerâmica e Barro")
})

test("devolve o próprio valor quando ele não está na lista", () => {
  assert.equal(getOptionLabel(opcoes, "valor-desconhecido"), "valor-desconhecido")
})

test("devolve o próprio valor quando a lista está vazia", () => {
  assert.equal(getOptionLabel([], "ceramica-barro"), "ceramica-barro")
})
