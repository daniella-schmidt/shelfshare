// src/api/trades.ts
import { api } from './axios';
import type {
  Trade,
  CreateTradeInput,
  TradeMessage,
  TradesSummary,
} from '../types';

export type { Trade, CreateTradeInput, TradeMessage, TradesSummary };

export const tradesApi = {
  propose: (offeredBookId: string, requestedBookId: string, message?: string) =>
    api
      .post<Trade>('/trades', {
        offeredBookId,
        requestedBookId,
        message,
      } satisfies CreateTradeInput)
      .then((r) => r.data),

  received: () => api.get<Trade[]>('/trades/received').then((r) => r.data),
  sent:     () => api.get<Trade[]>('/trades/sent').then((r) => r.data),

  accept:  (id: string) => api.patch<Trade>(`/trades/${id}/accept`).then((r) => r.data),
  reject:  (id: string) => api.patch<Trade>(`/trades/${id}/reject`).then((r) => r.data),
  cancel:  (id: string) => api.patch<Trade>(`/trades/${id}/cancel`).then((r) => r.data),
  confirm: (id: string) => api.patch<Trade>(`/trades/${id}/confirm`).then((r) => r.data),

  summary: () =>
    api.get<TradesSummary>('/trades/summary').then((r) => r.data),

  messages: (tradeId: string) =>
    api.get<TradeMessage[]>(`/trades/${tradeId}/messages`).then((r) => r.data),

  sendMessage: (tradeId: string, content: string) =>
    api
      .post<TradeMessage>(`/trades/${tradeId}/messages`, { content })
      .then((r) => r.data),
};