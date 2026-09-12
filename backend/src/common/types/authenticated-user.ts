/** Formato do usuario anexado a requisicao apos o JwtAuthGuard passar. */
export interface AuthenticatedUser {
  id: string;
  email: string;
}
