import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type Theme = 'light' | 'dark';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl';

interface AccessibilityContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  fontSize: FontSize;
  setFontSize: (f: FontSize) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  reset: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

const THEME_KEY = 'shelfshare:theme';
const FONT_KEY  = 'shelfshare:font-size';
const FONT_ORDER: FontSize[] = ['sm', 'md', 'lg', 'xl'];

function readTheme(): Theme {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch { /* SSR / bloqueado */ }
  return 'light'; // padrão claro
}

function readFontSize(): FontSize {
  try {
    const v = localStorage.getItem(FONT_KEY) as FontSize | null;
    if (v && FONT_ORDER.includes(v)) return v;
  } catch { /* SSR / bloqueado */ }
  return 'md';
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readTheme);
  const [fontSize, setFontSizeState] = useState<FontSize>(readFontSize);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* ignore */ }
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    try { localStorage.setItem(FONT_KEY, fontSize); } catch { /* ignore */ }
  }, [fontSize]);

  const value: AccessibilityContextValue = {
    theme,
    setTheme: setThemeState,
    toggleTheme: () => setThemeState(t => (t === 'dark' ? 'light' : 'dark')),
    fontSize,
    setFontSize: setFontSizeState,
    increaseFontSize: () => {
      const i = FONT_ORDER.indexOf(fontSize);
      if (i < FONT_ORDER.length - 1) setFontSizeState(FONT_ORDER[i + 1]);
    },
    decreaseFontSize: () => {
      const i = FONT_ORDER.indexOf(fontSize);
      if (i > 0) setFontSizeState(FONT_ORDER[i - 1]);
    },
    reset: () => {
      setThemeState('light');
      setFontSizeState('md');
    },
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility precisa estar dentro de <AccessibilityProvider>');
  return ctx;
}