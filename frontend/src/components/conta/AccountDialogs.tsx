"use client"

import { useState } from "react"
import { SimpleGrid, Text } from "@chakra-ui/react"
import { FormField } from "@/components/common/FormField"
import { SelectField } from "@/components/common/SelectField"
import { BANDEIRAS_CARTAO } from "@/constants/conta"
import { ESTADOS } from "@/constants/regioes"
import { useEnvio } from "@/hooks/useEnvio"
import { minhaContaService } from "@/services/minhaConta.service"
import type { Endereco } from "@/types/pedido"
import type { MinhaConta } from "@/types/usuario"
import { AccountFormDialog } from "./AccountFormDialog"

type DialogProps = { open: boolean; onClose: () => void }
type ComConta = DialogProps & { conta: MinhaConta; onSalvo: (conta: MinhaConta) => void }

export function PersonalDataDialog({ open, onClose, conta, onSalvo }: ComConta) {
  const [nome, setNome] = useState(conta.nome)
  const [telefone, setTelefone] = useState(conta.telefone)
  const [cpf, setCpf] = useState("")
  const { enviando, erro, enviar } = useEnvio("Não foi possível salvar seus dados.")

  async function salvar() {
    const ok = await enviar(async () => onSalvo(await minhaContaService.atualizarDados({ nome, telefone, cpf: cpf || undefined })))
    if (ok) onClose()
  }

  return (
    <AccountFormDialog open={open} onClose={onClose} titulo="Editar dados" textoConfirmar="Salvar" enviando={enviando} erro={erro} onConfirmar={salvar}>
      <FormField label="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} />
      <FormField label="Telefone" type="tel" placeholder="(DDD) 00000-0000" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
      <FormField label="CPF" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)}
        hint={conta.cpf ? `Atual: ${conta.cpf}. Deixe vazio para manter.` : "Guardamos só uma versão mascarada do CPF."} />
    </AccountFormDialog>
  )
}

export function AddressDialog({ open, onClose, conta, onSalvo }: ComConta) {
  const [endereco, setEndereco] = useState<Endereco>({ ...conta.endereco, estado: conta.endereco.estado || "PE" })
  const { enviando, erro, enviar } = useEnvio("Não foi possível salvar o endereço.")
  const campo = (nome: keyof Endereco) => ({ value: endereco[nome], onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEndereco((a) => ({ ...a, [nome]: e.target.value })) })

  async function salvar() {
    const ok = await enviar(async () => onSalvo(await minhaContaService.salvarEndereco(endereco)))
    if (ok) onClose()
  }

  return (
    <AccountFormDialog open={open} onClose={onClose} titulo="Endereço de entrega" textoConfirmar="Salvar endereço" enviando={enviando} erro={erro} onConfirmar={salvar}>
      <SimpleGrid columns={{ base: 1, sm: 2 }} gap="4">
        <FormField label="CEP" placeholder="00000-000" {...campo("cep")} />
        <FormField label="Número" {...campo("numero")} />
      </SimpleGrid>
      <FormField label="Rua" {...campo("rua")} />
      <SimpleGrid columns={{ base: 1, sm: 2 }} gap="4">
        <FormField label="Complemento" {...campo("complemento")} />
        <FormField label="Bairro" {...campo("bairro")} />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, sm: 2 }} gap="4">
        <FormField label="Cidade" {...campo("cidade")} />
        <SelectField label="Estado" options={ESTADOS} value={endereco.estado} onChange={(estado) => setEndereco((a) => ({ ...a, estado }))} />
      </SimpleGrid>
    </AccountFormDialog>
  )
}

export function PasswordDialog({ open, onClose }: DialogProps) {
  const [atual, setAtual] = useState("")
  const [nova, setNova] = useState("")
  const [confirmacao, setConfirmacao] = useState("")
  const [salva, setSalva] = useState(false)
  const { enviando, erro, setErro, enviar } = useEnvio("Não foi possível trocar a senha.")

  async function salvar() {
    if (nova !== confirmacao) {
      setErro("As senhas novas não conferem.")
      return
    }
    const ok = await enviar(() => minhaContaService.alterarSenha(atual, nova))
    if (ok) setSalva(true)
  }

  return (
    <AccountFormDialog open={open} onClose={onClose} titulo="Alterar senha" textoConfirmar="Trocar senha" enviando={enviando} erro={erro} onConfirmar={salvar}>
      {salva ? (
        <Text color="origem.texto">Senha trocada. Use a nova senha no próximo login.</Text>
      ) : (
        <>
          <FormField label="Senha atual" type="password" value={atual} onChange={(e) => setAtual(e.target.value)} />
          <FormField label="Nova senha" type="password" hint="Pelo menos 8 caracteres." value={nova} onChange={(e) => setNova(e.target.value)} />
          <FormField label="Confirme a nova senha" type="password" value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} />
        </>
      )}
    </AccountFormDialog>
  )
}

export function CardDialog({ open, onClose, onSalvo }: Omit<ComConta, "conta">) {
  const [bandeira, setBandeira] = useState("Visa")
  const [ultimosDigitos, setUltimosDigitos] = useState("")
  const { enviando, erro, enviar } = useEnvio("Não foi possível guardar o cartão.")

  async function salvar() {
    const ok = await enviar(async () => onSalvo(await minhaContaService.adicionarCartao({ bandeira, ultimosDigitos })))
    if (ok) onClose()
  }

  return (
    <AccountFormDialog open={open} onClose={onClose} titulo="Adicionar cartão" descricao="Guardamos só a bandeira e os 4 últimos números, para você reconhecer o cartão. Nunca o número completo." textoConfirmar="Guardar cartão" enviando={enviando} erro={erro} onConfirmar={salvar}>
      <SelectField label="Bandeira" options={BANDEIRAS_CARTAO} value={bandeira} onChange={setBandeira} />
      <FormField label="4 últimos números" inputMode="numeric" maxLength={4} placeholder="0000" value={ultimosDigitos} onChange={(e) => setUltimosDigitos(e.target.value.replace(/\D/g, ""))} />
    </AccountFormDialog>
  )
}

export function DeleteAccountDialog({ open, onClose, onExcluida }: DialogProps & { onExcluida: () => void }) {
  const [senha, setSenha] = useState("")
  const { enviando, erro, enviar } = useEnvio("Não foi possível excluir a conta.")

  async function excluir() {
    const ok = await enviar(() => minhaContaService.excluirConta(senha))
    if (ok) onExcluida()
  }

  return (
    <AccountFormDialog open={open} onClose={onClose} titulo="Excluir a sua conta?" descricao="Seus dados pessoais, endereço e formas de pagamento serão apagados. Os pedidos ficam guardados sem ligação com a conta. Essa ação não pode ser desfeita." textoConfirmar="Excluir conta" perigo enviando={enviando} erro={erro} onConfirmar={excluir}>
      <FormField label="Digite sua senha para confirmar" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
    </AccountFormDialog>
  )
}
