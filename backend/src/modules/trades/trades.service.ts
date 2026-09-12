import { Injectable, NotImplementedException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateTradeDto } from './dto/create-trade.dto';

/**
 * Fluxo de trocas — o coracao do sistema.
 *
 * ESQUELETO — a implementacao entra nas Features 3 e 4 do roadmap.
 *
 * Regras a garantir:
 *  - ninguem propoe troca consigo mesmo;
 *  - so da' para oferecer livro proprio e DISPONIVEL;
 *  - so da' para pedir livro DISPONIVEL de outra pessoa;
 *  - so o dono do livro pedido aceita ou recusa; so o proponente cancela;
 *  - aceitar reserva os dois livros e recusa as demais propostas pendentes
 *    que disputavam qualquer um deles — TUDO DENTRO DE UMA TRANSACAO
 *    (this.prisma.$transaction), senao um erro no meio deixa livros
 *    reservados numa troca que nunca foi aceita;
 *  - a troca so vira CONCLUIDA quando as duas partes confirmarem; ai' os
 *    dois livros passam para TROCADO.
 */
@Injectable()
export class TradesService {
  constructor(private readonly prisma: PrismaService) {}

  async propose(_userId: string, _dto: CreateTradeDto) {
    throw new NotImplementedException('Feature 3 — propor troca.');
  }

  async findReceived(_userId: string) {
    throw new NotImplementedException('Feature 3 — propostas recebidas.');
  }

  async findSent(_userId: string) {
    throw new NotImplementedException('Feature 3 — propostas enviadas.');
  }

  async accept(_userId: string, _tradeId: string) {
    throw new NotImplementedException('Feature 3 — aceitar proposta.');
  }

  async reject(_userId: string, _tradeId: string) {
    throw new NotImplementedException('Feature 3 — recusar proposta.');
  }

  async cancel(_userId: string, _tradeId: string) {
    throw new NotImplementedException('Feature 3 — cancelar proposta.');
  }

  async confirm(_userId: string, _tradeId: string) {
    throw new NotImplementedException('Feature 4 — confirmar conclusao.');
  }
}
