import { IsEmail, IsOptional, IsString, Length, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: 'O nome precisa ter ao menos 3 caracteres.' })
  name!: string;

  @IsEmail({}, { message: 'Informe um e-mail valido.' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'A senha precisa ter ao menos 8 caracteres.' })
  password!: string;

  @IsString()
  @MinLength(2)
  city!: string;

  @IsString()
  @Length(2, 2, { message: 'Use a sigla do estado, com 2 letras.' })
  state!: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
