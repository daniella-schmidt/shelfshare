// src/components/books/BookCard.tsx
import { Link } from 'react-router-dom';
import type { Book } from '../../api/books';

const CONDITION_LABELS: Record<string, string> = {
  NOVO: 'Novo',
  OTIMO: 'Ótimo',
  BOM: 'Bom',
  REGULAR: 'Regular',
  RUIM: 'Ruim',
};

const COVER_VARIANTS = ['', 'accent', 'spruce', 'rose', 'peony', 'success'] as const;

function pickVariant(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return COVER_VARIANTS[h % COVER_VARIANTS.length];
}

export default function BookCard({ book }: { book: Book }) {
  const variant = pickVariant(book.id);
  const variantClass = variant ? ` book-cover-fallback--${variant}` : '';

  return (
    <Link to={`/livros/${book.id}`} className="book-card">
      <div className="book-card__cover">
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} />
        ) : (
          <div className={`book-cover-fallback${variantClass}`}>
            <div className="book-cover-fallback__top">
              <span className="book-cover-fallback__label">ShelfShare</span>
              <span className="book-cover-fallback__mark" aria-hidden>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </span>
            </div>
            <div className="book-cover-fallback__title">{book.title}</div>
            <div className="book-cover-fallback__author">{book.author}</div>
          </div>
        )}
        <span className="badge badge-accent book-card__badge">
          {CONDITION_LABELS[book.condition] ?? book.condition}
        </span>
      </div>
      <div className="book-card__body">
        <h3 className="book-card__title">{book.title}</h3>
        <p className="book-card__author">{book.author}</p>
        <div className="book-card__footer">
          <span className="book-card__meta">{book.owner?.city ?? '—'}</span>
          <span className="badge badge-success">Disponível</span>
        </div>
      </div>
    </Link>
  );
}