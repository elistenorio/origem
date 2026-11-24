"use client"

import { SimpleGrid } from "@chakra-ui/react"
import { FormField } from "@/components/common/FormField"
import { AppCheckbox } from "@/components/common/AppCheckbox"
import type { StepProps } from "@/types/artisan-registration"
import { PasswordHints } from "../PasswordHints"
import { StepForm } from "../StepForm"

export function StepIdentification({ data, onChange, onNext }: StepProps) {
  const senhasDiferentes =
    data.confirmarSenha !== "" && data.senha !== data.confirmarSenha

  return (
    <StepForm onSubmit={onNext} disabled={!data.aceitouTermos || senhasDiferentes}>
      <FormField label="Nome completo" placeholder="Nome Sobrenome" required
        value={data.nome} onChange={(e) => onChange("nome", e.target.value)} />
      <FormField label="Email" hint="Você vai usar este email para entrar no site." type="email" placeholder="email@exemplo.com" required
        value={data.email} onChange={(e) => onChange("email", e.target.value)} />

      <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
        <FormField label="Senha" type="password" placeholder="******" required minLength={8}
          value={data.senha} onChange={(e) => onChange("senha", e.target.value)} />
        <FormField label="Confirme a senha" type="password" placeholder="******" required
          value={data.confirmarSenha}
          onChange={(e) => onChange("confirmarSenha", e.target.value)}
          error={senhasDiferentes ? "As senhas não conferem" : undefined} />
      </SimpleGrid>

      <PasswordHints />

      <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
        <FormField label="Telefone" type="tel" placeholder="(DDD) 00000-0000"
          value={data.telefone} onChange={(e) => onChange("telefone", e.target.value)} />
        <FormField label="Celular" hint="De preferência com WhatsApp, para a equipe falar com você." type="tel" placeholder="(DDD) 00000-0000"
          value={data.celular} onChange={(e) => onChange("celular", e.target.value)} />
      </SimpleGrid>

      <AppCheckbox
        checked={data.aceitouTermos}
        onCheckedChange={(e) => onChange("aceitouTermos", e.checked === true)}
      >
        Aceite dos Termos de Uso e Política de Privacidade
      </AppCheckbox>
    </StepForm>
  )
}