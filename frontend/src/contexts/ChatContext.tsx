import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { tradesApi } from '../api/trades';
import { useAuth } from './AuthContext';
import type { TradesSummary } from '../types';

const POLL_INTERVAL = 15000;

interface ChatContextValue {
  summary: TradesSummary | null;
  openTradeId: string | null;
  openChat: (tradeId: string) => void;
  closeChat: () => void;
  refresh: () => Promise<void>;
}

const Ctx = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [summary, setSummary] = useState<TradesSummary | null>(null);
  const [openTradeId, setOpenTradeId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setSummary(null);
      return;
    }
    try {
      const data = await tradesApi.summary();
      setSummary(data);
    } catch {
      /* silencioso — mantém o resumo anterior */
    }
  }, [user]);

  useEffect(() => {
    refresh();
    if (!user) return;

    const t = window.setInterval(() => {
      if (!document.hidden) refresh();
    }, POLL_INTERVAL);

    return () => window.clearInterval(t);
  }, [user, refresh]);

  const value = useMemo<ChatContextValue>(
    () => ({
      summary,
      openTradeId,
      openChat: (id: string) => setOpenTradeId(id),
      closeChat: () => setOpenTradeId(null),
      refresh,
    }),
    [summary, openTradeId, refresh],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useChat() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useChat precisa estar dentro de <ChatProvider>');
  return ctx;
}