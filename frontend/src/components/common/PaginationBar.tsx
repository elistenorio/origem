import { ButtonGroup, IconButton, Pagination } from "@chakra-ui/react"
import { BiChevronLeft, BiChevronRight } from "react-icons/bi"

type PaginationBarProps = {
  page: number
  pageSize: number
  total: number
  onChange: (page: number) => void
}

// Paginação das listas (usa o formato Paginated da API).
export function PaginationBar({ page, pageSize, total, onChange }: PaginationBarProps) {
  if (total <= pageSize) return null
  return (
    <Pagination.Root count={total} pageSize={pageSize} page={page} onPageChange={(e) => onChange(e.page)} display="flex" justifyContent="center" mt="8">
      <ButtonGroup variant="ghost" size="sm" color="origem.texto">
        <Pagination.PrevTrigger asChild>
          <IconButton aria-label="Página anterior">
            <BiChevronLeft />
          </IconButton>
        </Pagination.PrevTrigger>
        <Pagination.Items
          render={(item) => (
            <IconButton variant={item.value === page ? "claro" : "ghost"} minH="auto" px="0" aria-label={`Página ${item.value}`}>
              {item.value}
            </IconButton>
          )}
        />
        <Pagination.NextTrigger asChild>
          <IconButton aria-label="Próxima página">
            <BiChevronRight />
          </IconButton>
        </Pagination.NextTrigger>
      </ButtonGroup>
    </Pagination.Root>
  )
}
