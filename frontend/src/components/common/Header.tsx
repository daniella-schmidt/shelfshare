import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AccessibilityMenu from './AccessibilityMenu';
import NotificationBell from './NotificationBell';
import ChatTrigger from './ChatTrigger';
import ChatDrawer from './ChatDrawer';
import catLogo from '../../assets/cat.png';

const NAV_LINKS = [
  { to: '/', label: 'Início' },
  { to: '/livros', label: 'Explorar' },
  { to: '/trocas', label: 'Trocas' },
  { to: '/minha-estante', label: 'Minha Estante' },
];

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  // Fecha dropdown do usuário ao clicar fora
  useEffect(() => {
    if (!userMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userMenuOpen]);

  // Lock do body + Escape + foco inicial ao abrir mobile
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuToggleRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab' || !mobilePanelRef.current) return;

      const focusable = mobilePanelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
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
    // Foca o primeiro link dentro do painel
    requestAnimationFrame(() => {
      const firstLink = mobilePanelRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      firstLink?.focus();
    });

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const closeMobile = useCallback(() => {
    setMenuOpen(false);
    menuToggleRef.current?.focus();
  }, []);

  function handleLogout() {
    signOut();
    setUserMenuOpen(false);
    navigate('/');
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? '?';

  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="brand" aria-label="ShelfShare — Página inicial">
            <span className="brand__mark" aria-hidden="true">
              <img src={catLogo} alt="" />
            </span>
            <span className="brand__name" aria-hidden="true">
              Shelf<em>Share</em>
            </span>
          </Link>

          <nav className="main-nav" aria-label="Navegação principal">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? 'is-active' : '')}
                end={link.to === '/'}
                aria-current={undefined}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            {user && <ChatTrigger />}
            {user && <NotificationBell />}
            <AccessibilityMenu />

            {user ? (
              <div className="user-menu" ref={userMenuRef}>
                <button
                  type="button"
                  className="user-menu__trigger"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  aria-label={`Menu da conta — ${user.name ?? 'Usuário'}`}
                >
                  <span className="avatar avatar-sm" aria-hidden="true">{initials}</span>
                  <span aria-hidden="true" style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                    {user.name?.split(' ')[0]}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="user-menu__dropdown" role="menu">
                    <Link to="/minha-estante" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                      Minha Estante
                    </Link>
                    <Link to="/trocas" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                      Minhas Trocas
                    </Link>
                    <div className="user-menu__divider" role="separator" />
                    <button type="button" onClick={handleLogout} role="menuitem">Sair</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Entrar</Link>
                <Link to="/register" className="btn btn-accent btn-sm">Cadastrar</Link>
              </>
            )}

            <button
              ref={menuToggleRef}
              type="button"
              className="menu-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu de navegação"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-panel"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-nav" onClick={closeMobile} role="presentation">
          <div
            id="mobile-nav-panel"
            ref={mobilePanelRef}
            className="mobile-nav__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <span className="brand" aria-hidden="true">
                <span className="brand__mark">
                  <img src={catLogo} alt="" />
                </span>
                <span className="brand__name">Shelf<em>Share</em></span>
              </span>
              <button
                type="button"
                onClick={closeMobile}
                aria-label="Fechar menu"
                style={{ padding: 8, color: 'inherit' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav aria-label="Navegação mobile" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={closeMobile}
                  end={link.to === '/'}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {!user && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                <Link to="/login" className="btn btn-secondary" onClick={closeMobile}>Entrar</Link>
                <Link to="/register" className="btn btn-accent" onClick={closeMobile}>Cadastrar</Link>
              </div>
            )}
          </div>
        </div>
      )}

      <ChatDrawer />
    </>
  );
}