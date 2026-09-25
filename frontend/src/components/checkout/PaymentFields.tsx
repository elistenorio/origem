import { RadioCard, SimpleGrid, Stack } from "@chakra-ui/react"
import { BiCreditCard, BiBarcode } from "react-icons/bi"
import { MdPix } from "react-icons/md"
import { FormField } from "@/components/common/FormField"
import { SelectField } from "@/components/common/SelectField"
import { formatCurrency } from "@/utils/formatCurrency"
import type { DadosCheckout, ErrosCheckout } from "@/dados-exemplo/tipos"
import type { FormaPagamento } from "@/dados-exemplo/tipos"

type PaymentFieldsProps = {
  dados: DadosCheckout
  erros: ErrosCheckout
  total: number
  onChange: <K extends keyof DadosCheckout>(campo: K, valor: DadosCheckout[K]) => void
}

const FORMAS: { value: FormaPagamento; titulo: string; descricao: string; icone: React.ReactNode }[] = [
  { value: "cartao", titulo: "Cartão de crédito", descricao: "Até 6x sem juros", icone: <BiCreditCard /> },
  { value: "pix", titulo: "Pix", descricao: "Aprovação na hora", icone: <MdPix /> },
  { value: "boleto", titulo: "Boleto bancário", descricao: "Compensação em até 3 dias úteis", icone: <BiBarcode /> },
]

// Escolha da forma de pagamento + dados do cartão.
export function PaymentFields({ dados, erros, total, onChange }: PaymentFieldsProps) {
  const parcelas = [1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: `${n}x de ${formatCurrency(total / n)} sem juros` }))

  return (
    <Stack gap="5">
      <RadioCard.Root value={dados.pagamento} onValueChange={(e) => onChange("pagamento", e.value as FormaPagamento)}>
        <Stack gap="2">
          {FORMAS.map((f) => (
            <RadioCard.Item key={f.value} value={f.value}>
              <RadioCard.ItemHiddenInput />
              <RadioCard.ItemControl>
                <RadioCard.ItemIndicator />
                <RadioCard.ItemContent>
                  <RadioCard.ItemText>{f.titulo}</RadioCard.ItemText>
                  <RadioCard.ItemDescription>{f.descricao}</RadioCard.ItemDescription>
                </RadioCard.ItemContent>
                {f.icone}
              </RadioCard.ItemControl>
            </RadioCard.Item>
          ))}
        </Stack>
      </RadioCard.Root>

      {dados.pagamento === "cartao" && (
        <Stack gap="4">
          <FormField label="Número do cartão" inputMode="numeric" placeholder="0000 0000 0000 0000" value={dados.numeroCartao} onChange={(e) => onChange("numeroCartao", e.target.value)} error={erros.numeroCartao} autoComplete="cc-number" />
          <FormField label="Nome no cartão" placeholder="Como está impresso no cartão" value={dados.nomeCartao} onChange={(e) => onChange("nomeCartao", e.target.value)} error={erros.nomeCartao} autoComplete="cc-name" />
          <SimpleGrid columns={2} gap="3">
            <FormField label="Validade" placeholder="MM/AA" value={dados.validade} onChange={(e) => onChange("validade", e.target.value)} error={erros.validade} autoComplete="cc-exp" />
            <FormField label="CVV" inputMode="numeric" placeholder="000" value={dados.cvv} onChange={(e) => onChange("cvv", e.target.value)} error={erros.cvv} autoComplete="cc-csc" />
          </SimpleGrid>
          <SelectField label="Parcelamento" options={parcelas} value={dados.parcelas} onChange={(v) => onChange("parcelas", v)} />
        </Stack>
      )}
    </Stack>
  )
}
