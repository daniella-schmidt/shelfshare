// src/api/books.ts
import { api } from './axios';
import type {
  Book,
  CatalogBook,
  CreateBookInput,
  UpdateBookInput,
} from '../types';

export type { Book, CatalogBook, CreateBookInput, UpdateBookInput };

export const catalogApi = {
  list: (params?: { q?: string; genre?: string; page?: number }) =>
    api.get<CatalogBook[]>('/catalog', { params }).then((r) => r.data),
  findOne: (id: string) =>
    api.get<CatalogBook>(`/catalog/${id}`).then((r) => r.data),
};

export const booksApi = {
  // ✅ era '/books/mine' → agora '/books/me' (bate com o backend)
  mine: () => api.get<Book[]>('/books/me').then((r) => r.data),

  create: (data: CreateBookInput) =>
    api.post<Book>('/books', data).then((r) => r.data),
  update: (id: string, data: UpdateBookInput) =>
    api.patch<Book>(`/books/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/books/${id}`),
  findOne: (id: string) =>
    api.get<Book>(`/books/${id}`).then((r) => r.data),
};

export const listBooks = (params?: { q?: string; genre?: string; page?: number }) =>
  catalogApi.list(params);
export const getBook = (id: string) => catalogApi.findOne(id);
export const listMyBooks = () => booksApi.mine();
export const createBook = (data: CreateBookInput) => booksApi.create(data);
export const updateBook = (id: string, data: UpdateBookInput) =>
  booksApi.update(id, data);
export const deleteBook = (id: string) => booksApi.remove(id);