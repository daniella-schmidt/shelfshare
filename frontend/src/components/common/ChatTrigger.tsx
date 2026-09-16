import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useChat } from '../../contexts/ChatContext';

export default function ChatTrigger() {
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

  const chats = summary?.activeChats ?? [];
  const total = summary?.unreadMessagesTotal ?? 0;

  return (
    <div className="chat-trigger" ref={ref}>
      <button
        type="button"
        className="chat-trigger__btn"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Chat${total > 0 ? ` (${total} não lidas)` : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {total > 0 && (
          <span className="chat-trigger__badge">{total > 99 ? '99+' : total}</span>
        )}
      </button>

      {open && (
        <div className="chat-trigger__panel" role="dialog" aria-label="Conversas">
          <header className="chat-trigger__head">
            <h3>Conversas ativas</h3>
          </header>

          {chats.length === 0 ? (
            <p className="chat-trigger__empty">
              Você ainda não tem conversas em andamento. Quando alguém fizer uma
              proposta ou aceitar a sua, o chat aparece aqui.
            </p>
          ) : (
            <ul className="chat-trigger__list">
              {chats.map((c) => (
                <li key={c.tradeId}>
                  <button
                    type="button"
                    className={`chat-trigger__item ${c.unreadCount > 0 ? 'has-unread' : ''}`}
                    onClick={() => { openChat(c.tradeId); setOpen(false); }}
                  >
                    <span className="chat-trigger__avatar" aria-hidden>
                      {c.otherPartyName.charAt(0).toUpperCase()}
                    </span>
                    <span className="chat-trigger__info">
                      <span className="chat-trigger__name">
                        {c.otherPartyName}
                        {c.unreadCount > 0 && (
                          <span className="chat-trigger__count">{c.unreadCount}</span>
                        )}
                        {c.status === 'PENDENTE' && (
                          <span className="chat-trigger__pill">Proposta</span>
                        )}
                      </span>
                      <span className="chat-trigger__preview">
                        {c.lastMessagePreview || 'Sem mensagens ainda — diga olá.'}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <footer className="chat-trigger__footer">
            <Link to="/trocas" onClick={() => setOpen(false)}>
              Ver todas as trocas
            </Link>
          </footer>
        </div>
      )}
    </div>
  );
}