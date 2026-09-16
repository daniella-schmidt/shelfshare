// src/types/index.ts

export type BookCondition = 'NOVO' | 'OTIMO' | 'BOM' | 'DESGASTADO';
export type BookStatus = 'DISPONIVEL' | 'RESERVADO' | 'TROCADO';

export interface Book {
  id: string;
  title: string;
  author: string;
  condition: BookCondition;
  status: BookStatus;
  isbn?: string;
  description?: string;
  coverUrl?: string;
  ownerId: string;
  owner?: {
    id: string;
    name: string;
    city?: string;
    state?: string;
  };
}

export interface CatalogBook extends Book {
  owner: {
    id: string;
    name: string;
    city?: string;
    state?: string;
  };
}

export interface CreateBookInput {
  title: string;
  author: string;
  condition: BookCondition;
  isbn?: string;
  description?: string;
  coverUrl?: string;
}

export type UpdateBookInput = Partial<CreateBookInput>;

/* ---------------- Trades ---------------- */

export type TradeStatus =
  | 'PENDENTE'
  | 'ACEITA'
  | 'RECUSADA'
  | 'CANCELADA'
  | 'CONCLUIDA';

export interface TradeUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
}

export interface Trade {
  id: string;
  status: TradeStatus;
  message?: string;
  createdAt: string;
  respondedAt?: string;
  completedAt?: string;
  proposerConfirmed: boolean;
  receiverConfirmed: boolean;

  proposerId: string;
  receiverId: string;

  offeredBookId: string;
  requestedBookId: string;

  offeredBook: Book;
  requestedBook: Book;

  proposer: TradeUser;
  receiver: TradeUser;
}

export interface CreateTradeInput {
  offeredBookId: string;
  requestedBookId: string;
  message?: string;
}

/* ---------------- Chat ---------------- */

export interface TradeMessage {
  id: string;
  tradeId: string;
  senderId: string;
  content: string;
  readAt?: string | null;
  createdAt: string;
  sender: {
    id: string;
    name: string;
  };
}

/* ---------------- Notificações ---------------- */

export interface TradeSummaryItem {
  tradeId: string;
  otherPartyName: string;
  unreadCount: number;
  lastMessagePreview: string;
  lastMessageAt: string | null;
  offeredBook: string;
  requestedBook: string;
}

export interface PendingTradeItem {
  tradeId: string;
  proposerName: string;
  offeredBook: string;
  requestedBook: string;
  createdAt: string;
}

export interface ActiveChatItem {
  tradeId: string;
  status: 'PENDENTE' | 'ACEITA';
  role: 'proposer' | 'receiver';
  otherPartyName: string;
  unreadCount: number;
  lastMessagePreview: string;
  lastMessageAt: string | null;
  offeredBook: string;
  requestedBook: string;
}

export interface PendingTradeItem {
  tradeId: string;
  proposerName: string;
  offeredBook: string;
  requestedBook: string;
  createdAt: string;
}

export interface TradesSummary {
  pendingTradesCount: number;
  unreadMessagesTotal: number;
  pendingTrades: PendingTradeItem[];
  activeChats: ActiveChatItem[];
}