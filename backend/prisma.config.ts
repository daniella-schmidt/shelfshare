// Atencao: quando existe um prisma.config.ts, o Prisma NAO carrega o .env
// automaticamente. O import abaixo faz esse carregamento — sem ele o
// `prisma migrate` falha por nao encontrar DATABASE_URL.
import "dotenv/config";

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  datasource: {
    url: env("DATABASE_URL"),
  },
});
