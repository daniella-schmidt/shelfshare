import { useEffect, useRef, useState, useId, type KeyboardEvent } from 'react';
import {
  searchBooks,
  enrichWithBrasilApi,
  type ExternalBook,
} from '../../api/bookSearch';

interface Props {
  onSelect: (book: ExternalBook) => void;
  placeholder?: string;
}

const MIN_CHARS = 3;

export default function BookSearchInput({ onSelect, placeholder }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ExternalBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reqIdRef = useRef(0);
  const listboxId = useId();

  useEffect(() => {
    const q = query.trim();

    if (q.length < MIN_CHARS) {
      setResults([]);
      setOpen(false);
      setError(null);
      setActiveIndex(-1);
      return;
    }

    const reqId = ++reqIdRef.current;
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const found = await searchBooks(q);
        if (reqId !== reqIdRef.current) return;
        setResults(found);
        setOpen(true);
        setActiveIndex(found.length > 0 ? 0 : -1);
        if (found.length === 0) {
          setError('Nenhum livro encontrado. Tente outro termo.');
        }
      } catch (err: any) {
        if (reqId !== reqIdRef.current) return;
        if (err?.message === 'RATE_LIMIT') {
          setRateLimited(true);
          setError(
            'Limite de buscas atingido. Tente novamente em alguns minutos ou preencha manualmente.',
          );
        } else {
          setError('Não foi possível buscar livros agora.');
        }
        setResults([]);
        setOpen(false);
      } finally {
        if (reqId === reqIdRef.current) setLoading(false);
      }
    }, 600);

    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleSelect(book: ExternalBook) {
    setOpen(false);
    setQuery('');
    setResults([]);
    setError(null);
    setActiveIndex(-1);

    if (book.isbn13 || book.isbn10) {
      setEnriching(true);
      try {
        const enriched = await enrichWithBrasilApi(book);
        onSelect(enriched);
      } catch {
        onSelect(book);
      } finally {
        setEnriching(false);
      }
    } else {
      onSelect(book);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (!open || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(results.length - 1);
    }
  }

  const showHint = query.trim().length > 0 && query.trim().length < MIN_CHARS;

  return (
    <div ref={wrapRef} className="book-search">
      <div className="book-search__field">
        <svg
          className="book-search__icon"
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>

        <input
          className="input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder ?? 'Buscar por título, autor ou ISBN…'}
          aria-label="Buscar livro por título, autor ou ISBN"
          aria-autocomplete="list"
          aria-controls={open ? listboxId : undefined}
          aria-expanded={open}
          aria-activedescendant={
            open && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          autoComplete="off"
          disabled={rateLimited || enriching}
          role="combobox"
        />

        {(loading || enriching) && (
          <span className="spinner book-search__loading" aria-hidden="true" />
        )}
      </div>

      {enriching && (
        <p className="field-hint" style={{ marginTop: 'var(--space-1)' }} role="status">
          Buscando metadados em português…
        </p>
      )}

      {showHint && (
        <p className="field-hint" style={{ marginTop: 'var(--space-1)' }}>
          Digite ao menos {MIN_CHARS} caracteres para buscar.
        </p>
      )}

      {error && !open && (
        <p className="field-error" style={{ marginTop: 'var(--space-1)' }} role="status">
          {error}
        </p>
      )}

      {open && results.length > 0 && (
        <div className="book-search__dropdown" role="listbox" id={listboxId}>
          {results.map((b, idx) => (
            <button
              key={`${b.source}-${b.externalId}`}
              type="button"
              id={`${listboxId}-option-${idx}`}
              className={`book-search__item ${idx === activeIndex ? 'is-active' : ''}`}
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => handleSelect(b)}
              role="option"
              aria-selected={idx === activeIndex}
            >
              <div
                className="book-search__cover"
                style={{ backgroundImage: b.coverUrl ? `url(${b.coverUrl})` : undefined }}
                aria-hidden="true"
              >
                {!b.coverUrl && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                )}
              </div>

              <div className="book-search__info">
                <div className="book-search__title">{b.title}</div>
                <div className="book-search__meta">
                  {b.authors.join(', ') || 'Autor desconhecido'}
                  {b.publishedYear && ` · ${b.publishedYear}`}
                  {b.publisher && ` · ${b.publisher}`}
                </div>
              </div>

              <svg className="book-search__arrow" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}