import { Stack } from "@chakra-ui/react"
import { Button } from "@chakra-ui/react"

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
        <Button type="submit" alignSelf="center" mt="4" disabled={disabled}>
          {submitLabel}
        </Button>
      </Stack>
    </form>
  )
}