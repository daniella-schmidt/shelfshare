import { useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import ChatPanel from '../trades/ChatPanel';

export default function ChatDrawer() {
  const { openTradeId, closeChat, summary, refresh } = useChat();
  const panelRef = useRef<HTMLElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!openTradeId) return;

    lastFocusedRef.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeChat();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKey);

    requestAnimationFrame(() => {
      const closeBtn = panelRef.current?.querySelector<HTMLElement>('.chat-drawer__close');
      closeBtn?.focus();
    });

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      lastFocusedRef.current?.focus?.();
    };
  }, [openTradeId, closeChat]);

  if (!openTradeId) return null;

  const info = summary?.activeChats.find((t) => t.tradeId === openTradeId);

  const statusLabel =
    info?.status === 'PENDENTE'
      ? info.role === 'receiver'
        ? 'Proposta recebida'
        : 'Proposta enviada'
      : info?.status === 'ACEITA'
      ? 'Troca aceita'
      : null;

  return (
    <div className="chat-drawer" onClick={closeChat} role="presentation">
      <aside
        ref={panelRef}
        className="chat-drawer__panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-drawer-title"
      >
        <header className="chat-drawer__head">
          <div className="chat-drawer__title-group">
            <h2 id="chat-drawer-title" className="chat-drawer__title">
              {info?.otherPartyName ?? 'Conversa'}
            </h2>
            {info && (
              <span className="chat-drawer__subtitle">
                {info.offeredBook} ↔ {info.requestedBook}
              </span>
            )}
            {statusLabel && (
              <span
                className={`chat-drawer__status chat-drawer__status--${
                  info?.status === 'PENDENTE' ? 'pending' : 'accepted'
                }`}
              >
                {statusLabel}
              </span>
            )}
          </div>
          <button
            type="button"
            className="chat-drawer__close"
            onClick={closeChat}
            aria-label="Fechar chat"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <div className="chat-drawer__body">
          <ChatPanel tradeId={openTradeId} onRead={refresh} />
        </div>
      </aside>
    </div>
  );
}