"use client"

import { useState } from "react"
import NextLink from "next/link"
import { Button, Link, Stack, Text } from "@chakra-ui/react"
import { FormField } from "@/components/common/FormField"
import { PasswordHints } from "@/components/cadastro/PasswordHints"
import type { CadastroCompradorInput } from "@/dados-exemplo/tipos"

const vazio: CadastroCompradorInput = { nome: "", email: "", senha: "" }

// Cadastro do comprador. Por enquanto só valida e mostra a confirmação (sem API).
export function BuyerRegisterForm() {
  const [dados, setDados] = useState(vazio)
  const [erros, setErros] = useState<Partial<Record<keyof CadastroCompradorInput, string>>>({})
  const [concluido, setConcluido] = useState(false)

  const alterar = (campo: keyof CadastroCompradorInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDados((d) => ({ ...d, [campo]: e.target.value }))

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const novos: typeof erros = {}
    if (!dados.nome.trim()) novos.nome = "Informe seu nome completo."
    if (!dados.email.includes("@")) novos.email = "Informe um e-mail válido."
    if (dados.senha.length < 8) novos.senha = "A senha precisa ter pelo menos 8 caracteres."
    setErros(novos)
    if (Object.keys(novos).length > 0) return
    setConcluido(true)
  }

  if (concluido) {
    return (
      <Stack gap="5" textAlign="center">
        <Text fontSize="lg">Conta criada! Agora é só entrar para acompanhar seus pedidos.</Text>
        <Button asChild variant="origem">
          <NextLink href="/login">Entrar</NextLink>
        </Button>
      </Stack>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stack gap="5">
        <FormField label="Nome completo" placeholder="Insira seu nome completo" value={dados.nome} onChange={alterar("nome")} error={erros.nome} autoComplete="name" />
        <FormField label="E-mail" type="email" placeholder="email@exemplo.com" value={dados.email} onChange={alterar("email")} error={erros.email} autoComplete="email" />
        <FormField label="Senha" type="password" placeholder="********" value={dados.senha} onChange={alterar("senha")} error={erros.senha} autoComplete="new-password" />
        <PasswordHints />
        <Button type="submit" variant="origem">
          Criar conta
        </Button>
        <Text textAlign="center" fontSize="sm">
          Já tem uma conta?{" "}
          <Link asChild variant="origem">
            <NextLink href="/login">Entrar</NextLink>
          </Link>
        </Text>
      </Stack>
    </form>
  )
}
