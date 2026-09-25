"use client"

import { useState } from "react"
import NextLink from "next/link"
import { Badge, HStack, IconButton, Image, Stack, Table, Tabs, Text } from "@chakra-ui/react"
import { BiShow, BiBlock, BiCheckCircle } from "react-icons/bi"
import { Panel } from "@/components/common/Panel"
import { StatusBadge } from "@/components/common/StatusBadge"
import { EmptyMessage } from "@/components/feedback/EmptyMessage"
import { ArtisanPageHeader } from "@/components/artesao/ArtisanPageHeader"
import { artesaosExemplo } from "@/dados-exemplo/artesaos"
import { pedidosExemplo } from "@/dados-exemplo/pedidos"
import { produtosExemplo } from "@/dados-exemplo/produtos"
import { usuariosExemplo } from "@/dados-exemplo/usuarios"
import { CATEGORIAS } from "@/constants/categorias"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"
import type { Artesao, Pedido, Produto, Usuario } from "@/dados-exemplo/tipos"
import { AdminShell } from "./AdminShell"
import { ManagementTable, type Coluna } from "./ManagementTable"

const STATUS_ARTESAO = [{ value: "publicado", label: "Publicado" }, { value: "emAnalise", label: "Em análise" }, { value: "ajustesSolicitados", label: "Ajustes solicitados" }, { value: "indisponivel", label: "Suspenso" }]
const STATUS_USUARIO = [{ value: "ativo", label: "Ativo" }, { value: "suspenso", label: "Suspenso" }]
const STATUS_PRODUTO = [{ value: "publicado", label: "Publicado" }, { value: "emAnalise", label: "Em análise" }, { value: "rascunho", label: "Rascunho" }, { value: "indisponivel", label: "Indisponível" }]
const STATUS_PEDIDO = [{ value: "processando", label: "Processando" }, { value: "emSeparacao", label: "Em separação" }, { value: "enviado", label: "Enviado" }, { value: "entregue", label: "Entregue" }, { value: "cancelado", label: "Cancelado" }]

// Gestão da plataforma (Tela 05 admin): abas de artesãos, clientes, produtos, pedidos, categorias e conteúdos.
// Por enquanto com dados de exemplo; suspender/reativar só muda o estado local.
export function ManagementView() {
  const [artesaos, setArtesaos] = useState(artesaosExemplo)

  function alternarArtesao(a: Artesao) {
    const status = a.status === "indisponivel" ? "publicado" : "indisponivel"
    setArtesaos((atual) => atual.map((item) => (item.id === a.id ? { ...item, status } : item)))
  }

  const colunasArtesao: Coluna<Artesao>[] = [
    { titulo: "Artesão", render: (a) => (
      <HStack gap="3"><Image src={a.fotoUrl} alt="" boxSize="10" borderRadius="full" objectFit="cover" /><Stack gap="0"><Text fontWeight="bold">{a.nome}</Text><Text textStyle="apoio">{a.email}</Text></Stack></HStack>
    ) },
    { titulo: "Localidade", render: (a) => `${a.cidade}/${a.estado}` },
    { titulo: "Técnica", render: (a) => a.tecnicas[0] },
    { titulo: "Peças", render: (a) => a.totalProdutos },
    { titulo: "Status", render: (a) => <StatusBadge status={a.status} /> },
    { titulo: "Ações", alinhar: "end", render: (a) => (
      <HStack justify="flex-end" gap="1">
        <IconButton asChild aria-label={`Visualizar ${a.nome}`} variant="ghost" size="sm"><NextLink href={`/artesaos/${a.id}`}><BiShow /></NextLink></IconButton>
        {(a.status === "publicado" || a.status === "indisponivel") && (
          <IconButton aria-label={a.status === "indisponivel" ? `Reativar ${a.nome}` : `Suspender ${a.nome}`} variant="ghost" size="sm" onClick={() => alternarArtesao(a)}>
            {a.status === "indisponivel" ? <BiCheckCircle /> : <BiBlock />}
          </IconButton>
        )}
      </HStack>
    ) },
  ]
  const colunasUsuario: Coluna<Usuario>[] = [
    { titulo: "Cliente", render: (u) => <Stack gap="0"><Text fontWeight="bold">{u.nome}</Text><Text textStyle="apoio">{u.email}</Text></Stack> },
    { titulo: "Cidade", render: (u) => u.cidade || "–" },
    { titulo: "Cadastro", render: (u) => formatDate(u.criadoEm) },
    { titulo: "Status", render: (u) => <Badge variant={u.status === "ativo" ? "sucesso" : "perigo"}>{u.status}</Badge> },
  ]
  const colunasProduto: Coluna<Produto>[] = [
    { titulo: "Peça", render: (p) => <HStack gap="3"><Image src={p.imagemUrl} alt="" boxSize="10" borderRadius="md" objectFit="cover" /><Text fontWeight="bold">{p.titulo}</Text></HStack> },
    { titulo: "Artesão", render: (p) => p.artesaoNome },
    { titulo: "Preço", render: (p) => formatCurrency(p.preco) },
    { titulo: "Estoque", render: (p) => p.estoque },
    { titulo: "Status", render: (p) => <StatusBadge status={p.status} /> },
    { titulo: "Ações", alinhar: "end", render: (p) => <IconButton asChild aria-label={`Visualizar ${p.titulo}`} variant="ghost" size="sm"><NextLink href={"/produto"}><BiShow /></NextLink></IconButton> },
  ]
  const colunasPedido: Coluna<Pedido>[] = [
    { titulo: "Pedido", render: (p) => <Text fontWeight="bold">{p.codigo}</Text> },
    { titulo: "Cliente", render: (p) => p.comprador.nome },
    { titulo: "Data", render: (p) => formatDate(p.criadoEm) },
    { titulo: "Valor", render: (p) => formatCurrency(p.total) },
    { titulo: "Status", render: (p) => <StatusBadge status={p.status} /> },
  ]

  return (
    <AdminShell ativo="gestao">
      <ArtisanPageHeader titulo="Gestão da plataforma" descricao="Gerencie artesãos, clientes, produtos, pedidos, categorias e conteúdos do Origem." />
      <Tabs.Root defaultValue="artesaos" lazyMount>
        <Tabs.List flexWrap="wrap" mb="6">
          <Tabs.Trigger value="artesaos">Artesãos</Tabs.Trigger>
          <Tabs.Trigger value="clientes">Clientes</Tabs.Trigger>
          <Tabs.Trigger value="produtos">Produtos</Tabs.Trigger>
          <Tabs.Trigger value="pedidos">Pedidos</Tabs.Trigger>
          <Tabs.Trigger value="categorias">Categorias</Tabs.Trigger>
          <Tabs.Trigger value="conteudos">Conteúdos</Tabs.Trigger>
        </Tabs.List>
        <Panel>
          <Tabs.Content value="artesaos">
            <ManagementTable itens={artesaos} textoBusca={(a) => `${a.nome} ${a.email} ${a.cidade}`} status={(a) => a.status} colunas={colunasArtesao} opcoesStatus={STATUS_ARTESAO} placeholder="Buscar por nome, e-mail ou cidade" />
          </Tabs.Content>
          <Tabs.Content value="clientes">
            <ManagementTable itens={usuariosExemplo} textoBusca={(u) => `${u.nome} ${u.email} ${u.cidade}`} status={(u) => u.status} colunas={colunasUsuario} opcoesStatus={STATUS_USUARIO} placeholder="Buscar cliente" />
          </Tabs.Content>
          <Tabs.Content value="produtos">
            <ManagementTable itens={produtosExemplo} textoBusca={(p) => `${p.titulo} ${p.artesaoNome}`} status={(p) => p.status} colunas={colunasProduto} opcoesStatus={STATUS_PRODUTO} placeholder="Buscar peça" />
          </Tabs.Content>
          <Tabs.Content value="pedidos">
            <ManagementTable itens={pedidosExemplo} textoBusca={(p) => `${p.codigo} ${p.comprador.nome}`} status={(p) => p.status} colunas={colunasPedido} opcoesStatus={STATUS_PEDIDO} placeholder="Buscar por código ou cliente" />
          </Tabs.Content>
          <Tabs.Content value="categorias">
            <Table.Root size="sm">
              <Table.Header><Table.Row><Table.ColumnHeader>Categoria</Table.ColumnHeader><Table.ColumnHeader>Identificador</Table.ColumnHeader></Table.Row></Table.Header>
              <Table.Body>
                {CATEGORIAS.map((c) => <Table.Row key={c.value}><Table.Cell>{c.label}</Table.Cell><Table.Cell>{c.value}</Table.Cell></Table.Row>)}
              </Table.Body>
            </Table.Root>
          </Tabs.Content>
          <Tabs.Content value="conteudos">
            <EmptyMessage titulo="Nenhum conteúdo cadastrado" descricao="Os conteúdos da newsletter e do blog serão gerenciados aqui." />
          </Tabs.Content>
        </Panel>
      </Tabs.Root>
    </AdminShell>
  )
}
