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
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateTradeDto } from './dto/create-trade.dto';
import { TradesService } from './trades.service';

@Controller('trades')
@UseGuards(JwtAuthGuard)
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Post()
  propose(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateTradeDto) {
    return this.tradesService.propose(user.id, dto);
  }

  /** GET /trades/summary -> notificações + conversas ativas */
  @Get('summary')
  summary(@CurrentUser() user: AuthenticatedUser) {
    return this.tradesService.getSummary(user.id);
  }

  @Get('received')
  received(@CurrentUser() user: AuthenticatedUser) {
    return this.tradesService.findReceived(user.id);
  }

  @Get('sent')
  sent(@CurrentUser() user: AuthenticatedUser) {
    return this.tradesService.findSent(user.id);
  }

  @Get(':id/messages')
  listMessages(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.tradesService.listMessages(user.id, id);
  }

  @Post(':id/messages')
  sendMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.tradesService.sendMessage(user.id, id, dto);
  }

  @Patch(':id/accept')
  accept(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.tradesService.accept(user.id, id);
  }

  @Patch(':id/reject')
  reject(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.tradesService.reject(user.id, id);
  }

  @Patch(':id/cancel')
  cancel(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.tradesService.cancel(user.id, id);
  }

  @Patch(':id/confirm')
  confirm(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.tradesService.confirm(user.id, id);
  }
}