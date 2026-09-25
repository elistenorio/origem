"use client"

import { useState } from "react"
import { Button, Field, HStack, Input, RadioCard, Stack, Text } from "@chakra-ui/react"
import { opcoesFrete } from "@/dados-exemplo/consultas"
import { formatCurrency } from "@/utils/formatCurrency"
import type { OpcaoFrete } from "@/dados-exemplo/tipos"

type ShippingCalculatorProps = {
  frete?: OpcaoFrete | null
  onEscolher?: (frete: OpcaoFrete | null) => void   // no carrinho o comprador escolhe a modalidade; sem isso só consulta
}

// Campo de CEP + opções de frete. Por enquanto as opções são de exemplo (sem API).
export function ShippingCalculator({ frete = null, onEscolher }: ShippingCalculatorProps) {
  const selecionavel = !!onEscolher
  const [cep, setCep] = useState("")
  const [erro, setErro] = useState<string>()
  const [opcoes, setOpcoes] = useState<OpcaoFrete[]>([])

  function handleCalcular() {
    if (cep.replace(/\D/g, "").length !== 8) {
      setErro("Informe um CEP válido com 8 números.")
      return
    }
    const resultado = opcoesFrete(cep)
    setErro(undefined)
    setOpcoes(resultado)
    onEscolher?.(resultado[0])
  }

  return (
    <Stack gap="3">
      <Field.Root invalid={!!erro}>
        <Field.Label>Frete</Field.Label>
        <HStack w="full">
          <Input value={cep} onChange={(e) => setCep(e.target.value)} placeholder="Digite seu CEP (00000-000)" inputMode="numeric" maxLength={9} />
          <Button variant="claro" onClick={handleCalcular}>
            Calcular
          </Button>
        </HStack>
        <Field.ErrorText>{erro}</Field.ErrorText>
      </Field.Root>

      {opcoes.length > 0 && !selecionavel && (
        <Stack gap="1">
          {opcoes.map((o) => (
            <Text key={o.modalidade} textStyle="apoio">
              <strong>{o.nome}</strong> · {formatCurrency(o.valor)} · {o.prazo}
            </Text>
          ))}
        </Stack>
      )}

      {opcoes.length > 0 && selecionavel && (
        <RadioCard.Root
          value={frete?.modalidade ?? ""}
          onValueChange={(e) => onEscolher(opcoes.find((o) => o.modalidade === e.value) ?? null)}
          gap="2"
        >
          <Stack gap="2">
            {opcoes.map((o) => (
              <RadioCard.Item key={o.modalidade} value={o.modalidade}>
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <RadioCard.ItemIndicator />
                  <RadioCard.ItemContent>
                    <RadioCard.ItemText>
                      {o.nome} · {formatCurrency(o.valor)}
                    </RadioCard.ItemText>
                    <RadioCard.ItemDescription>{o.prazo}</RadioCard.ItemDescription>
                  </RadioCard.ItemContent>
                </RadioCard.ItemControl>
              </RadioCard.Item>
            ))}
          </Stack>
        </RadioCard.Root>
      )}
    </Stack>
  )
}
