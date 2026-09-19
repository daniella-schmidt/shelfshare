import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  catalogApi,
  booksApi,
  type CatalogBook,
  type Book,
} from '../api/books';
import { tradesApi } from '../api/trades';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const CONDITION_LABELS: Record<string, string> = {
  NOVO: 'Novo',
  OTIMO: 'Ótimo',
  BOM: 'Bom',
  REGULAR: 'Regular',
  RUIM: 'Ruim',
};

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const nav = useNavigate();

  const [book, setBook] = useState<CatalogBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [offeredId, setOfferedId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    catalogApi
      .findOne(id)
      .then(setBook)
      .catch(() => setBook(null))
      .finally(() => setLoading(false));

    if (user) {
      booksApi
        .mine()
        .then((bs) => setMyBooks(bs.filter((b) => b.status === 'DISPONIVEL')))
        .catch(() => setMyBooks([]));
    }
  }, [id, user]);

  async function propose(e: FormEvent) {
    e.preventDefault();
    if (!book || !offeredId) return;
    setError(null);
    setSubmitting(true);
    try {
      await tradesApi.propose(offeredId, book.id, message || undefined);
      setOk(true);
      setTimeout(() => nav('/trocas'), 1200);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? 'Não foi possível propor a troca.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ---------- Estados de carregamento / não encontrado ----------
  if (loading) {
    return (
      <>
        <Header />
        <main className="container" style={{ padding: 'var(--space-16) var(--space-6)' }}>
          <div className="loading-screen">
            <div className="spinner spinner-lg" />
            <p>Carregando livro…</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!book) {
    return (
      <>
        <Header />
        <main className="container" style={{ padding: 'var(--space-16) var(--space-6)' }}>
          <div className="error-state">
            <h3>Livro não encontrado</h3>
            <p>Este livro pode ter sido removido ou já foi trocado.</p>
            <Link to="/livros" className="btn btn-primary">
              Voltar para o catálogo
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const isMine = user?.id === book.ownerId;

  return (
    <>
      <Header />
      <main className="container" style={{ padding: 'var(--space-12) var(--space-6)' }}>
        <div className="book-detail">
          {/* Coluna esquerda: capa */}
          <div className="book-detail__cover">
            <div
              className="book-detail__cover-inner"
              style={
                book.coverUrl
                  ? { backgroundImage: `url(${book.coverUrl})` }
                  : undefined
              }
            >
              {!book.coverUrl && (
                <svg width="96" height="96" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.4"
                  strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              )}
            </div>
          </div>

          {/* Coluna direita: informações e ação */}
          <div className="book-detail__info">
            <div className="book-detail__meta">
              <span className="badge badge-primary">
                {CONDITION_LABELS[book.condition] ?? book.condition}
              </span>
              {book.status === 'DISPONIVEL' ? (
                <span className="badge badge-success">Disponível</span>
              ) : (
                <span className="badge badge-neutral">{book.status}</span>
              )}
            </div>

            <h1>{book.title}</h1>
            <p className="book-detail__author">por {book.author}</p>

            <dl className="book-detail__facts">
              <div>
                <dt>Localização</dt>
                <dd>
                  {book.owner.city} — {book.owner.state}
                </dd>
              </div>
              <div>
                <dt>Doador</dt>
                <dd>{book.owner.name}</dd>
              </div>
              {book.isbn && (
                <div>
                  <dt>ISBN</dt>
                  <dd>{book.isbn}</dd>
                </div>
              )}
            </dl>

            {book.description && (
              <div className="book-detail__description">
                <h3>Sobre este livro</h3>
                <p>{book.description}</p>
              </div>
            )}

            {/* Ações */}
            <div className="book-detail__actions">
              {isMine && (
                <div className="notice notice--info">
                  Este livro é seu. Você pode gerenciá-lo em{' '}
                  <Link to="/minha-estante">Minha Estante</Link>.
                </div>
              )}

              {!isMine && !user && (
                <>
                  <div className="notice notice--info">
                    Entre na sua conta para propor uma troca.
                  </div>
                  <Link to="/login" className="btn btn-primary btn-lg">
                    Entrar para propor troca
                  </Link>
                </>
              )}

              {!isMine && user && ok && (
                <div className="notice notice--success">
                  Proposta enviada! Redirecionando…
                </div>
              )}

              {!isMine && user && !ok && (
                <form onSubmit={propose} className="trade-form">
                  {error && <div className="notice notice--error">{error}</div>}

                  <div className="field">
                    <label htmlFor="offeredBook">
                      Ofereça um dos seus livros
                    </label>
                    {myBooks.length === 0 ? (
                      <div className="notice notice--info">
                        Você não tem livros disponíveis.{' '}
                        <Link to="/minha-estante">Cadastre um livro</Link> para
                        poder trocar.
                      </div>
                    ) : (
                      <select
                        id="offeredBook"
                        className="select"
                        value={offeredId}
                        onChange={(e) => setOfferedId(e.target.value)}
                        required
                      >
                        <option value="">— escolha um livro —</option>
                        {myBooks.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.title} ({CONDITION_LABELS[b.condition] ?? b.condition})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="message">Mensagem (opcional)</label>
                    <textarea
                      id="message"
                      className="textarea"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Conte por que quer trocar, combine o encontro…"
                    />
                  </div>

                  <button
                    className="btn btn-primary btn-lg btn-block"
                    type="submit"
                    disabled={!offeredId || submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner" /> Enviando…
                      </>
                    ) : (
                      'Propor troca'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}