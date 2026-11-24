import { Alert } from "@chakra-ui/react"

type CurationNoticeProps = {
  status: string
  parecer?: string
  item: "peca" | "perfil"
}

const TEXTOS = {
  peca: {
    ajustes: "Corrija a peça e salve com “Enviar para análise” para ela voltar à curadoria.",
    recusado: "Ela não pode ser editada nem reenviada, mas você pode excluí-la.",
    tituloRecusado: "Peça recusada pela curadoria",
  },
  perfil: {
    ajustes: "Corrija o perfil e salve: ele volta para a análise da curadoria.",
    recusado: "Fale com o suporte do Origem se tiver dúvidas.",
    tituloRecusado: "Cadastro recusado pela curadoria",
  },
}

export function CurationNotice({ status, parecer, item }: CurationNoticeProps) {
  if (status !== "ajustesSolicitados" && status !== "recusado") return null
  const recusado = status === "recusado"
  const textos = TEXTOS[item]

  return (
    <Alert.Root status={recusado ? "error" : "warning"}>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{recusado ? textos.tituloRecusado : "A curadoria pediu ajustes"}</Alert.Title>
        <Alert.Description>
          {parecer && <>“{parecer}” </>}
          {recusado ? textos.recusado : textos.ajustes}
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  )
}
