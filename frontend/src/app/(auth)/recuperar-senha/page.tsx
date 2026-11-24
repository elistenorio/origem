import { AuthBackground } from "@/components/autenticacao/AuthBackground"
import { AuthCard } from "@/components/autenticacao/AuthCard"
import { PasswordRecoveryHelp } from "@/components/autenticacao/PasswordRecoveryHelp"

// "Esqueci minha senha": por enquanto o site não envia e-mail, então a tela explica como pedir uma senha nova.
export default function RecuperarSenhaPage() {
  return (
    <AuthBackground image="/images/bg-login.png">
      <AuthCard title="Esqueceu sua senha?">
        <PasswordRecoveryHelp />
      </AuthCard>
    </AuthBackground>
  )
}
