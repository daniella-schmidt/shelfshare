import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMessageDto {
  /** Conteúdo da mensagem enviada no chat da troca. */
  @IsString({ message: 'content precisa ser um texto.' })
  @MinLength(1, { message: 'A mensagem não pode estar vazia.' })
  @MaxLength(2000, { message: 'A mensagem pode ter no máximo 2000 caracteres.' })
  content!: string;
}