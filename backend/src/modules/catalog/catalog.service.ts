import { Injectable, NotImplementedException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * Vitrine publica: todos os livros com status DISPONIVEL, de qualquer usuario.
 *
 * ESQUELETO — a implementacao entra na Feature 2 do roadmap.
 * Diferente do BooksService, aqui nunca se filtra pelo usuario logado: a
 * busca e' aberta. Os dados do dono saem reduzidos (nome, cidade, estado);
 * e-mail e telefone so aparecem depois de uma troca aceita.
 */
@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async search(_query?: string, _city?: string) {
    throw new NotImplementedException('Feature 2 — buscar livros disponiveis.');
  }

  async findOne(_bookId: string) {
    throw new NotImplementedException('Feature 2 — detalhe do livro.');
  }
}
