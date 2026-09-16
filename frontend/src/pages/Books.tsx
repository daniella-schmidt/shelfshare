import { useMemo, useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import BookCard from '../components/books/BookCard';
import { useBooks } from '../controllers/useBooks';
import type { Book } from '../api/books';

export default function Books() {
  const { books, loading, error } = useBooks();
  const [query, setQuery] = useState('');

  const filtered: Book[] = useMemo(() => {
    const list = (books ?? []) as Book[];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((b) =>
      [b.title, b.author, b.isbn]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [books, query]);

  return (
    <>
      <Header />
      <main className="container" style={{ padding: 'var(--space-12) var(--space-6)' }}>
        <div className="page-header">
          <h1>Explorar livros</h1>
          <p>
            Encontre sua próxima leitura entre os livros disponíveis para troca
            na comunidade ShelfShare.
          </p>
        </div>

        <div className="toolbar">
          <div className="search-bar">
            <svg
              className="search-bar__icon"
              width="18" height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              className="input"
              type="search"
              placeholder="Buscar por título, autor ou ISBN..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar livros"
            />
          </div>

          <span className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
            {loading ? 'Carregando…' : `${filtered.length} livro(s)`}
          </span>
        </div>

        {loading && (
          <div className="loading-screen">
            <div className="spinner spinner-lg" />
            <p>Carregando livros…</p>
          </div>
        )}

        {!loading && error && (
          <div className="error-state">
            <h3>Não foi possível carregar os livros</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <h3>Nenhum livro encontrado</h3>
            <p>
              {query
                ? 'Tente ajustar os termos da busca.'
                : 'Ainda não há livros cadastrados por aqui.'}
            </p>
            {query && (
              <button
                className="btn btn-secondary"
                onClick={() => setQuery('')}
              >
                Limpar busca
              </button>
            )}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="books-grid">
            {filtered.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}