import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';

@Module({
  imports: [AuthModule],
  controllers: [TradesController],
  providers: [TradesService],
})
export class TradesModule {}
