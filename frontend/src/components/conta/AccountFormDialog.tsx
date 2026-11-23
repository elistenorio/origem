"use client"

import { Button, Stack, Text } from "@chakra-ui/react"
import { OrigemDialog } from "@/components/common/OrigemDialog"

type AccountFormDialogProps = {
  open: boolean
  onClose: () => void
  titulo: string
  descricao?: string
  textoConfirmar: string
  perigo?: boolean
  enviando: boolean
  erro?: string
  onConfirmar: () => void
  children: React.ReactNode
}

export function AccountFormDialog({ open, onClose, titulo, descricao, textoConfirmar, perigo, enviando, erro, onConfirmar, children }: AccountFormDialogProps) {
  return (
    <OrigemDialog
      open={open}
      onClose={onClose}
      titulo={titulo}
      descricao={descricao}
      rodape={
        <>
          <Button variant="claro" onClick={onClose}>Voltar</Button>
          <Button variant={perigo ? "perigo" : "origem"} onClick={onConfirmar} loading={enviando}>{textoConfirmar}</Button>
        </>
      }
    >
      <Stack gap="4">
        {children}
        {erro && <Text color="origem.perigo" fontSize="sm" role="alert">{erro}</Text>}
      </Stack>
    </OrigemDialog>
  )
}
