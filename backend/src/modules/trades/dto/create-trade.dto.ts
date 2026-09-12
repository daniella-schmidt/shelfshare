import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateTradeDto {
  /** Livro do proponente que sera' oferecido. */
  @IsUUID('4', { message: 'offeredBookId precisa ser um UUID valido.' })
  offeredBookId!: string;

  /** Livro do outro usuario que esta' sendo solicitado. */
  @IsUUID('4', { message: 'requestedBookId precisa ser um UUID valido.' })
  requestedBookId!: string;

  /** Recado opcional enviado junto da proposta. */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}
