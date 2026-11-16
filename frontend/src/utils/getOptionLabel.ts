// Converte o valor salvo de uma opção (ex.: "modelagem-manual") no texto exibido (ex.: "Modelagem manual").
// Se o valor não estiver na lista, devolve o próprio valor, para a tela nunca ficar em branco.
export function getOptionLabel(opcoes: readonly { value: string; label: string }[], valor: string): string {
  return opcoes.find((opcao) => opcao.value === valor)?.label ?? valor
}
