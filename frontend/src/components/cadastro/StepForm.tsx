import { Stack } from "@chakra-ui/react"
import { Button } from "@chakra-ui/react"

type StepFormProps = {
  onSubmit: () => void
  children: React.ReactNode
  submitLabel?: string
  disabled?: boolean
  loading?: boolean
}

export function StepForm({ onSubmit, children, submitLabel = "Continuar", disabled, loading }: StepFormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <Stack gap="5">
        {children}
        <Button type="submit" alignSelf="center" mt="4" disabled={disabled} loading={loading}>
          {submitLabel}
        </Button>
      </Stack>
    </form>
  )
}