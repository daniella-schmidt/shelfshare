import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const SALT_ROUNDS = 10;

/** Campos do usuario que podem sair na resposta. Nunca inclua passwordHash. */
const PUBLIC_FIELDS = {
  id: true,
  name: true,
  email: true,
  city: true,
  state: true,
} as const;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const alreadyExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });

    if (alreadyExists) {
      throw new ConflictException('Ja existe uma conta com este e-mail.');
    }

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash: await bcrypt.hash(dto.password, SALT_ROUNDS),
        city: dto.city,
        state: dto.state.toUpperCase(),
        phone: dto.phone,
      },
      select: PUBLIC_FIELDS,
    });

    return { access_token: this.signToken(user.id, user.email), user };
  }

  async login(dto: LoginDto) {
    const found = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { ...PUBLIC_FIELDS, passwordHash: true },
    });

    // Mensagem generica de proposito: nao revela se o e-mail existe.
    const invalid = new UnauthorizedException('E-mail ou senha incorretos.');
    if (!found) {
      throw invalid;
    }

    const passwordMatches = await bcrypt.compare(dto.password, found.passwordHash);
    if (!passwordMatches) {
      throw invalid;
    }

    const { passwordHash, ...user } = found;
    return { access_token: this.signToken(user.id, user.email), user };
  }

  private signToken(sub: string, email: string): string {
    return this.jwt.sign({ sub, email });
  }
}
