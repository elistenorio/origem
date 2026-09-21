import { Flex } from "@chakra-ui/react"

type AuthBackgroundProps = {
  image: string // caminho a partir de /public, ex.: "/images/bg-login.png"
  children: React.ReactNode
}

export function AuthBackground({ image, children }: AuthBackgroundProps) {
  return (
    <Flex
      flex="1"
      align="center"
      justify="center"
      p="4"
      backgroundImage={`url('${image}')`}
      backgroundSize="cover"
      backgroundPosition="center"
    >
      {children}
    </Flex>
  )
}