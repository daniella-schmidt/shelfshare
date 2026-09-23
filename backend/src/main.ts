import 'reflect-metadata';
import 'dotenv/config';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); 
  
  // O frontend roda em outra porta (5173), entao precisa de CORS liberado.
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
  });

  // Valida todo DTO de entrada automaticamente:
  // - whitelist: remove campos que nao estao no DTO
  // - forbidNonWhitelisted: rejeita a requisicao se vier campo extra
  // - transform: converte o body para a classe do DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Traduz erros do Prisma (violacao de unique, registro inexistente, ...)
  // em respostas HTTP adequadas, em vez de 500.
  app.useGlobalFilters(new PrismaExceptionFilter());

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  console.log(`ShelfShare API rodando em http://localhost:${port}`);
}

void bootstrap();
