import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../../common/types/authenticated-user';
import { CreateTradeDto } from './dto/create-trade.dto';
import { TradesService } from './trades.service';

@Controller('trades')
@UseGuards(JwtAuthGuard)
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  /** POST /trades -> cria uma proposta de troca */
  @Post()
  propose(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateTradeDto) {
    return this.tradesService.propose(user.id, dto);
  }

  /** GET /trades/received -> propostas que me fizeram */
  @Get('received')
  received(@CurrentUser() user: AuthenticatedUser) {
    return this.tradesService.findReceived(user.id);
  }

  /** GET /trades/sent -> propostas que eu fiz */
  @Get('sent')
  sent(@CurrentUser() user: AuthenticatedUser) {
    return this.tradesService.findSent(user.id);
  }

  /** PATCH /trades/:id/accept -> so o dono do livro pedido */
  @Patch(':id/accept')
  accept(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.tradesService.accept(user.id, id);
  }

  /** PATCH /trades/:id/reject -> so o dono do livro pedido */
  @Patch(':id/reject')
  reject(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.tradesService.reject(user.id, id);
  }

  /** PATCH /trades/:id/cancel -> so o proponente */
  @Patch(':id/cancel')
  cancel(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.tradesService.cancel(user.id, id);
  }

  /** PATCH /trades/:id/confirm -> cada parte confirma que a troca ocorreu */
  @Patch(':id/confirm')
  confirm(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.tradesService.confirm(user.id, id);
  }
}
