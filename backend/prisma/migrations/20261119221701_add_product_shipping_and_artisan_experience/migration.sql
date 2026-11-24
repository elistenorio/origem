-- AlterTable
ALTER TABLE "Artesao" ADD COLUMN     "tempoAtuacao" TEXT;

-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "embalagem" TEXT,
ADD COLUMN     "peso" TEXT,
ADD COLUMN     "prazoPostagem" TEXT;
