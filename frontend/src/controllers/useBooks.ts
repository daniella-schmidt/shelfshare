import { useState, useEffect } from 'react';
import { getBooks, getBook, createBook, updateBook, deleteBook } from '../api/books';
import { Book } from '../types';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (bookData: Omit<Book, 'id' | 'owner'>) => {
    const newBook = await createBook(bookData);
    setBooks(prev => [...prev, newBook]);
  };

  // ... outros métodos

  useEffect(() => {
    fetchBooks();
  }, []);

  return { books, loading, error, fetchBooks, addBook };
}