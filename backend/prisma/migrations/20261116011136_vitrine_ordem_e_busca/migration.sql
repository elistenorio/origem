-- Busca sem acento (GET /produtos?busca=ceramica acha "Cerâmica"). No Supabase a extensão já vem disponível.
CREATE EXTENSION IF NOT EXISTS unaccent;

-- AlterTable
ALTER TABLE "Artesao" ADD COLUMN     "relevancia" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "ordem" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "ordem" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "relevancia" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Regiao" ADD COLUMN     "ordem" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Tecnica" ADD COLUMN     "ordem" INTEGER NOT NULL DEFAULT 0;
