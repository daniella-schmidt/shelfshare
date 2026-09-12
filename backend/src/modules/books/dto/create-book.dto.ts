import { BookCondition } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  @MinLength(1)
  author!: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsEnum(BookCondition, {
    message: 'Condicao invalida. Use NOVO, OTIMO, BOM ou DESGASTADO.',
  })
  condition!: BookCondition;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: 'A capa precisa ser uma URL valida.' })
  coverUrl?: string;
}
