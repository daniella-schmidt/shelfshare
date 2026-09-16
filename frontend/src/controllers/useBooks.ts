// src/controllers/useBooks.ts (referência)
import { useEffect, useState } from 'react';
import { listBooks } from '../api/books';
import type { Book } from '../types';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listBooks()
      .then(setBooks)
      .catch((e) => setError(e?.message ?? 'Erro ao carregar livros'))
      .finally(() => setLoading(false));
  }, []);

  return { books, loading, error };
}