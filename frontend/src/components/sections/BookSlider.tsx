import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { catalogApi, type CatalogBook } from '../../api/books';
import BookCard from '../books/BookCard';

const MAX_BOOKS = 10;

export default function BookSlider() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [books, setBooks] = useState<CatalogBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    catalogApi
      .list()
      .then((list) => { if (active) setBooks(list.slice(0, MAX_BOOKS)); })
      .catch(() => { if (active) setError('Não foi possível carregar os livros agora.'); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, []);

  function scrollBy(dir: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div className="section-head__left">
            <span className="section-eyebrow">Em destaque</span>
            <h2>Livros circulando agora</h2>
            <p className="section-head__lead">
              Descubra o que outros leitores estão trocando nesta semana.
            </p>
          </div>
          <div className="section-head__actions">
            <button className="arrow-btn" onClick={() => scrollBy(-1)} aria-label="Anterior">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button className="arrow-btn" onClick={() => scrollBy(1)} aria-label="Próximo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {loading && (
          <div className="h-scroll" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="book-card book-card--skeleton">
                <div className="book-card__cover skeleton" />
                <div className="book-card__body">
                  <div className="skeleton" style={{ height: 16, width: '80%' }} />
                  <div className="skeleton" style={{ height: 12, width: '60%' }} />
                  <div className="skeleton" style={{ height: 12, width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && <div className="empty-inline">{error}</div>}

        {!loading && !error && books.length === 0 && (
          <div className="empty-inline">
            Ainda não há livros disponíveis. Seja o primeiro a compartilhar um!{' '}
            <Link to="/minha-estante">Cadastrar um livro</Link>
          </div>
        )}

        {!loading && !error && books.length > 0 && (
          <div className="h-scroll" ref={scrollerRef}>
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}