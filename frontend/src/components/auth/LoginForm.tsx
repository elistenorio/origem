"use client"

import { useState } from "react"
import NextLink from "next/link"
import { Flex, Link, Stack, Text } from "@chakra-ui/react"
import { FormField } from "@/components/common/FormField"
import { Button } from "@chakra-ui/react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault() // impede o navegador de recarregar a página
    console.log({ email, password }) // depois: chamar a API de login
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="5">
        <FormField
          label="Email"
          type="email"
          placeholder="email@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormField
          label="Senha"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

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

        <Button type="submit" alignSelf="center" mt="4">
          Entrar
        </Button>
      </Stack>
    </form>
  )
}