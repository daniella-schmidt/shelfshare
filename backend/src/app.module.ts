import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BooksModule } from './modules/books/books.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { TradesModule } from './modules/trades/trades.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    BooksModule,
    CatalogModule,
    TradesModule,
  ],
})
export class AppModule {}
