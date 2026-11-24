"use client"

import { useState } from "react"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import { Button, Link, Stack, Text } from "@chakra-ui/react"
import { FormField } from "@/components/common/FormField"
import { PasswordHints } from "@/components/cadastro/PasswordHints"
import { INICIO_POR_PERFIL } from "@/constants/perfis"
import { useSessao } from "@/hooks/useSessao"
import { ApiError } from "@/services/api"
import { SENHA_TAMANHO_MINIMO, emailValido } from "@/utils/validation"
import type { CadastroCompradorInput } from "@/types/usuario"

const vazio: CadastroCompradorInput = { nome: "", email: "", senha: "" }

// Cadastro do comprador: cria a conta (POST /usuarios) e já entra nela (POST /auth/login).
export function BuyerRegisterForm() {
  const router = useRouter()
  const { cadastrar } = useSessao()
  const [dados, setDados] = useState(vazio)
  const [erros, setErros] = useState<Partial<Record<keyof CadastroCompradorInput, string>>>({})
  const [erroApi, setErroApi] = useState("")
  const [enviando, setEnviando] = useState(false)

  const alterar = (campo: keyof CadastroCompradorInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDados((d) => ({ ...d, [campo]: e.target.value }))

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Validação rápida na tela; o backend valida de novo.
    const novos: typeof erros = {}
    if (!dados.nome.trim()) novos.nome = "Informe seu nome completo."
    if (!emailValido(dados.email)) novos.email = "Informe um e-mail válido."
    if (dados.senha.length < SENHA_TAMANHO_MINIMO) novos.senha = `A senha precisa ter pelo menos ${SENHA_TAMANHO_MINIMO} caracteres.`
    setErros(novos)
    if (Object.keys(novos).length > 0) return

    setErroApi("")
    setEnviando(true)
    try {
      const usuario = await cadastrar(dados)
      router.replace(INICIO_POR_PERFIL[usuario.perfil])
    } catch (erro) {
      // Ex.: "Já existe uma conta com este e-mail." (409)
      setErroApi(erro instanceof ApiError ? erro.message : "Não foi possível criar a conta. Tente de novo.")
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stack gap="5">
        <FormField label="Nome completo" placeholder="Insira seu nome completo" value={dados.nome} onChange={alterar("nome")} error={erros.nome} autoComplete="name" />
        <FormField label="E-mail" type="email" placeholder="email@exemplo.com" value={dados.email} onChange={alterar("email")} error={erros.email} autoComplete="email" />
        <FormField label="Senha" type="password" placeholder="********" value={dados.senha} onChange={alterar("senha")} error={erros.senha} autoComplete="new-password" />
        <PasswordHints />
        {erroApi && (
          <Text role="alert" fontSize="sm" color="origem.perigo" textAlign="center">
            {erroApi}
          </Text>
        )}
        <Button type="submit" variant="origem" loading={enviando} loadingText="Criando conta...">
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
