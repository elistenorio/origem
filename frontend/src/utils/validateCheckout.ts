import type { DadosCheckout, ErrosCheckout } from "@/dados-exemplo/tipos"

const OBRIGATORIOS: [keyof DadosCheckout, string][] = [
  ["nome", "Informe seu nome completo."],
  ["cpf", "Informe o CPF."],
  ["telefone", "Informe um telefone."],
  ["cep", "Informe o CEP."],
  ["rua", "Informe a rua."],
  ["numero", "Informe o número."],
  ["bairro", "Informe o bairro."],
  ["cidade", "Informe a cidade."],
  ["estado", "Escolha o estado."],
]

// Valida o checkout antes de enviar o pedido. Retorna só os campos com erro.
export function validateCheckout(dados: DadosCheckout): ErrosCheckout {
  const erros: ErrosCheckout = {}
  for (const [campo, mensagem] of OBRIGATORIOS) if (!String(dados[campo]).trim()) erros[campo] = mensagem
  if (!dados.email.includes("@")) erros.email = "Informe um e-mail válido."
  if (dados.cpf && dados.cpf.replace(/\D/g, "").length !== 11) erros.cpf = "O CPF precisa ter 11 números."
  if (dados.pagamento === "cartao") {
    if (dados.numeroCartao.replace(/\D/g, "").length < 13) erros.numeroCartao = "Número do cartão inválido."
    if (!dados.nomeCartao.trim()) erros.nomeCartao = "Informe o nome impresso no cartão."
    if (!/^\d{2}\/\d{2}$/.test(dados.validade)) erros.validade = "Use o formato MM/AA."
    if (!/^\d{3,4}$/.test(dados.cvv)) erros.cvv = "CVV inválido."
  }
  return erros
}
