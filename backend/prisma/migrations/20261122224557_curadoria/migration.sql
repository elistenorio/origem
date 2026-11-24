-- CreateEnum
CREATE TYPE "TipoCuradoria" AS ENUM ('artesaos', 'pecas');

-- CreateEnum
CREATE TYPE "DecisaoCuradoria" AS ENUM ('aprovar', 'ajustes', 'recusar');

-- AlterEnum
ALTER TYPE "StatusArtesao" ADD VALUE 'recusado';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "StatusProduto" ADD VALUE 'ajustesSolicitados';
ALTER TYPE "StatusProduto" ADD VALUE 'recusado';

-- AlterTable
ALTER TABLE "Artesao" ADD COLUMN     "parecerCuradoria" TEXT;

-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "parecerCuradoria" TEXT;

-- CreateTable
CREATE TABLE "AnaliseCuradoria" (
    "id" TEXT NOT NULL,
    "tipo" "TipoCuradoria" NOT NULL,
    "itemId" TEXT NOT NULL,
    "decisao" "DecisaoCuradoria" NOT NULL,
    "parecer" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnaliseCuradoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnaliseCuradoria_tipo_itemId_idx" ON "AnaliseCuradoria"("tipo", "itemId");
