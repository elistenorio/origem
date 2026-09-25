"use client"

import NextLink from "next/link"
import { Button, Text } from "@chakra-ui/react"
import { OrigemDialog } from "@/components/common/OrigemDialog"

export function SuccessDialog({ open }: { open: boolean }) {
  return (
    <OrigemDialog
      open={open}
      onClose={() => {}}
      fechavel={false}
      centralizado
      titulo="Seu cadastro foi enviado!"
      descricao={
        <>
          <Text as="span" fontWeight="bold">Obrigado por querer fazer parte do Origem.</Text>{" "}
          Vamos analisar suas informações e entrar em contato pelo e-mail cadastrado.
        </>
      }
    >
      <Text fontWeight="bold" textTransform="uppercase">Status: em análise</Text>
      <Button asChild w="full" mt="2">
        <NextLink href="/">Voltar ao Menu</NextLink>
      </Button>
    </OrigemDialog>
  )
}
