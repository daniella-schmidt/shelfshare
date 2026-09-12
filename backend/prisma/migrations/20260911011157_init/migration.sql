-- CreateEnum
CREATE TYPE "BookCondition" AS ENUM ('NOVO', 'OTIMO', 'BOM', 'DESGASTADO');

-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('DISPONIVEL', 'RESERVADO', 'TROCADO');

-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('PENDENTE', 'ACEITA', 'RECUSADA', 'CANCELADA', 'CONCLUIDA');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "phone" TEXT,
    "city" TEXT NOT NULL,
    "state" CHAR(2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "isbn" TEXT,
    "condition" "BookCondition" NOT NULL,
    "description" TEXT,
    "coverUrl" TEXT,
    "status" "BookStatus" NOT NULL DEFAULT 'DISPONIVEL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trades" (
    "id" TEXT NOT NULL,
    "proposerId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "offeredBookId" TEXT NOT NULL,
    "requestedBookId" TEXT NOT NULL,
    "status" "TradeStatus" NOT NULL DEFAULT 'PENDENTE',
    "message" TEXT,
    "proposerConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "receiverConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "respondedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trades_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "books_ownerId_idx" ON "books"("ownerId");

-- CreateIndex
CREATE INDEX "books_status_idx" ON "books"("status");

-- CreateIndex
CREATE INDEX "trades_receiverId_status_idx" ON "trades"("receiverId", "status");

-- CreateIndex
CREATE INDEX "trades_proposerId_status_idx" ON "trades"("proposerId", "status");

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_offeredBookId_fkey" FOREIGN KEY ("offeredBookId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_requestedBookId_fkey" FOREIGN KEY ("requestedBookId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ------------------------------------------------------------------
-- Regras extras (prisma/constraints.sql), nao expressaveis no schema
-- ------------------------------------------------------------------

-- Ninguem troca consigo mesmo.
ALTER TABLE "trades"
  ADD CONSTRAINT "trades_sem_auto_troca"
  CHECK ("proposerId" <> "receiverId");

-- Os dois livros da troca precisam ser diferentes.
ALTER TABLE "trades"
  ADD CONSTRAINT "trades_livros_distintos"
  CHECK ("offeredBookId" <> "requestedBookId");

-- A mesma pessoa nao pode ter duas propostas PENDENTES oferecendo o mesmo
-- livro pelo mesmo livro. Depois de recusada ou cancelada pode propor de
-- novo — por isso o indice e' parcial.
CREATE UNIQUE INDEX "trades_proposta_pendente_unica"
  ON "trades" ("proposerId", "offeredBookId", "requestedBookId")
  WHERE "status" = 'PENDENTE';
