import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { booksApi, type Book, type CreateBookInput } from '../api/books';
import BookSearchInput from '../components/books/BookSearchInput';
import type { ExternalBook } from '../api/bookSearch';

const CONDITION_LABELS: Record<string, string> = {
  NOVO: 'Novo',
  OTIMO: 'Ótimo',
  BOM: 'Bom',
  REGULAR: 'Regular',
  RUIM: 'Ruim',
};

const EMPTY: CreateBookInput = {
  title: '',
  author: '',
  condition: 'BOM',
  isbn: '',
  description: '',
  coverUrl: '',
};

export default function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<CreateBookInput>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function reload() {
    const list = await booksApi.mine();
    setBooks(list);
  }

  useEffect(() => {
    reload().finally(() => setLoading(false));
  }, []);

  const set =
    <K extends keyof CreateBookInput>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value as any }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (editing) await booksApi.update(editing, form);
      else await booksApi.create(form);
      setForm(EMPTY);
      setEditing(null);
      await reload();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Erro ao salvar.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function onRemove(id: string) {
    if (!confirm('Remover este livro?')) return;
    try {
      await booksApi.remove(id);
      await reload();
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Erro ao remover.');
    }
  }

  function startEdit(b: Book) {
    setEditing(b.id);
    setForm({
      title: b.title,
      author: b.author,
      condition: b.condition,
      isbn: b.isbn ?? '',
      description: b.description ?? '',
      coverUrl: b.coverUrl ?? '',
    });
  }

  function cancelEdit() {
    setEditing(null);
    setForm(EMPTY);
  }

  function handleExternalSelect(ext: ExternalBook) {
    setForm({
      title: ext.title,
      author: ext.authors.join(', '),
      condition: form.condition ?? 'BOM', // mantém a condição escolhida
      isbn: ext.isbn13 ?? ext.isbn10 ?? '',
      description: ext.description ?? '',
      coverUrl: ext.coverUrl ?? '',
    });
  }

  const available = books.filter((b) => b.status === 'DISPONIVEL').length;
  const inTrade = books.filter((b) => b.status === 'RESERVADO').length;

  return (
    <>
      <Header />
      <main className="container" style={{ padding: 'var(--space-12) var(--space-6)' }}>
        <div className="page-header">
          <h1>Minha Estante</h1>
          <p>Cadastre, edite e gerencie os livros que você quer trocar.</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card__label">Total de livros</div>
            <div className="stat-card__value">{books.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">Disponíveis</div>
            <div className="stat-card__value">{available}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__label">Em troca</div>
            <div className="stat-card__value">{inTrade}</div>
          </div>
        </div>

        {/* Layout */}
        <div className="split-layout">
          {/* Formulário */}
          <div className="panel">
            <div className="panel__head">
              <h2 className="panel__title">
                {editing ? 'Editar livro' : 'Novo livro'}
              </h2>
            </div>

            <form onSubmit={onSubmit} className="form-stack">
              {error && <div className="notice notice--error">{error}</div>}

              <div className="field">
                <label>Buscar livro automaticamente</label>
                <BookSearchInput
                  onSelect={handleExternalSelect}
                  placeholder="Ex.: O Hobbit, Tolkien, 978-8533613379…"
                />
                <span className="field-hint">
                  Busque e selecione para preencher os campos abaixo automaticamente.
                </span>
              </div>

              <div className="field">
                <label htmlFor="title">Título *</label>
                <input
                  id="title"
                  className="input"
                  required
                  value={form.title}
                  onChange={set('title')}
                  placeholder="Ex.: O Hobbit"
                />
              </div>

              <div className="field">
                <label htmlFor="author">Autor *</label>
                <input
                  id="author"
                  className="input"
                  required
                  value={form.author}
                  onChange={set('author')}
                  placeholder="Ex.: J.R.R. Tolkien"
                />
              </div>

              <div className="field">
                <label htmlFor="condition">Condição</label>
                <select
                  id="condition"
                  className="select"
                  value={form.condition}
                  onChange={set('condition')}
                >
                  <option value="NOVO">Novo</option>
                  <option value="OTIMO">Ótimo</option>
                  <option value="BOM">Bom</option>
                  <option value="REGULAR">Regular</option>
                  <option value="RUIM">Ruim</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="isbn">ISBN (opcional)</label>
                <input
                  id="isbn"
                  className="input"
                  value={form.isbn}
                  onChange={set('isbn')}
                  placeholder="978-..."
                />
              </div>

              <div className="field">
                <label htmlFor="coverUrl">URL da capa (opcional)</label>
                <input
                  id="coverUrl"
                  className="input"
                  value={form.coverUrl}
                  onChange={set('coverUrl')}
                  placeholder="https://..."
                />
              </div>

              <div className="field">
                <label htmlFor="description">Descrição (opcional)</label>
                <textarea
                  id="description"
                  className="textarea"
                  rows={3}
                  value={form.description}
                  onChange={set('description')}
                  placeholder="Conte um pouco sobre a edição, estado, etc."
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner" /> Salvando…
                    </>
                  ) : editing ? (
                    'Salvar alterações'
                  ) : (
                    'Adicionar livro'
                  )}
                </button>
                {editing && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={cancelEdit}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Lista */}
          <div className="panel">
            <div className="panel__head">
              <h2 className="panel__title">Meus livros</h2>
              <span className="panel__count">{books.length}</span>
            </div>

            {loading ? (
              <div className="loading-screen" style={{ minHeight: 200 }}>
                <div className="spinner spinner-lg" />
                <p>Carregando…</p>
              </div>
            ) : books.length === 0 ? (
              <div className="empty-inline">
                Você ainda não cadastrou nenhum livro. Use o formulário ao lado
                para começar. 📚
              </div>
            ) : (
              <div>
                {books.map((b) => (
                  <div key={b.id} className="owned-book">
                    <div className="owned-book__cover">
                      {b.coverUrl ? (
                        <img src={b.coverUrl} alt={b.title} />
                      ) : (
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                      )}
                    </div>

                    <div className="owned-book__info">
                      <h4>{b.title}</h4>
                      <p>
                        {b.author} · {CONDITION_LABELS[b.condition] ?? b.condition}
                      </p>
                      <div className="owned-book__meta">
                        {b.status === 'DISPONIVEL' && (
                          <span className="badge badge-success">Disponível</span>
                        )}
                        {b.status === 'RESERVADO' && (
                          <span className="badge badge-accent">Em troca</span>
                        )}
                        {b.status === 'TROCADO' && (
                          <span className="badge badge-neutral">Trocado</span>
                        )}
                        {b.isbn && (
                          <span className="badge badge-neutral">ISBN {b.isbn}</span>
                        )}
                      </div>
                    </div>

                    <div className="owned-book__actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => startEdit(b)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => onRemove(b.id)}
                        style={{ color: 'var(--color-error)' }}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {books.length > 0 && (
              <div style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
                <Link to="/livros" className="btn btn-secondary btn-sm">
                  Ver catálogo público →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}