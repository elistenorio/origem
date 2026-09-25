import { RatingGroup } from "@chakra-ui/react"

type StarRatingProps = {
  value: number
  onChange?: (value: number) => void   // sem onChange: só leitura
  size?: "sm" | "md" | "lg"
  label?: string
}

// Estrelas de 1 a 5 (avaliação de pedido). Cores na recipe "ratingGroup".
export function StarRating({ value, onChange, size = "md", label }: StarRatingProps) {
  return (
    <RatingGroup.Root count={5} value={value} onValueChange={(e) => onChange?.(e.value)} readOnly={!onChange} size={size}>
      {label && <RatingGroup.Label>{label}</RatingGroup.Label>}
      <RatingGroup.HiddenInput />
      <RatingGroup.Control />
    </RatingGroup.Root>
  )
}
