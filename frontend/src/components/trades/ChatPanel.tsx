import { useEffect, useRef, useState, type FormEvent } from 'react';
import { tradesApi } from '../../api/trades';
import { useAuth } from '../../contexts/AuthContext';
import type { TradeMessage } from '../../types';

const POLL_INTERVAL = 4000;

interface Props {
  tradeId: string;
  onRead?: () => void;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Hoje';
  if (d.toDateString() === yesterday.toDateString()) return 'Ontem';

  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function ChatPanel({ tradeId, onRead }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<TradeMessage[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const lastCountRef = useRef(0);
  const didReadRef = useRef(false);

  async function load(silent = false) {
    try {
      const list = await tradesApi.messages(tradeId);
      setMessages(list);
      setError(null);
      if (!didReadRef.current) {
        didReadRef.current = true;
        onRead?.();
      }
    } catch (err: any) {
      if (!silent) {
        setError(
          err?.response?.data?.message ??
            'Não foi possível carregar a conversa.',
        );
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    didReadRef.current = false;
    lastCountRef.current = 0;
    load();

    const t = window.setInterval(() => {
      if (document.hidden) return;
      load(true);
    }, POLL_INTERVAL);

    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeId]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    if (stickToBottom.current && messages.length !== lastCountRef.current) {
      el.scrollTop = el.scrollHeight;
    }
    lastCountRef.current = messages.length;
  }, [messages]);

  function onScroll() {
    const el = listRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    stickToBottom.current = nearBottom;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const content = text.trim();
    if (!content || sending) return;

    setSending(true);
    setError(null);
    try {
      const created = await tradesApi.sendMessage(tradeId, content);
      setMessages((m) => [...m, created]);
      setText('');
      stickToBottom.current = true;
      requestAnimationFrame(() => {
        const el = listRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          'Não foi possível enviar a mensagem.',
      );
    } finally {
      setSending(false);
    }
  }

  const myId = user?.id;

  return (
    <div className="chat-panel">
      <div
        className="chat__list"
        ref={listRef}
        onScroll={onScroll}
        role="log"
        aria-live="polite"
      >
        {loading && messages.length === 0 && (
          <p className="chat__empty">Carregando conversa…</p>
        )}

        {!loading && messages.length === 0 && (
          <p className="chat__empty">
            Nenhuma mensagem ainda. Combine o local, o horário e os detalhes
            da troca por aqui.
          </p>
        )}

        {messages.map((m, i) => {
          const mine = m.senderId === myId;
          const prev = messages[i - 1];
          const showDay =
            !prev ||
            new Date(prev.createdAt).toDateString() !==
              new Date(m.createdAt).toDateString();

          return (
            <div key={m.id} className="chat__row">
              {showDay && (
                <div className="chat__day" aria-hidden>
                  {formatDayLabel(m.createdAt)}
                </div>
              )}
              <div className={`chat__bubble ${mine ? 'is-mine' : 'is-theirs'}`}>
                {!mine && <span className="chat__author">{m.sender.name}</span>}
                <p className="chat__text">{m.content}</p>
                <time className="chat__time" dateTime={m.createdAt}>
                  {formatTime(m.createdAt)}
                </time>
              </div>
            </div>
          );
        })}
      </div>

      {error && <div className="chat__error">{error}</div>}

      <form className="chat__form" onSubmit={onSubmit}>
        <input
          className="input chat__input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva uma mensagem…"
          aria-label="Mensagem"
          maxLength={2000}
          autoComplete="off"
          disabled={sending}
        />
        <button
          type="submit"
          className="btn btn-primary chat__send"
          disabled={!text.trim() || sending}
          aria-label="Enviar mensagem"
        >
          {sending ? (
            <span className="spinner" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}