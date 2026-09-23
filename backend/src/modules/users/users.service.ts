import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

/** Campos do perfil que podem sair na resposta. Nunca inclua passwordHash. */
const PROFILE_FIELDS = {
  id: true,
  name: true,
  email: true,
  phone: true,
  city: true,
  state: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Atualiza o perfil do proprio usuario logado.
   *
   * O id vem sempre do token, nunca do corpo da requisicao — ninguem edita
   * o perfil de outra pessoa.
   */
  async updateMe(userId: string, dto: UpdateUserDto) {
    const exists = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name.trim(),
        city: dto.city.trim(),
        state: dto.state.toUpperCase(),
        // PUT substitui: telefone omitido significa telefone apagado.
        phone: dto.phone?.trim() || null,
      },
      select: PROFILE_FIELDS,
    });
  }
}
