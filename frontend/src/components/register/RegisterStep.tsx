import { Box, Heading } from "@chakra-ui/react"
import { StepIndicator } from "./StepIndicator"

type RegisterStepProps = {
  title: string
  current: number
  total?: number
  children: React.ReactNode
}

export function RegisterStep({ title, current, total = 5, children }: RegisterStepProps) {
  return (
    <Box w="full" maxW="500px" mx="auto" px="4" py={{ base: 10, md: 20 }}>
      <Heading as="h1" variant="secao" size="xl" textAlign="center" mb="10">
        {title}
      </Heading>
      {children}
      <Box mt="6">
        <StepIndicator total={total} current={current} />
      </Box>
    </Box>
  )
}