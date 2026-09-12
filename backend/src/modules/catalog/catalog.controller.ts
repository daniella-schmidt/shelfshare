import { Controller, Get, Param, Query } from '@nestjs/common';

import { CatalogService } from './catalog.service';

/** Rotas publicas: nao levam JwtAuthGuard. */
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  /** GET /catalog?q=&city= -> livros disponiveis para troca */
  @Get()
  search(@Query('q') q?: string, @Query('city') city?: string) {
    return this.catalogService.search(q, city);
  }

  /** GET /catalog/:id -> detalhe de um livro disponivel */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogService.findOne(id);
  }
}
