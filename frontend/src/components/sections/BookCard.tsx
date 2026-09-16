import { Link } from 'react-router-dom';
import type { Book } from '../../api/books';

const CONDITIONS: Record<string, string> = {
  NOVO: 'Novo',
  OTIMO: 'Ótimo',
  BOM: 'Bom',
  REGULAR: 'Regular',
  RUIM: 'Ruim',
};

/* Cores sólidas derivadas da paleta da marca para fallback de capa */
const COVER_COLORS = ['#3a0842', '#391463', '#2d936c', '#5fad41', '#cfa72f'];

function pickColor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return COVER_COLORS[h % COVER_COLORS.length];
}

export default function BookCard({ book }: { book: Book }) {
  const bg = pickColor(book.id);
  const cond = CONDITIONS[book.condition] ?? book.condition;

  return (
    <Link to={`/livros/${book.id}`} className="book-card">
      <div className="book-card__cover" style={{ background: book.coverUrl ? undefined : bg }}>
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} />
        ) : (
          <div style={{ padding: '1.5rem', width: '100%' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 600,
              color: '#fdf7e6',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}>
              {book.title}
            </div>
            <div style={{
              marginTop: 'auto',
              fontSize: '0.75rem',
              color: 'rgba(253,247,230,0.7)',
              fontWeight: 500,
            }}>
              {book.author}
            </div>
          </div>
        )}
        <span className="badge badge-accent book-card__badge">{cond}</span>
      </div>

      <div className="book-card__body">
        <h3 className="book-card__title">{book.title}</h3>
        <p className="book-card__author">{book.author}</p>
        <div className="book-card__footer">
          <span className="book-card__meta">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {book.owner?.city ?? '—'}
          </span>
          <span className="badge badge-success">Disponível</span>
        </div>
      </div>
    </Link>
  );
}