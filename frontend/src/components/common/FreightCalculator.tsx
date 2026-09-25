"use client"

import { useState, type FormEvent } from "react"
import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react"
import { BiMapPin, BiPackage } from "react-icons/bi"
import type { IconType } from "react-icons"
import { FormField } from "@/components/common/FormField"
import { Panel } from "@/components/common/Panel"
import { formatCurrency } from "@/utils/formatCurrency"

type OpcaoFrete = {
  id: string
  nome: string
  prazo: string
  preco: number | "gratis"
  icon: IconType
}

type ResultadoFrete = {
  regiao: string
  opcoes: OpcaoFrete[]
}

// TODO(fake-api): trocar por `fretesService.calcular(cep)` (GET /frete?cep=...) quando a
// Fake API existir. Por enquanto estima pela faixa do CEP (50-56 = Pernambuco).
function buscarOpcoesFrete(cep: string): ResultadoFrete {
  const prefixo = Number(cep.replace(/\D/g, "").slice(0, 2))
  const local = prefixo >= 50 && prefixo <= 56
  return {
    regiao: local ? "Recife/PE" : "fora de Pernambuco",
    opcoes: [
      { id: "pac", nome: "PAC", prazo: local ? "6 a 8 dias úteis" : "8 a 12 dias úteis", preco: local ? 24.9 : 38.9, icon: BiPackage },
      { id: "sedex", nome: "SEDEX", prazo: local ? "2 a 3 dias úteis" : "4 a 6 dias úteis", preco: local ? 42.5 : 59.9, icon: BiPackage },
      { id: "retirada", nome: "Retirada com o artesão", prazo: "Combinar horário", preco: "gratis", icon: BiMapPin },
    ],
  }
}

const formatarPreco = (preco: OpcaoFrete["preco"]) => (preco === "gratis" ? "Grátis" : formatCurrency(preco))

export function FreightCalculator() {
  const [cep, setCep] = useState("")
  const [resultado, setResultado] = useState<ResultadoFrete | null>(null)
  const [erro, setErro] = useState<string>()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (cep.replace(/\D/g, "").length !== 8) {
      setErro("Informe um CEP válido com 8 números.")
      setResultado(null)
      return
    }
    setErro(undefined)
    setResultado(buscarOpcoesFrete(cep))
  }

  return (
    <Panel title="Calcular frete">
      <Text fontSize="sm" color="origem.textoSuave" mt={-2}>
        Simule o frete de uma peça até o seu endereço.
      </Text>

      <form onSubmit={handleSubmit}>
        <Stack gap={4}>
          <FormField
            label="CEP"
            placeholder="00000-000"
            value={cep}
            onChange={(event) => setCep(event.target.value)}
            error={erro}
          />
          <Button type="submit" variant="origem" w="full">
            Calcular
          </Button>
        </Stack>
      </form>

      {resultado && (
        <Stack gap={3}>
          <Text fontWeight="bold" textTransform="uppercase" fontSize="sm" color="origem.texto">
            Resultado para {resultado.regiao}
          </Text>
          {resultado.opcoes.map((opcao) => (
            <HStack key={opcao.id} justify="space-between" bg="origem.fundo" borderRadius="lg" p={3}>
              <HStack gap={3}>
                <Box color="origem.laranja">
                  <opcao.icon size={20} />
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="origem.texto">{opcao.nome}</Text>
                  <Text fontSize="xs" color="origem.textoSuave">{opcao.prazo}</Text>
                </Box>
              </HStack>
              <Text fontWeight="bold" color="origem.texto">{formatarPreco(opcao.preco)}</Text>
            </HStack>
          ))}
        </Stack>
      )}
    </Panel>
  )
}
