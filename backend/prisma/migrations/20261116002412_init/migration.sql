-- CreateEnum
CREATE TYPE "PerfilUsuario" AS ENUM ('comprador', 'artesao', 'admin');

-- CreateEnum
CREATE TYPE "StatusUsuario" AS ENUM ('ativo', 'suspenso');

-- CreateEnum
CREATE TYPE "StatusArtesao" AS ENUM ('publicado', 'emAnalise', 'ajustesSolicitados', 'indisponivel');

-- CreateEnum
CREATE TYPE "StatusProduto" AS ENUM ('publicado', 'emAnalise', 'rascunho', 'indisponivel', 'vendida');

-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('processando', 'emSeparacao', 'enviado', 'entregue', 'cancelado');

-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('cartao', 'pix', 'boleto');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "perfil" "PerfilUsuario" NOT NULL DEFAULT 'comprador',
    "status" "StatusUsuario" NOT NULL DEFAULT 'ativo',
    "cidade" TEXT NOT NULL DEFAULT '',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cpf" TEXT,
    "telefone" TEXT,
    "endereco" JSONB,
    "formasPagamento" JSONB,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tecnica" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Tecnica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Regiao" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Regiao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artesao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "oficio" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "historia" TEXT NOT NULL,
    "citacao" TEXT NOT NULL,
    "trabalho" TEXT,
    "origemTrabalho" TEXT,
    "citacaoOrigem" TEXT,
    "gostaDeFazer" TEXT,
    "fotoUrl" TEXT NOT NULL,
    "tecnicas" TEXT[],
    "categorias" TEXT[],
    "status" "StatusArtesao" NOT NULL DEFAULT 'emAnalise',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "regiaoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "Artesao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "tags" TEXT[],
    "medidas" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "imagemUrl" TEXT NOT NULL,
    "imagens" TEXT[],
    "estoque" INTEGER NOT NULL DEFAULT 0,
    "pecaUnica" BOOLEAN NOT NULL DEFAULT false,
    "status" "StatusProduto" NOT NULL DEFAULT 'rascunho',
    "descricao" TEXT NOT NULL,
    "cuidados" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "artesaoId" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "tecnicaId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "regiaoId" TEXT NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "status" "StatusPedido" NOT NULL DEFAULT 'processando',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "frete" JSONB NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "comprador" JSONB NOT NULL,
    "endereco" JSONB NOT NULL,
    "pagamento" "FormaPagamento" NOT NULL,
    "parcelas" INTEGER NOT NULL DEFAULT 1,
    "codigoRastreio" TEXT,
    "previsaoEntrega" TIMESTAMP(3),
    "avaliado" BOOLEAN NOT NULL DEFAULT false,
    "motivoCancelamento" TEXT,
    "usuarioId" TEXT,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPedido" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "imagemUrl" TEXT NOT NULL,
    "artesaoNome" TEXT NOT NULL,
    "precoUnitario" DOUBLE PRECISION NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,

    CONSTRAINT "ItemPedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventoPedido" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pedidoId" TEXT NOT NULL,

    CONSTRAINT "EventoPedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "notas" JSONB NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pedidoId" TEXT NOT NULL,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Artesao_usuarioId_key" ON "Artesao"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_codigo_key" ON "Pedido"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Avaliacao_pedidoId_key" ON "Avaliacao"("pedidoId");

-- AddForeignKey
ALTER TABLE "Artesao" ADD CONSTRAINT "Artesao_regiaoId_fkey" FOREIGN KEY ("regiaoId") REFERENCES "Regiao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artesao" ADD CONSTRAINT "Artesao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_artesaoId_fkey" FOREIGN KEY ("artesaoId") REFERENCES "Artesao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_tecnicaId_fkey" FOREIGN KEY ("tecnicaId") REFERENCES "Tecnica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_regiaoId_fkey" FOREIGN KEY ("regiaoId") REFERENCES "Regiao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedido" ADD CONSTRAINT "ItemPedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedido" ADD CONSTRAINT "ItemPedido_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoPedido" ADD CONSTRAINT "EventoPedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;
