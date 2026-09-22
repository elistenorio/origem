"use client"

import NextLink from "next/link"
import { Dialog, Heading, Portal, Stack, Text } from "@chakra-ui/react"
import { Button } from "@chakra-ui/react"

export function SuccessDialog({ open }: { open: boolean }) {
  return (
    <Dialog.Root
      open={open}
      placement="center"
      closeOnInteractOutside={false}
      closeOnEscape={false}
    >
      <Portal>
        <Dialog.Backdrop bg="origem.busca/60" backdropFilter="blur(8px)" />
        <Dialog.Positioner>
          <Dialog.Content bg="origem.fundo" borderRadius="3xl" p="10" textAlign="center">
            <Dialog.Body>
              <Stack align="center" gap="5">
                <Dialog.Title asChild>
                  {/* fontWeight: o estilo do Dialog.Title (semibold) vence a variante */}
                  <Heading as="h2" variant="destaque" size="3xl" fontWeight="normal">
                    Seu cadastro foi enviado!
                  </Heading>
                </Dialog.Title>

                <Dialog.Description asChild>
                  <Text color="origem.textoSuave">
                    <Text as="span" fontWeight="bold">
                      Obrigado por querer fazer parte do Origem.
                    </Text>{" "}
                    Vamos analisar suas informações e entrar em contato pelo e-mail cadastrado.
                  </Text>
                </Dialog.Description>

                <Text fontWeight="bold" textTransform="uppercase">
                  Status: em análise
                </Text>

                <Button asChild>
                  <NextLink href="/">Voltar ao Menu</NextLink>
                </Button>
              </Stack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}