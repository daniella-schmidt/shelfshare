import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

/**
 * Traduz os erros conhecidos do Prisma em respostas HTTP adequadas.
 *
 * Sem este filtro, qualquer violacao de constraint no banco vira
 * 500 Internal Server Error, sem mensagem util para o cliente. O caso
 * mais visivel e' a proposta de troca repetida, barrada pelo indice
 * `trades_proposta_pendente_unica`.
 */

/** Minimo que precisamos da resposta do Express, sem depender de @types/express. */
interface HttpResponse {
  status(code: number): HttpResponse;
  json(body: unknown): unknown;
}

/** Mensagem especifica por constraint, quando vale a pena explicar. */
const UNIQUE_MESSAGES: Record<string, string> = {
  users_email_key: 'Já existe uma conta com este e-mail.',
  trades_proposta_pendente_unica:
    'Você já enviou esta mesma proposta e ela continua pendente.',
};

const ERROR_NAMES: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'Bad Request',
  [HttpStatus.NOT_FOUND]: 'Not Found',
  [HttpStatus.CONFLICT]: 'Conflict',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter
  implements ExceptionFilter<Prisma.PrismaClientKnownRequestError>
{
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): void {
    const response = host.switchToHttp().getResponse<HttpResponse>();
    const { status, message } = this.translate(exception);

    // Codigo nao mapeado: registra o erro real para investigar depois.
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`Prisma ${exception.code}: ${exception.message}`);
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: ERROR_NAMES[status] ?? 'Error',
    });
  }

  private translate(exception: Prisma.PrismaClientKnownRequestError): {
    status: number;
    message: string;
  } {
    switch (exception.code) {
      // Violacao de restricao unica.
      case 'P2002':
        return {
          status: HttpStatus.CONFLICT,
          message: this.uniqueMessage(exception),
        };

      // Registro nao encontrado em update/delete.
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Registro não encontrado.',
        };

      // Violacao de chave estrangeira.
      case 'P2003':
        return {
          status: HttpStatus.CONFLICT,
          message:
            'Este registro está vinculado a outro e não pode ser alterado ou removido.',
        };

      // Valor maior que o permitido pela coluna.
      case 'P2000':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Algum campo excede o tamanho permitido.',
        };

      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Erro inesperado ao acessar o banco de dados.',
        };
    }
  }

  /** Usa o nome da constraint violada para dar uma mensagem especifica. */
  private uniqueMessage(
    exception: Prisma.PrismaClientKnownRequestError,
  ): string {
    const target = exception.meta?.target;
    const names: string[] = Array.isArray(target)
      ? target.map(String)
      : typeof target === 'string'
        ? [target]
        : [];

    const constraint = exception.meta?.constraint;
    if (typeof constraint === 'string') names.push(constraint);
    else if (Array.isArray(constraint)) names.push(...constraint.map(String));

    // Indices criados em SQL puro (como o parcial de propostas pendentes) nao
    // aparecem em `meta`, porque o Prisma nao os conhece. Nesses casos o nome
    // da constraint ainda vem no texto do erro.
    const haystack = [...names, exception.message].join(' ');
    for (const [name, message] of Object.entries(UNIQUE_MESSAGES)) {
      if (haystack.includes(name)) return message;
    }

    return names.length
      ? `Já existe um registro com estes dados (${names.join(', ')}).`
      : 'Já existe um registro com estes dados.';
  }
}
