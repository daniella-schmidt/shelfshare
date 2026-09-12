-- ShelfShare — regras que o schema.prisma nao consegue expressar sozinho.
--
-- JA APLICADAS: estas regras fazem parte da migration
-- prisma/migrations/20260911011157_init. Este arquivo fica como referencia.
--
-- COMO ACRESCENTAR SQL MANUAL EM UMA MIGRATION NOVA
--   1. npx prisma migrate dev --name <nome> --create-only   (cria, NAO aplica)
--   2. edite prisma/migrations/<timestamp>_<nome>/migration.sql
--   3. npx prisma migrate dev                               (aplica)
--
-- Sao a ultima linha de defesa: o TradesService valida tudo isso antes e
-- devolve erro amigavel. Aqui garantimos que nem um bug nem um INSERT
-- manual gravem dado inconsistente.

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
