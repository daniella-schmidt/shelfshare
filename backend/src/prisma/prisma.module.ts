import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

// @Global evita ter que importar o PrismaModule em cada modulo de feature.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
