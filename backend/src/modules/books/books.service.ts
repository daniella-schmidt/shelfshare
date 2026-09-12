import { Injectable, NotImplementedException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

/**
 * Estante do usuario logado.
 *
 * ESQUELETO — a implementacao entra na Feature 1 do roadmap.
 * Regras a garantir aqui:
 *  - so o dono edita ou remove o proprio livro;
 *  - so da' para remover livro DISPONIVEL e sem troca associada;
 *  - o campo `status` nunca e' alterado por este service.
 */
@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findMine(_userId: string) {
    throw new NotImplementedException('Feature 1 — listar minha estante.');
  }

  async create(_userId: string, _dto: CreateBookDto) {
    throw new NotImplementedException('Feature 1 — cadastrar livro.');
  }

  async update(_userId: string, _bookId: string, _dto: UpdateBookDto) {
    throw new NotImplementedException('Feature 1 — editar livro.');
  }

  async remove(_userId: string, _bookId: string) {
    throw new NotImplementedException('Feature 1 — remover livro.');
  }
}
