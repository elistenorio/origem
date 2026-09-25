"use client"

import { useState } from "react"
import { Button, Text } from "@chakra-ui/react"
import { OrigemDialog } from "@/components/common/OrigemDialog"
import { QuantityStepper } from "@/components/common/QuantityStepper"
import type { Produto } from "@/dados-exemplo/tipos"

type EditStockDialogProps = {
  produto: Produto
  onClose: () => void
  onSalvar: (quantidade: number) => void
}

// Pop-up "Editar quantidade" do estoque.
export function EditStockDialog({ produto, onClose, onSalvar }: EditStockDialogProps) {
  const [quantidade, setQuantidade] = useState(produto.estoque)
  return (
    <OrigemDialog
      open
      onClose={onClose}
      titulo="Editar quantidade"
      descricao={produto.titulo}
      size="sm"
      rodape={
        <>
          <Button variant="claro" onClick={onClose}>Cancelar</Button>
          <Button variant="origem" onClick={() => onSalvar(quantidade)}>Salvar</Button>
        </>
      }
    >
      <Text textStyle="rotulo">Quantidade disponível</Text>
      <QuantityStepper value={quantidade} onChange={(v) => setQuantidade(Math.max(0, v))} />
    </OrigemDialog>
  )
}
