import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../../common/types/authenticated-user';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  /** GET /books/me -> livros da minha estante */
  @Get('me')
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.booksService.findMine(user.id);
  }

  /** POST /books -> cadastra um livro na minha estante */
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateBookDto) {
    return this.booksService.create(user.id, dto);
  }

  /** PATCH /books/:id -> edita um livro meu */
  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateBookDto,
  ) {
    return this.booksService.update(user.id, id, dto);
  }

  /** DELETE /books/:id -> remove um livro meu */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.booksService.remove(user.id, id);
  }
}
