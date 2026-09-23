import {
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * PUT substitui a representacao inteira dos campos editaveis do perfil.
 * Por isso `name`, `city` e `state` sao obrigatorios: o cliente envia o
 * perfil completo. O `phone` e opcional — omitir limpa o telefone.
 *
 * `email` e `password` ficam de fora de proposito. Trocar o e-mail mexe no
 * login e na restricao de unicidade; a senha tem fluxo proprio.
 */
export class UpdateUserDto {
  @IsString()
  @MinLength(3, { message: 'O nome precisa ter ao menos 3 caracteres.' })
  @MaxLength(120)
  name!: string;

  @IsString()
  @MinLength(2, { message: 'Informe a cidade.' })
  @MaxLength(120)
  city!: string;

  @IsString()
  @Length(2, 2, { message: 'Use a sigla do estado, com 2 letras.' })
  state!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
