import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTradeDto } from './dto/create-trade.dto';
import { CreateMessageDto } from './dto/create-message.dto';

const USER_PUBLIC_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  city: true,
  state: true,
} as const;

const TRADE_INCLUDE = {
  offeredBook:   true,
  requestedBook: true,
  proposer: { select: USER_PUBLIC_SELECT },
  receiver: { select: USER_PUBLIC_SELECT },
} as const;

const MESSAGE_INCLUDE = {
  sender: { select: { id: true, name: true } },
} as const;

@Injectable()
export class TradesService {
  constructor(private readonly prisma: PrismaService) {}

  async propose(userId: string, dto: CreateTradeDto) {
    const offered = await this.prisma.book.findUnique({
      where: { id: dto.offeredBookId },
    });
    const requested = await this.prisma.book.findUnique({
      where: { id: dto.requestedBookId },
    });

    if (!offered || !requested) throw new NotFoundException('Livro não encontrado.');
    if (offered.ownerId !== userId) throw new ForbiddenException('Você não é dono do livro oferecido.');
    if (requested.ownerId === userId) throw new BadRequestException('Você não pode propor troca consigo mesmo.');
    if (offered.status !== 'DISPONIVEL' || requested.status !== 'DISPONIVEL') {
      throw new BadRequestException('Os dois livros precisam estar DISPONÍVEL.');
    }

    return this.prisma.trade.create({
      data: {
        proposerId: userId,
        receiverId: requested.ownerId,
        offeredBookId: dto.offeredBookId,
        requestedBookId: dto.requestedBookId,
        message: dto.message,
      },
      include: TRADE_INCLUDE,
    });
  }

  findReceived(userId: string) {
    return this.prisma.trade.findMany({
      where: { receiverId: userId },
      include: TRADE_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  findSent(userId: string) {
    return this.prisma.trade.findMany({
      where: { proposerId: userId },
      include: TRADE_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async accept(userId: string, tradeId: string) {
    return this.prisma.$transaction(async (tx) => {
      const trade = await tx.trade.findUnique({ where: { id: tradeId } });
      if (!trade) throw new NotFoundException('Proposta não encontrada.');
      if (trade.receiverId !== userId) throw new ForbiddenException('Só o dono do livro pedido aceita.');
      if (trade.status !== 'PENDENTE') throw new BadRequestException('Proposta já respondida.');

      const accepted = await tx.trade.update({
        where: { id: tradeId },
        data: { status: 'ACEITA', respondedAt: new Date() },
        include: TRADE_INCLUDE,
      });

      await tx.book.updateMany({
        where: { id: { in: [trade.offeredBookId, trade.requestedBookId] } },
        data: { status: 'RESERVADO' },
      });

      await tx.trade.updateMany({
        where: {
          id: { not: tradeId },
          status: 'PENDENTE',
          OR: [
            { offeredBookId:   { in: [trade.offeredBookId, trade.requestedBookId] } },
            { requestedBookId: { in: [trade.offeredBookId, trade.requestedBookId] } },
          ],
        },
        data: { status: 'RECUSADA', respondedAt: new Date() },
      });

      return accepted;
    });
  }

  async reject(userId: string, tradeId: string) {
    const trade = await this.loadTrade(tradeId);
    if (trade.receiverId !== userId) throw new ForbiddenException();
    if (trade.status !== 'PENDENTE') throw new BadRequestException('Proposta já respondida.');

    return this.prisma.trade.update({
      where: { id: tradeId },
      data: { status: 'RECUSADA', respondedAt: new Date() },
      include: TRADE_INCLUDE,
    });
  }

  async cancel(userId: string, tradeId: string) {
    const trade = await this.loadTrade(tradeId);
    if (trade.proposerId !== userId) throw new ForbiddenException('Só quem propôs pode cancelar.');
    if (trade.status !== 'PENDENTE') throw new BadRequestException('Só propostas PENDENTES podem ser canceladas.');

    return this.prisma.trade.update({
      where: { id: tradeId },
      data: { status: 'CANCELADA', respondedAt: new Date() },
      include: TRADE_INCLUDE,
    });
  }

  async confirm(userId: string, tradeId: string) {
    return this.prisma.$transaction(async (tx) => {
      const trade = await tx.trade.findUnique({ where: { id: tradeId } });
      if (!trade) throw new NotFoundException('Troca não encontrada.');
      if (trade.status !== 'ACEITA') throw new BadRequestException('Só trocas ACEITAS podem ser confirmadas.');

      const isProposer = trade.proposerId === userId;
      const isReceiver = trade.receiverId === userId;
      if (!isProposer && !isReceiver) throw new ForbiddenException();

      const data: any = isProposer
        ? { proposerConfirmed: true }
        : { receiverConfirmed: true };

      const proposerConfirmed = isProposer ? true : trade.proposerConfirmed;
      const receiverConfirmed = isReceiver ? true : trade.receiverConfirmed;

      if (proposerConfirmed && receiverConfirmed) {
        data.status = 'CONCLUIDA';
        data.completedAt = new Date();

        await tx.book.updateMany({
          where: { id: { in: [trade.offeredBookId, trade.requestedBookId] } },
          data: { status: 'TROCADO' },
        });
      }

      return tx.trade.update({
        where: { id: tradeId },
        data,
        include: TRADE_INCLUDE,
      });
    });
  }

  /* -------------------- CHAT -------------------- */

  async listMessages(userId: string, tradeId: string) {
    const trade = await this.loadTrade(tradeId);
    this.assertMember(userId, trade.proposerId, trade.receiverId);

    // Marca como lidas todas as mensagens da outra parte
    await this.prisma.message.updateMany({
      where: {
        tradeId,
        senderId: { not: userId },
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    return this.prisma.message.findMany({
      where: { tradeId },
      orderBy: { createdAt: 'asc' },
      include: MESSAGE_INCLUDE,
    });
  }

    async sendMessage(userId: string, tradeId: string, dto: CreateMessageDto) {
    const trade = await this.loadTrade(tradeId);
    this.assertMember(userId, trade.proposerId, trade.receiverId);

    const allowed = ['PENDENTE', 'ACEITA', 'CONCLUIDA'] as const;
    if (!allowed.includes(trade.status as any)) {
      throw new BadRequestException('Esta conversa foi encerrada.');
    }

    return this.prisma.message.create({
      data: {
        tradeId,
        senderId: userId,
        content: dto.content.trim(),
      },
      include: MESSAGE_INCLUDE,
    });
  }

  async getSummary(userId: string) {
    const [activeTrades, pendingTrades, unreadGroups] = await Promise.all([
      // Trocas "vivas" do usuário — inclui PENDENTE (para poder conversar
      // antes de aceitar/recusar) e ACEITA.
      this.prisma.trade.findMany({
        where: {
          status: { in: ['PENDENTE', 'ACEITA'] },
          OR: [{ proposerId: userId }, { receiverId: userId }],
        },
        include: {
          ...TRADE_INCLUDE,
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),

      this.prisma.trade.findMany({
        where: { receiverId: userId, status: 'PENDENTE' },
        include: TRADE_INCLUDE,
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),

      this.prisma.message.groupBy({
        by: ['tradeId'],
        where: {
          senderId: { not: userId },
          readAt: null,
          trade: {
            is: {
              OR: [{ proposerId: userId }, { receiverId: userId }],
              status: { in: ['PENDENTE', 'ACEITA', 'CONCLUIDA'] },
            },
          },
        },
        _count: { id: true },
      }),
    ]);

    const unreadByTrade = new Map(
      unreadGroups.map((g) => [g.tradeId, g._count.id]),
    );

    const activeChats = activeTrades.map((t) => {
      const otherParty = t.proposerId === userId ? t.receiver : t.proposer;
      const lastMsg = t.messages[0];
      const iAmProposer = t.proposerId === userId;
      return {
        tradeId: t.id,
        status: t.status,
        role: iAmProposer ? ('proposer' as const) : ('receiver' as const),
        otherPartyName: otherParty.name,
        unreadCount: unreadByTrade.get(t.id) ?? 0,
        lastMessagePreview: lastMsg ? lastMsg.content.slice(0, 80) : '',
        lastMessageAt: lastMsg?.createdAt ?? null,
        offeredBook: t.offeredBook.title,
        requestedBook: t.requestedBook.title,
      };
    });

    const pendingTradesList = pendingTrades.map((t) => ({
      tradeId: t.id,
      proposerName: t.proposer.name,
      offeredBook: t.offeredBook.title,
      requestedBook: t.requestedBook.title,
      createdAt: t.createdAt,
    }));

    return {
      pendingTradesCount: pendingTradesList.length,
      unreadMessagesTotal: unreadGroups.reduce((sum, g) => sum + g._count.id, 0),
      pendingTrades: pendingTradesList,
      activeChats,
    };
  }


  /* -------------------- helpers -------------------- */

  private async loadTrade(id: string) {
    const trade = await this.prisma.trade.findUnique({ where: { id } });
    if (!trade) throw new NotFoundException('Proposta não encontrada.');
    return trade;
  }

  private assertMember(userId: string, proposerId: string, receiverId: string) {
    if (userId !== proposerId && userId !== receiverId) {
      throw new ForbiddenException('Você não faz parte desta troca.');
    }
  }
}