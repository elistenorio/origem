"use client"

import { useState } from "react"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import { Button, Flex, Link, Stack, Text } from "@chakra-ui/react"
import { FormField } from "@/components/common/FormField"
import { INICIO_POR_PERFIL } from "@/constants/perfis"
import { useSessao } from "@/hooks/useSessao"
import { ApiError } from "@/services/api"

// Para onde voltar depois do login: o ?redirect= que o RequireAuth colocou na URL.
// Só aceita caminhos do próprio site ("/pedidos"), nunca outro endereço ("//site.com", "https://...").
function destinoDoRedirect(): string | null {
  const redirect = new URLSearchParams(window.location.search).get("redirect")
  return redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : null
}

export function LoginForm() {
  const router = useRouter()
  const { entrar } = useSessao()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault() // impede o navegador de recarregar a página
    if (!email.trim() || !senha) {
      setErro("Informe e-mail e senha.")
      return
    }

    setErro("")
    setEnviando(true)
    try {
      const usuario = await entrar(email, senha)
      router.replace(destinoDoRedirect() ?? INICIO_POR_PERFIL[usuario.perfil])
    } catch (e) {
      // Mensagem da API (ex.: "E-mail ou senha incorretos.", "Esta conta está suspensa...").
      setErro(e instanceof ApiError ? e.message : "Não foi possível entrar. Tente de novo.")
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stack gap="5">
        <FormField
          label="Email"
          type="email"
          placeholder="email@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <FormField
          label="Senha"
          type="password"
          placeholder="********"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          autoComplete="current-password"
        />

        {erro && (
          <Text role="alert" fontSize="sm" color="origem.perigo" textAlign="center">
            {erro}
          </Text>
        )}

        <Flex justify="space-between" fontSize="xs" color="origem.laranja">
          <Text>
            Não possui uma conta? <br />
            <Link asChild fontWeight="medium">
              <NextLink href="/cadastro">Crie a sua conta agora mesmo</NextLink>
            </Link>
          </Text>
          <Text textAlign="right">
            Esqueceu a sua senha? <br />
            <Link asChild fontWeight="medium">
              <NextLink href="/recuperar-senha">Recupere</NextLink>
            </Link>
          </Text>
        </Flex>

        <Button type="submit" alignSelf="center" mt="4" loading={enviando} loadingText="Entrando...">
          Entrar
        </Button>
      </Stack>
    </form>
  )
}
