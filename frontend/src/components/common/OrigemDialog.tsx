import { CloseButton, Dialog, Portal } from "@chakra-ui/react"

type OrigemDialogProps = {
  open: boolean
  onClose: () => void
  titulo?: React.ReactNode
  descricao?: React.ReactNode
  rodape?: React.ReactNode
  size?: "sm" | "md" | "lg"
  centralizado?: boolean // título, descrição e corpo centralizados (ex.: confirmação de sucesso)
  fechavel?: boolean // false: sem botão de fechar nem fechar clicando fora/Esc (ex.: só sai por uma ação explícita)
  children?: React.ReactNode
}

// Pop-up padrão do Origem (visual na recipe "dialog", variante origem).
export function OrigemDialog({ open, onClose, titulo, descricao, rodape, size = "md", centralizado = false, fechavel = true, children }: OrigemDialogProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => !e.open && onClose()}
      size={size}
      placement="center"
      scrollBehavior="inside"
      closeOnInteractOutside={fechavel}
      closeOnEscape={fechavel}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner px="4">
          <Dialog.Content textAlign={centralizado ? "center" : undefined}>
            {(titulo || descricao) && (
              <Dialog.Header flexDirection="column" alignItems={centralizado ? "center" : "flex-start"} gap="2">
                {titulo && <Dialog.Title>{titulo}</Dialog.Title>}
                {descricao && <Dialog.Description>{descricao}</Dialog.Description>}
              </Dialog.Header>
            )}
            <Dialog.Body alignItems={centralizado ? "center" : undefined}>{children}</Dialog.Body>
            {rodape && <Dialog.Footer justifyContent={centralizado ? "center" : undefined}>{rodape}</Dialog.Footer>}
            {fechavel && (
              <Dialog.CloseTrigger asChild top="4" insetEnd="4">
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
