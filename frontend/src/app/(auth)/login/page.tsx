import { AuthCard } from "@/components/auth/AuthCard"
import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <AuthCard title="Entrar na sua conta">
      <LoginForm />
    </AuthCard>
  )
}