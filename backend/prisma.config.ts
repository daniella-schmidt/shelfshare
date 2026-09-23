// backend/prisma.config.ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // A CLI do Prisma (migrate, db pull) usa ESTA URL.
    // Deve ser a conexão DIRETA (porta 5432).
    url: env("DIRECT_URL"),
  },
});