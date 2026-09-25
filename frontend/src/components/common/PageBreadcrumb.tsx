import { Fragment } from "react"
import NextLink from "next/link"
import { Breadcrumb, Text } from "@chakra-ui/react"

type Crumb = { label: string; href?: string } // sem href = página atual

export function PageBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <Breadcrumb.Root fontSize="sm" color="origem.textoSuave">
      <Breadcrumb.List>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            // Separator é item da lista (<li>) irmão do Item, não filho dele.
            <Fragment key={item.label}>
              <Breadcrumb.Item>
                {isLast ? (
                  <Breadcrumb.CurrentLink>{item.label}</Breadcrumb.CurrentLink>
                ) : item.href ? (
                  <Breadcrumb.Link asChild>
                    <NextLink href={item.href}>{item.label}</NextLink>
                  </Breadcrumb.Link>
                ) : (
                  // rótulo do meio sem link próprio, ex.: "Ajuda" — não é a página atual
                  <Text as="span">{item.label}</Text>
                )}
              </Breadcrumb.Item>
              {!isLast && <Breadcrumb.Separator />}
            </Fragment>
          )
        })}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  )
}
