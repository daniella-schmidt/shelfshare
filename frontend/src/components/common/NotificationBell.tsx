import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useChat } from '../../contexts/ChatContext';

export default function NotificationBell() {
  const { summary, openChat } = useChat();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const total =
    (summary?.pendingTradesCount ?? 0) + (summary?.unreadMessagesTotal ?? 0);
  const hasPending = (summary?.pendingTradesCount ?? 0) > 0;
  const unreadChats = (summary?.activeChats ?? []).filter((c) => c.unreadCount > 0);
  const hasMessages = unreadChats.length > 0;

  return (
    <div className="notif" ref={ref}>
      <button
        type="button"
        className="notif__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notificações${total > 0 ? ` (${total})` : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {total > 0 && (
          <span className="notif__badge">{total > 99 ? '99+' : total}</span>
        )}
      </button>

      {open && (
        <div className="notif__panel" role="dialog" aria-label="Notificações">
          <header className="notif__head">
            <h3>Notificações</h3>
            {total > 0 && <span className="notif__count">{total}</span>}
          </header>

          {total === 0 ? (
            <p className="notif__empty">Nada por aqui. Você está em dia.</p>
          ) : (
            <div className="notif__list">
              {hasMessages && (
                <section className="notif__section">
                  <h4 className="notif__section-title">Mensagens</h4>
                  {unreadChats.map((item) => (
                    <button
                      key={item.tradeId}
                      type="button"
                      className="notif__item"
                      onClick={() => {
                        openChat(item.tradeId);
                        setOpen(false);
                      }}
                    >
                      <span className="notif__item-avatar" aria-hidden>
                        {item.otherPartyName.charAt(0).toUpperCase()}
                      </span>
                      <span className="notif__item-body">
                        <span className="notif__item-title">
                          <strong>{item.otherPartyName}</strong>
                          <span className="notif__item-badge">
                            {item.unreadCount}
                          </span>
                        </span>
                        <span className="notif__item-preview">
                          {item.lastMessagePreview}
                        </span>
                        <span className="notif__item-meta">
                          {item.offeredBook} ↔ {item.requestedBook}
                        </span>
                      </span>
                    </button>
                  ))}
                </section>
              )}

              {hasPending && (
                <section className="notif__section">
                  <h4 className="notif__section-title">Propostas de troca</h4>
                  {summary!.pendingTrades.map((item) => (
                    <Link
                      key={item.tradeId}
                      to="/trocas"
                      className="notif__item"
                      onClick={() => setOpen(false)}
                    >
                      <span className="notif__item-avatar notif__item-avatar--trade" aria-hidden>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="17 1 21 5 17 9" />
                          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                          <polyline points="7 23 3 19 7 15" />
                          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                        </svg>
                      </span>
                      <span className="notif__item-body">
                        <span className="notif__item-title">
                          <strong>{item.proposerName}</strong>
                          <span className="notif__item-pill">Pendente</span>
                        </span>
                        <span className="notif__item-preview">
                          {item.offeredBook} ↔ {item.requestedBook}
                        </span>
                      </span>
                    </Link>
                  ))}
                </section>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}