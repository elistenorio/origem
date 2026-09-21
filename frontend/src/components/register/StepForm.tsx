import { Stack } from "@chakra-ui/react"
import { PrimaryButton } from "@/components/common/PrimaryButton"

type StepFormProps = {
  onSubmit: () => void
  children: React.ReactNode
  submitLabel?: string
  disabled?: boolean
}

export function StepForm({ onSubmit, children, submitLabel = "Continuar", disabled }: StepFormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <Stack gap="5">
        {children}
        <PrimaryButton type="submit" alignSelf="center" mt="4" disabled={disabled}>
          {submitLabel}
        </PrimaryButton>
      </Stack>
    </form>
  )
}