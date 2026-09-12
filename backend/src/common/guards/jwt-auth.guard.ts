import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Protege uma rota exigindo um JWT valido no header:
 *   Authorization: Bearer <token>
 *
 * Uso: @UseGuards(JwtAuthGuard) no controller ou no metodo.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
