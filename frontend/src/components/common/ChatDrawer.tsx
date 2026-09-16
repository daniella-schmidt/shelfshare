import { useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import ChatPanel from '../trades/ChatPanel';

export default function ChatDrawer() {
  const { openTradeId, closeChat, summary, refresh } = useChat();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeChat();
    }
    if (openTradeId) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
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
        className="chat-drawer__panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Chat da troca"
      >
        <header className="chat-drawer__head">
          <div className="chat-drawer__title-group">
            <h3 className="chat-drawer__title">
              {info?.otherPartyName ?? 'Conversa'}
            </h3>
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
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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