import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  search(q?: string, city?: string) {
    return this.prisma.book.findMany({
      where: {
        status: 'DISPONIVEL',
        ...(q && {
          OR: [
            { title:  { contains: q, mode: 'insensitive' } },
            { author: { contains: q, mode: 'insensitive' } },
          ],
        }),
        ...(city && { owner: { city: { equals: city, mode: 'insensitive' } } }),
      },
      include: {
        owner: { select: { id: true, name: true, city: true, state: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(bookId: string) {
    const book = await this.prisma.book.findFirst({
      where: { id: bookId, status: 'DISPONIVEL' },
      include: {
        owner: { select: { id: true, name: true, city: true, state: true } },
      },
    });
    if (!book) throw new NotFoundException('Livro indisponível.');
    return book;
  }
}