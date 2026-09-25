import { CloseButton, Dialog, Portal } from "@chakra-ui/react"

type OrigemDialogProps = {
  open: boolean
  onClose: () => void
  titulo?: React.ReactNode
  descricao?: React.ReactNode
  rodape?: React.ReactNode
  size?: "sm" | "md" | "lg"
  children?: React.ReactNode
}

// Pop-up padrão do Origem (visual na recipe "dialog", variante origem).
export function OrigemDialog({ open, onClose, titulo, descricao, rodape, size = "md", children }: OrigemDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size={size} placement="center" scrollBehavior="inside">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner px="4">
          <Dialog.Content>
            {(titulo || descricao) && (
              <Dialog.Header flexDirection="column" alignItems="flex-start" gap="2">
                {titulo && <Dialog.Title>{titulo}</Dialog.Title>}
                {descricao && <Dialog.Description>{descricao}</Dialog.Description>}
              </Dialog.Header>
            )}
            <Dialog.Body>{children}</Dialog.Body>
            {rodape && <Dialog.Footer>{rodape}</Dialog.Footer>}
            <Dialog.CloseTrigger asChild top="4" insetEnd="4">
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
