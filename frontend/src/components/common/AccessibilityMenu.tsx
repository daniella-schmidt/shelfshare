import { useEffect, useRef, useState } from 'react';
import { useAccessibility, type FontSize } from '../../contexts/AccessibilityContext';

const FONT_STEPS: { value: FontSize; label: string; scale: number }[] = [
  { value: 'sm', label: 'A', scale: 0.8 },
  { value: 'md', label: 'A', scale: 1 },
  { value: 'lg', label: 'A', scale: 1.2 },
  { value: 'xl', label: 'A', scale: 1.4 },
];

export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { theme, setTheme, fontSize, setFontSize, reset } = useAccessibility();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="ss-a11y" ref={ref}>
      <button
        type="button"
        className="ss-a11y__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label="Acessibilidade e aparência"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="4.5" r="1.8" />
          <path d="M4.5 8h15" />
          <path d="M12 8v6" />
          <path d="M8.5 21 12 14l3.5 7" />
        </svg>
      </button>

      {open && (
        <div className="ss-a11y__panel" role="dialog" aria-label="Preferências de acessibilidade">
          <header className="ss-a11y__head">
            <h3>Acessibilidade</h3>
            <button type="button" className="ss-a11y__reset" onClick={reset}>
              Redefinir
            </button>
          </header>

          <section className="ss-a11y__row">
            <div className="ss-a11y__label">Tema</div>
            <div className="ss-seg" role="radiogroup" aria-label="Tema">
              <button
                type="button" role="radio" aria-checked={theme === 'light'}
                className={`ss-seg__btn ${theme === 'light' ? 'is-active' : ''}`}
                onClick={() => setTheme('light')}
              >
                Claro
              </button>
              <button
                type="button" role="radio" aria-checked={theme === 'dark'}
                className={`ss-seg__btn ${theme === 'dark' ? 'is-active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                Escuro
              </button>
            </div>
          </section>

          <section className="ss-a11y__row">
            <div className="ss-a11y__label">
              Tamanho do texto
              <span className="ss-a11y__hint">
                {fontSize === 'sm' && 'Pequeno'}
                {fontSize === 'md' && 'Padrão'}
                {fontSize === 'lg' && 'Grande'}
                {fontSize === 'xl' && 'Muito grande'}
              </span>
            </div>
            <div className="ss-seg ss-seg--font" role="radiogroup" aria-label="Tamanho do texto">
              {FONT_STEPS.map((step) => (
                <button
                  key={step.value}
                  type="button"
                  role="radio"
                  aria-checked={fontSize === step.value}
                  aria-label={`Tamanho ${step.scale * 100}%`}
                  className={`ss-seg__btn ${fontSize === step.value ? 'is-active' : ''}`}
                  onClick={() => setFontSize(step.value)}
                >
                  <span style={{ fontSize: `${step.scale}rem`, lineHeight: 1, fontWeight: 700 }}>
                    {step.label}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}