"use client"

import { useState } from "react"
import { Button, Text } from "@chakra-ui/react"
import { OrigemDialog } from "@/components/common/OrigemDialog"
import { QuantityStepper } from "@/components/common/QuantityStepper"
import { ESTOQUE_MAXIMO } from "@/utils/validation"
import type { Produto } from "@/types/produto"

type EditStockDialogProps = {
  produto: Produto
  onClose: () => void
  onSalvar: (quantidade: number) => void
}

// Pop-up "Mudar quantidade" do estoque.
export function EditStockDialog({ produto, onClose, onSalvar }: EditStockDialogProps) {
  const [quantidade, setQuantidade] = useState(produto.estoque)
  return (
    <OrigemDialog
      open
      onClose={onClose}
      titulo="Mudar quantidade"
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
      <Text textStyle="apoio">Toque em + quando fizer mais peças e em – quando vender fora do site.</Text>
      <QuantityStepper value={quantidade} max={ESTOQUE_MAXIMO} onChange={(v) => setQuantidade(Math.max(0, v))} />
    </OrigemDialog>
  )
}
