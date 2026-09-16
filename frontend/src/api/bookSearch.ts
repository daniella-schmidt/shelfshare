// src/api/bookSearch.ts
// Busca de livros com prioridade pt-BR + cooldown do Google após 429

export interface ExternalBook {
  externalId: string;
  title: string;
  authors: string[];
  publisher?: string;
  publishedYear?: string;
  description?: string;
  coverUrl?: string;
  isbn10?: string;
  isbn13?: string;
  pageCount?: number;
  language?: string;
  source: 'google' | 'openlibrary' | 'gutendex' | 'brasilapi';
}

const MIN_QUERY_LENGTH = 3;

/* ============================================================
   Estado global: cooldown do Google após receber 429
   ============================================================ */
let googleDisabledUntil = 0; // timestamp ms
const GOOGLE_COOLDOWN_MS = 30 * 60 * 1000; // 30 min

function isGoogleAvailable() {
  return Date.now() >= googleDisabledUntil;
}

function disableGoogle() {
  googleDisabledUntil = Date.now() + GOOGLE_COOLDOWN_MS;
}

/* ============================================================
   Cache em memória
   ============================================================ */
const cache = new Map<string, ExternalBook[]>();
const CACHE_TTL = 5 * 60 * 1000;
const cacheTimestamps = new Map<string, number>();

function getCached(q: string): ExternalBook[] | null {
  const key = q.toLowerCase().trim();
  const ts = cacheTimestamps.get(key);
  if (!ts) return null;
  if (Date.now() - ts > CACHE_TTL) {
    cache.delete(key);
    cacheTimestamps.delete(key);
    return null;
  }
  return cache.get(key) ?? null;
}

function setCached(q: string, data: ExternalBook[]) {
  const key = q.toLowerCase().trim();
  cache.set(key, data);
  cacheTimestamps.set(key, Date.now());
}

/* ============================================================
   BrasilAPI — metadados por ISBN (agrega CBL + Open Library + Google Books)
   ============================================================ */
export async function fetchByIsbn(isbn: string): Promise<ExternalBook | null> {
  const clean = isbn.replace(/[^0-9X]/gi, '');
  if (clean.length < 10) return null;

  try {
    const res = await fetch(`https://brasilapi.com.br/api/isbn/v1/${clean}`);
    if (!res.ok) return null;

    const data = await res.json();

    return {
      externalId: `brasilapi-${clean}`,
      title: data.title ?? '',
      authors: data.authors ?? [],
      publisher: data.publisher,
      publishedYear: data.year?.toString(),
      description: data.synopsis ?? data.subject,
      coverUrl: data.cover_url ?? data.coverUrl,
      isbn10: clean.length === 10 ? clean : undefined,
      isbn13: clean.length === 13 ? clean : undefined,
      pageCount: data.page_count,
      language: data.language,
      source: 'brasilapi',
    };
  } catch {
    return null;
  }
}

/* ============================================================
   Gutendex — livros em pt-BR (domínio público)
   ============================================================ */
async function searchGutendex(query: string): Promise<ExternalBook[]> {
  const url = new URL('https://gutendex.com/books');
  url.searchParams.set('search', query);
  url.searchParams.set('languages', 'pt');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Gutendex indisponível');

  const data = await res.json();

  return (data.results ?? []).slice(0, 10).map((book: any): ExternalBook => {
    const formats = book.formats ?? {};
    const cover = formats['image/jpeg'];

    return {
      externalId: `gutendex-${book.id}`,
      title: book.title ?? '',
      authors: book.authors?.map((a: any) => a.name) ?? [],
      coverUrl: cover,
      language: 'pt',
      source: 'gutendex',
    };
  });
}

/* ============================================================
   Open Library (foco pt)
   ============================================================ */
async function searchOpenLibrary(query: string): Promise<ExternalBook[]> {
  const url = new URL('https://openlibrary.org/search.json');
  url.searchParams.set('q', query);
  url.searchParams.set('limit', '10');
  url.searchParams.set('language', 'por');
  url.searchParams.set(
    'fields',
    'key,title,author_name,first_publish_year,isbn,cover_i',
  );

  const res = await fetch(url.toString());
  if (res.status === 422) throw new Error('INVALID_QUERY');
  if (!res.ok) throw new Error('Open Library indisponível');

  const data = await res.json();

  return (data.docs ?? []).map((doc: any): ExternalBook => {
    const isbns: string[] = doc.isbn ?? [];
    const isbn13 = isbns.find((i) => i.length === 13);
    const isbn10 = isbns.find((i) => i.length === 10);

    return {
      externalId: doc.key,
      title: doc.title ?? '',
      authors: doc.author_name ?? [],
      publishedYear: doc.first_publish_year?.toString(),
      coverUrl: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : isbn13
          ? `https://covers.openlibrary.org/b/isbn/${isbn13}-M.jpg`
          : undefined,
      isbn10,
      isbn13,
      source: 'openlibrary',
    };
  });
}

/* ============================================================
   Google Books (só se não estiver em cooldown)
   ============================================================ */
async function searchGoogleBooks(query: string): Promise<ExternalBook[]> {
  if (!isGoogleAvailable()) {
    throw new Error('GOOGLE_COOLDOWN');
  }

  const url = new URL('https://www.googleapis.com/books/v1/volumes');
  url.searchParams.set('q', query);
  url.searchParams.set('maxResults', '10');
  url.searchParams.set('printType', 'books');

  const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_KEY;
  if (apiKey) url.searchParams.set('key', apiKey);

  const res = await fetch(url.toString());

  if (res.status === 429) {
    disableGoogle();
    throw new Error('RATE_LIMIT');
  }
  if (!res.ok) throw new Error('Google Books indisponível');

  const data = await res.json();

  return (data.items ?? []).map((item: any): ExternalBook => {
    const info = item.volumeInfo ?? {};
    const ids = info.industryIdentifiers ?? [];

    return {
      externalId: item.id,
      title: info.title ?? '',
      authors: info.authors ?? [],
      publisher: info.publisher,
      publishedYear: info.publishedDate?.slice(0, 4),
      description: info.description,
      coverUrl: info.imageLinks?.thumbnail?.replace('http://', 'https://'),
      isbn10: ids.find((i: any) => i.type === 'ISBN_10')?.identifier,
      isbn13: ids.find((i: any) => i.type === 'ISBN_13')?.identifier,
      pageCount: info.pageCount,
      language: info.language,
      source: 'google',
    };
  });
}

/* ============================================================
   Busca unificada — pt-BR primeiro, Google só se disponível
   ============================================================ */
export async function searchBooks(query: string): Promise<ExternalBook[]> {
  const q = query.trim();
  if (q.length < MIN_QUERY_LENGTH) return [];

  const cached = getCached(q);
  if (cached) return cached;

  const seen = new Set<string>();
  const collected: ExternalBook[] = [];

  const addUnique = (list: ExternalBook[]) => {
    for (const b of list) {
      const key = `${b.title}|${b.authors[0] ?? ''}`.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        collected.push(b);
      }
    }
  };

  // As três buscas disparam em paralelo; a primeira que responder já pode popular a lista.
  const tasks: Promise<ExternalBook[]>[] = [
    searchGutendex(q).catch(() => [] as ExternalBook[]),
    searchOpenLibrary(q).catch(() => [] as ExternalBook[]),
  ];

  // Google só entra se não estiver em cooldown
  if (isGoogleAvailable()) {
    tasks.push(searchGoogleBooks(q).catch(() => [] as ExternalBook[]));
  }

  const results = await Promise.all(tasks);
  for (const list of results) addUnique(list);

  if (collected.length > 0) setCached(q, collected);
  return collected;
}
/* ============================================================
   Enriquecimento via BrasilAPI (metadados pt-BR)
   ============================================================ */
export async function enrichWithBrasilApi(
  book: ExternalBook,
): Promise<ExternalBook> {
  const isbn = book.isbn13 ?? book.isbn10;
  if (!isbn) return book;

  const detailed = await fetchByIsbn(isbn);
  if (!detailed) return book;

  return {
    ...book,
    title: detailed.title || book.title,
    authors: detailed.authors?.length ? detailed.authors : book.authors,
    publisher: detailed.publisher ?? book.publisher,
    publishedYear: detailed.publishedYear ?? book.publishedYear,
    description: detailed.description ?? book.description,
    coverUrl: detailed.coverUrl ?? book.coverUrl,
    pageCount: detailed.pageCount ?? book.pageCount,
    language: detailed.language ?? book.language,
    source: detailed.source ?? book.source,
  };
}

/** Busca direta por ISBN (BrasilAPI primeiro). */
export async function searchByIsbn(isbn: string): Promise<ExternalBook | null> {
  const clean = isbn.replace(/[^0-9X]/gi, '');
  if (clean.length < 10) return null;

  const direct = await fetchByIsbn(clean);
  if (direct) return direct;

  const results = await searchBooks(`isbn:${clean}`);
  return results[0] ?? null;
}