import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  findMine(userId: string) {
    return this.prisma.book.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(userId: string, dto: CreateBookDto) {
    return this.prisma.book.create({
      data: { ...dto, ownerId: userId },
    });
  }

  async update(userId: string, bookId: string, dto: UpdateBookDto) {
    await this.assertOwnership(userId, bookId);
    return this.prisma.book.update({ where: { id: bookId }, data: dto });
  }

  async remove(userId: string, bookId: string) {
    const book = await this.assertOwnership(userId, bookId);

    if (book.status !== 'DISPONIVEL') {
      throw new ForbiddenException(
        'Só é possível remover livros com status DISPONIVEL.',
      );
    }

    const activeTrade = await this.prisma.trade.findFirst({
      where: {
        status: 'PENDENTE',
        OR: [{ offeredBookId: bookId }, { requestedBookId: bookId }],
      },
      select: { id: true },
    });
    if (activeTrade) {
      throw new ForbiddenException(
        'Existe uma proposta pendente envolvendo este livro.',
      );
    }

    await this.prisma.book.delete({ where: { id: bookId } });
  }

  private async assertOwnership(userId: string, bookId: string) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Livro não encontrado.');
    if (book.ownerId !== userId) {
      throw new ForbiddenException('Este livro não é seu.');
    }
    return book;
  }
}