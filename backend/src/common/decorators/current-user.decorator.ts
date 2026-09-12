import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import type { AuthenticatedUser } from '../types/authenticated-user';

/**
 * Injeta o usuario autenticado direto no metodo do controller:
 *
 *   @Get('me')
 *   me(@CurrentUser() user: AuthenticatedUser) { ... }
 *
 * O objeto vem do retorno de JwtStrategy.validate().
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthenticatedUser }>();
    return request.user;
  },
);
