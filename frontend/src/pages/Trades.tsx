import { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { tradesApi, type Trade } from '../api/trades';
import { useChat } from '../contexts/ChatContext';

type TabKey = 'received' | 'sent';

const STATUS_LABELS: Record<string, string> = {
  PENDENTE: 'Pendente',
  ACEITA: 'Aceita',
  RECUSADA: 'Recusada',
  CANCELADA: 'Cancelada',
  CONCLUIDA: 'Concluída',
};

function statusBadge(status: string) {
  const label = STATUS_LABELS[status] ?? status;
  if (status === 'PENDENTE')  return <span className="badge badge-accent">{label}</span>;
  if (status === 'ACEITA')    return <span className="badge badge-primary">{label}</span>;
  if (status === 'CONCLUIDA') return <span className="badge badge-success">{label}</span>;
  if (status === 'RECUSADA' || status === 'CANCELADA')
    return <span className="badge badge-error">{label}</span>;
  return <span className="badge badge-neutral">{label}</span>;
}

export default function Trades() {
  const [received, setReceived] = useState<Trade[]>([]);
  const [sent, setSent] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>('received');
  const [actingId, setActingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<
    { id: string; text: string; kind: 'ok' | 'err' } | null
  >(null);

  const { openChat, closeChat, refresh: refreshSummary } = useChat();

  async function reload() {
    const [r, s] = await Promise.all([tradesApi.received(), tradesApi.sent()]);
    setReceived(r);
    setSent(s);
  }

  useEffect(() => {
    reload()
      .catch((err) => console.error('Erro ao carregar trocas:', err))
      .finally(() => setLoading(false));
  }, []);

  async function act(
    id: string,
    fn: () => Promise<Trade>,
    okMessage: string,
    opts?: { closeChat?: boolean },
  ) {
    setActingId(id);
    setFeedback(null);
    try {
      await fn();
      await reload();
      await refreshSummary();
      if (opts?.closeChat) closeChat();
      setFeedback({ id, text: okMessage, kind: 'ok' });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        'Não foi possível concluir a ação.';
      setFeedback({
        id,
        text: Array.isArray(msg) ? msg.join(', ') : msg,
        kind: 'err',
      });
    } finally {
      setActingId(null);
    }
  }

  const filteredReceived = received.filter((t) => t.status !== 'CONCLUIDA');
  const filteredSent     = sent.filter((t) => t.status !== 'CONCLUIDA');
  const list = tab === 'received' ? filteredReceived : filteredSent;

  return (
    <>
      <Header />
      <main className="container" style={{ padding: 'var(--space-12) var(--space-6)' }}>
        <div className="page-header">
          <h1>Trocas</h1>
          <p>Acompanhe as propostas que você enviou e recebeu.</p>
        </div>

        <div className="tabs" role="tablist" aria-label="Filtrar trocas">
          <button
            type="button"
            role="tab"
            id="tab-received"
            aria-selected={tab === 'received'}
            aria-controls="tabpanel-trades"
            className={`tab ${tab === 'received' ? 'is-active' : ''}`}
            onClick={() => { setTab('received'); setFeedback(null); }}
          >
            Recebidas
            <span className="tab__count" aria-hidden="true">{filteredReceived.length}</span>
            <span className="sr-only">{filteredReceived.length} propostas recebidas</span>
          </button>
          <button
            type="button"
            role="tab"
            id="tab-sent"
            aria-selected={tab === 'sent'}
            aria-controls="tabpanel-trades"
            className={`tab ${tab === 'sent' ? 'is-active' : ''}`}
            onClick={() => { setTab('sent'); setFeedback(null); }}
          >
            Enviadas
            <span className="tab__count" aria-hidden="true">{filteredSent.length}</span>
            <span className="sr-only">{filteredSent.length} propostas enviadas</span>
          </button>
        </div>

        {loading ? (
          <div className="loading-screen">
            <div className="spinner spinner-lg" />
            <p>Carregando trocas…</p>
          </div>
        ) : list.length === 0 ? (
          <div className="empty-inline">
            {tab === 'received'
              ? 'Você ainda não recebeu nenhuma proposta. Quando alguém quiser um dos seus livros, aparece aqui.'
              : 'Você ainda não enviou nenhuma proposta. Explore o catálogo para começar.'}
          </div>
        ) : (
          <div>
            {list.map((t) => {
              const otherParty = tab === 'received' ? t.proposer : t.receiver;
              const myConfirmed    = tab === 'received' ? t.receiverConfirmed : t.proposerConfirmed;
              const otherConfirmed = tab === 'received' ? t.proposerConfirmed : t.receiverConfirmed;
              const showContact = t.status === 'ACEITA';
              const isActing = actingId === t.id;
              const fb = feedback && feedback.id === t.id ? feedback : null;

              return (
                <article key={t.id} className="trade-card">
                  <header className="trade-card__head">
                    {statusBadge(t.status)}
                    <span className="trade-card__date">
                      {new Date(t.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </header>

                  <div className="trade-card__pair">
                    <div className="trade-card__book">
                      <div className="trade-card__book-label">Oferecido</div>
                      <div className="trade-card__book-title">
                        {t.offeredBook.title}
                      </div>
                    </div>

                    <div className="trade-card__arrow" aria-hidden>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>

                    <div className="trade-card__book">
                      <div className="trade-card__book-label">Pedido</div>
                      <div className="trade-card__book-title">
                        {t.requestedBook.title}
                      </div>
                    </div>
                  </div>

                  <div className="trade-card__meta">
                    <span>
                      <strong>{tab === 'received' ? 'De' : 'Para'}:</strong>{' '}
                      {otherParty.name}
                    </span>
                    <span>
                      <strong>Local:</strong> {otherParty.city} — {otherParty.state}
                    </span>
                  </div>

                  {t.message && (
                    <blockquote className="trade-card__quote">
                      “{t.message}”
                    </blockquote>
                  )}

                  {showContact && (
                    <div className="contact-reveal">
                      <strong>Contato liberado</strong>
                      <dl className="contact-reveal__grid">
                        <div>
                          <dt>Nome</dt>
                          <dd>{otherParty.name}</dd>
                        </div>
                        <div>
                          <dt>E-mail</dt>
                          <dd>
                            <a href={`mailto:${otherParty.email}`}>
                              {otherParty.email}
                            </a>
                          </dd>
                        </div>
                        {otherParty.phone && (
                          <div>
                            <dt>Telefone</dt>
                            <dd>
                              <a href={`tel:${otherParty.phone}`}>
                                {otherParty.phone}
                              </a>
                            </dd>
                          </div>
                        )}
                        <div>
                          <dt>Local</dt>
                          <dd>
                            {otherParty.city} — {otherParty.state}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  )}

                  {fb && (
                    <div
                      className={`notice notice--${fb.kind === 'ok' ? 'success' : 'error'}`}
                    >
                      {fb.text}
                    </div>
                  )}

                  {(tab === 'received' && t.status === 'PENDENTE') ||
                  (tab === 'sent' && t.status === 'PENDENTE') ||
                  t.status === 'ACEITA' ? (
                    <div className="trade-card__actions">

                      {/* Proposta recebida + pendente: aceitar / recusar / conversar */}
                      {tab === 'received' && t.status === 'PENDENTE' && (
                        <>
                          <button
                            type="button"
                            className="btn btn-primary"
                            disabled={isActing}
                            onClick={() =>
                              act(
                                t.id,
                                () => tradesApi.accept(t.id),
                                'Proposta aceita. Combine os detalhes pela conversa.',
                              )
                            }
                          >
                            {isActing ? <><span className="spinner" /> Aceitando…</> : 'Aceitar'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            disabled={isActing}
                            onClick={() =>
                              act(
                                t.id,
                                () => tradesApi.reject(t.id),
                                'Proposta recusada.',
                                { closeChat: true },
                              )
                            }
                          >
                            Recusar
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => openChat(t.id)}
                            aria-label={`Conversar com ${otherParty.name}`}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2"
                              strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            Conversar
                          </button>
                        </>
                      )}

                      {/* Proposta enviada + pendente: cancelar / conversar */}
                      {tab === 'sent' && t.status === 'PENDENTE' && (
                        <>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            disabled={isActing}
                            onClick={() =>
                              act(
                                t.id,
                                () => tradesApi.cancel(t.id),
                                'Proposta cancelada.',
                                { closeChat: true },
                              )
                            }
                          >
                            {isActing ? <><span className="spinner" /> Cancelando…</> : 'Cancelar proposta'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => openChat(t.id)}
                            aria-label={`Conversar com ${otherParty.name}`}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2"
                              strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            Conversar
                          </button>
                        </>
                      )}

                      {/* Troca aceita: confirmar / aguardar / conversar */}
                      {t.status === 'ACEITA' && (
                        <>
                          {!myConfirmed && (
                            <button
                              type="button"
                              className="btn btn-primary"
                              disabled={isActing}
                              onClick={() =>
                                act(
                                  t.id,
                                  () => tradesApi.confirm(t.id),
                                  'Confirmação registrada. Aguardando a outra parte.',
                                )
                              }
                            >
                              {isActing
                                ? <><span className="spinner" /> Confirmando…</>
                                : 'Confirmar que a troca ocorreu'}
                            </button>
                          )}

                          {myConfirmed && !otherConfirmed && (
                            <div className="trade-waiting">
                              <span className="trade-waiting__dot" aria-hidden />
                              Você já confirmou. Aguardando <strong>{otherParty.name}</strong>{' '}
                              confirmar que a troca ocorreu.
                            </div>
                          )}

                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => openChat(t.id)}
                            aria-label={`Conversar com ${otherParty.name}`}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2"
                              strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            Conversar
                          </button>

                          <span
                            className="text-muted"
                            style={{ alignSelf: 'center', fontSize: 'var(--text-sm)' }}
                          >
                            Confirmações: {t.proposerConfirmed ? '✓' : '·'} /{' '}
                            {t.receiverConfirmed ? '✓' : '·'}
                          </span>
                        </>
                      )}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}