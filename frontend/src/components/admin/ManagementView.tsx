"use client"

import { useState } from "react"
import NextLink from "next/link"
import { Alert, Badge, HStack, IconButton, Stack, Table, Tabs, Text } from "@chakra-ui/react"
import { BiShow, BiBlock, BiCheckCircle } from "react-icons/bi"
import { Tile } from "@/components/common/Tile"
import { AvatarItem } from "@/components/common/AvatarItem"
import { StatusBadge } from "@/components/common/StatusBadge"
import { DataState } from "@/components/feedback/DataState"
import { EmptyMessage } from "@/components/feedback/EmptyMessage"
import { PanelPageHeader } from "@/components/layout/PanelPageHeader"
import { useApi } from "@/hooks/useApi"
import { ApiError } from "@/services/api"
import { adminService } from "@/services/admin.service"
import { produtosService } from "@/services/produtos.service"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"
import type { Artesao } from "@/types/artesao"
import type { Pedido, StatusPedido } from "@/types/pedido"
import type { Produto } from "@/types/produto"
import type { Usuario } from "@/types/usuario"
import { AdminShell } from "./AdminShell"
import { ManagementTable, type Coluna } from "./ManagementTable"

const STATUS_ARTESAO = [{ value: "publicado", label: "Publicado" }, { value: "emAnalise", label: "Em análise" }, { value: "ajustesSolicitados", label: "Ajustes solicitados" }, { value: "indisponivel", label: "Suspenso" }, { value: "recusado", label: "Recusado" }]
const STATUS_USUARIO = [{ value: "ativo", label: "Ativo" }, { value: "suspenso", label: "Suspenso" }]
const STATUS_PRODUTO = [{ value: "publicado", label: "Publicado" }, { value: "emAnalise", label: "Em análise" }, { value: "ajustesSolicitados", label: "Ajustes solicitados" }, { value: "rascunho", label: "Rascunho" }, { value: "indisponivel", label: "Indisponível" }, { value: "recusado", label: "Recusado" }]
const STATUS_PEDIDO = [{ value: "processando", label: "Processando" }, { value: "emSeparacao", label: "Em separação" }, { value: "enviado", label: "Enviado" }, { value: "entregue", label: "Entregue" }, { value: "cancelado", label: "Cancelado" }]

function Categorias() {
  const { data, loading, error, recarregar } = useApi(() => produtosService.opcoesFiltro(), [])
  return (
    <DataState loading={loading} error={error} onRetry={recarregar} vazio={data ? data.categorias.length === 0 : undefined}>
      <Table.Root size="sm">
        <Table.Header><Table.Row><Table.ColumnHeader>Categoria</Table.ColumnHeader><Table.ColumnHeader>Identificador</Table.ColumnHeader></Table.Row></Table.Header>
        <Table.Body>
          {data?.categorias.map((c) => <Table.Row key={c.value}><Table.Cell>{c.label}</Table.Cell><Table.Cell>{c.value}</Table.Cell></Table.Row>)}
        </Table.Body>
      </Table.Root>
    </DataState>
  )
}

// Gestão da plataforma (Tela 05 admin): abas de artesãos, clientes, produtos, pedidos, categorias e conteúdos.
export function ManagementView() {
  const [versao, setVersao] = useState(0)
  const [erroAcao, setErroAcao] = useState<string>()

  async function executar(acao: () => Promise<void>) {
    setErroAcao(undefined)
    try {
      await acao()
      setVersao((v) => v + 1)
    } catch (e) {
      setErroAcao(e instanceof ApiError ? e.message : "Não foi possível concluir a ação.")
    }
  }

  const colunasArtesao: Coluna<Artesao>[] = [
    { titulo: "Artesão", render: (a) => (
      <AvatarItem src={a.fotoUrl} titulo={a.nome} subtitulo={a.email} formato="redondo" />
    ) },
    { titulo: "Localidade", render: (a) => `${a.cidade}/${a.estado}` },
    { titulo: "Técnica", render: (a) => a.tecnicas[0] ?? "–" },
    { titulo: "Peças", render: (a) => a.totalProdutos },
    { titulo: "Status", render: (a) => <StatusBadge status={a.status} /> },
    { titulo: "Ações", alinhar: "end", render: (a) => (
      <HStack justify="flex-end" gap="1">
        {a.status === "publicado" && (
          <IconButton asChild aria-label={`Visualizar ${a.nome}`} variant="ghost" size="sm"><NextLink href={`/artesaos/${a.id}`}><BiShow /></NextLink></IconButton>
        )}
        {(a.status === "publicado" || a.status === "indisponivel") && (
          <IconButton aria-label={a.status === "indisponivel" ? `Reativar ${a.nome}` : `Suspender ${a.nome}`} variant="ghost" size="sm"
            onClick={() => executar(() => adminService.alterarStatusArtesao(a.id, a.status === "indisponivel" ? "publicado" : "indisponivel"))}>
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
    { titulo: "Ações", alinhar: "end", render: (u) => (
      <IconButton aria-label={u.status === "suspenso" ? `Reativar ${u.nome}` : `Suspender ${u.nome}`} variant="ghost" size="sm"
        onClick={() => executar(() => adminService.alterarStatusCliente(u.id, u.status === "suspenso" ? "ativo" : "suspenso"))}>
        {u.status === "suspenso" ? <BiCheckCircle /> : <BiBlock />}
      </IconButton>
    ) },
  ]
  const colunasProduto: Coluna<Produto>[] = [
    { titulo: "Peça", render: (p) => <AvatarItem src={p.imagemUrl} titulo={p.titulo} /> },
    { titulo: "Artesão", render: (p) => p.artesaoNome },
    { titulo: "Preço", render: (p) => formatCurrency(p.preco) },
    { titulo: "Estoque", render: (p) => p.estoque },
    { titulo: "Status", render: (p) => <StatusBadge status={p.status} /> },
    { titulo: "Ações", alinhar: "end", render: (p) => p.status === "publicado"
      ? <IconButton asChild aria-label={`Visualizar ${p.titulo}`} variant="ghost" size="sm"><NextLink href={`/produtos/${p.id}`}><BiShow /></NextLink></IconButton>
      : null },
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
      <PanelPageHeader titulo="Gestão da plataforma" descricao="Gerencie artesãos, clientes, produtos, pedidos, categorias e conteúdos do Origem." />
      {erroAcao && (
        <Alert.Root status="error" mb="4">
          <Alert.Indicator />
          <Alert.Title>{erroAcao}</Alert.Title>
        </Alert.Root>
      )}
      <Tabs.Root defaultValue="artesaos" lazyMount>
        <Tabs.List flexWrap="wrap" mb="6">
          <Tabs.Trigger value="artesaos">Artesãos</Tabs.Trigger>
          <Tabs.Trigger value="clientes">Clientes</Tabs.Trigger>
          <Tabs.Trigger value="produtos">Produtos</Tabs.Trigger>
          <Tabs.Trigger value="pedidos">Pedidos</Tabs.Trigger>
          <Tabs.Trigger value="categorias">Categorias</Tabs.Trigger>
          <Tabs.Trigger value="conteudos">Conteúdos</Tabs.Trigger>
        </Tabs.List>
        <Tile>
          <Tabs.Content value="artesaos">
            <ManagementTable buscar={adminService.artesaos} colunas={colunasArtesao} opcoesStatus={STATUS_ARTESAO} placeholder="Buscar por nome, e-mail ou cidade" versao={versao} />
          </Tabs.Content>
          <Tabs.Content value="clientes">
            <ManagementTable buscar={adminService.clientes} colunas={colunasUsuario} opcoesStatus={STATUS_USUARIO} placeholder="Buscar por nome, e-mail ou cidade" versao={versao} />
          </Tabs.Content>
          <Tabs.Content value="produtos">
            <ManagementTable buscar={adminService.produtos} colunas={colunasProduto} opcoesStatus={STATUS_PRODUTO} placeholder="Buscar por peça ou artesão" versao={versao} />
          </Tabs.Content>
          <Tabs.Content value="pedidos">
            <ManagementTable buscar={(f) => adminService.pedidos({ ...f, status: f.status as StatusPedido | undefined })} colunas={colunasPedido} opcoesStatus={STATUS_PEDIDO} placeholder="Buscar por código ou cliente" versao={versao} />
          </Tabs.Content>
          <Tabs.Content value="categorias">
            <Categorias />
          </Tabs.Content>
          <Tabs.Content value="conteudos">
            <EmptyMessage titulo="Nenhum conteúdo cadastrado" descricao="Os conteúdos da newsletter e do blog serão gerenciados aqui." />
          </Tabs.Content>
        </Tile>
      </Tabs.Root>
    </AdminShell>
  )
}
