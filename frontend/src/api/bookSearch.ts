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
const TIMEOUT_MS = 4000;          // timeout por requisição
const SOFT_DEADLINE_MS = 3500;    // retorna com resultados parciais após isso
const CACHE_TTL = 10 * 60 * 1000; // 10 min

/* ============================================================
   Cooldown do Google (persistido em localStorage)
   ============================================================ */
const GOOGLE_COOLDOWN_KEY = 'shelfshare:google-cooldown-until';
const GOOGLE_COOLDOWN_MS = 30 * 60 * 1000; // 30 min

function readGoogleCooldown(): number {
  try {
    const v = localStorage.getItem(GOOGLE_COOLDOWN_KEY);
    if (!v) return 0;
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

let googleDisabledUntil = readGoogleCooldown();

function isGoogleAvailable(): boolean {
  return Date.now() >= googleDisabledUntil;
}

function disableGoogle(): void {
  googleDisabledUntil = Date.now() + GOOGLE_COOLDOWN_MS;
  try {
    localStorage.setItem(GOOGLE_COOLDOWN_KEY, String(googleDisabledUntil));
  } catch {
    /* ignore */
  }
}

/* ============================================================
   Cache em memória (TTL 10 min)
   ============================================================ */
const cache = new Map<string, { data: ExternalBook[]; timestamp: number }>();

function getCached(q: string): ExternalBook[] | null {
  const key = q.toLowerCase().trim();
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached(q: string, data: ExternalBook[]): void {
  const key = q.toLowerCase().trim();
  cache.set(key, { data, timestamp: Date.now() });
}

/* ============================================================
   Validação de ISBN (10 e 13 dígitos — dígito verificador)
   ============================================================ */
function isValidIsbn(raw: string): boolean {
  const clean = raw.replace(/[^0-9X]/gi, '');

  if (clean.length === 10) {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += (10 - i) * parseInt(clean[i], 10);
    }
    const check = clean[9].toUpperCase() === 'X' ? 10 : parseInt(clean[9], 10);
    return (sum + check) % 11 === 0;
  }

  if (clean.length === 13) {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(clean[i], 10) * (i % 2 === 0 ? 1 : 3);
    }
    const check = parseInt(clean[12], 10);
    return (10 - (sum % 10)) % 10 === check;
  }

  return false;
}

/* ============================================================
   Fetch com timeout (AbortController)
   ============================================================ */
async function fetchWithTimeout(
  url: string,
  timeoutMs = TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

/* ============================================================
   BrasilAPI — metadados por ISBN (só com ISBN válido)
   Retorna null em qualquer resposta não-ok (inclui 400/404).
   ============================================================ */
export async function fetchByIsbn(isbn: string): Promise<ExternalBook | null> {
  const clean = isbn.replace(/[^0-9X]/gi, '');
  if (!isValidIsbn(clean)) return null;

  try {
    const res = await fetchWithTimeout(
      `https://brasilapi.com.br/api/isbn/v1/${clean}`,
    );
    if (!res.ok) return null; // 400, 404, 500 → tratado como "não encontrado"

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

  const res = await fetchWithTimeout(url.toString());
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

  const res = await fetchWithTimeout(url.toString());

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
   Busca unificada — com soft deadline (resultados parciais)

   Como funciona:
   - Cada fonte empurra resultados para `collected` assim que responde.
   - `Promise.race` entre "todas as fontes" e "3.5s de relógio".
   - O que tiver sido coletado é devolvido, sem esperar a fonte lenta.
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

  // Dispara as fontes em paralelo. Cada uma popula `collected` ao resolver.
  const tasks: Promise<void>[] = [
    searchOpenLibrary(q).then(addUnique).catch(() => { /* silencioso */ }),
  ];

  if (isGoogleAvailable()) {
    tasks.push(
      searchGoogleBooks(q).then(addUnique).catch(() => { /* silencioso */ }),
    );
  }

  // Aguarda: (a) todas as fontes terminarem OU (b) o soft deadline expirar.
  await Promise.race([
    Promise.allSettled(tasks),
    new Promise<void>((resolve) => setTimeout(resolve, SOFT_DEADLINE_MS)),
  ]);

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
  if (!isbn || !isValidIsbn(isbn)) return book;

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
  if (!isValidIsbn(clean)) return null;

  const direct = await fetchByIsbn(clean);
  if (direct) return direct;

  const results = await searchBooks(`isbn:${clean}`);
  return results[0] ?? null;
}