import { useState, useRef, useEffect } from 'react';
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

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

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
          <Link to="/" className="brand" aria-label="ShelfShare — Início">
            <span className="brand__mark" aria-hidden>
              <img src={catLogo} alt="" />
            </span>
            <span className="brand__name">
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
                  className="user-menu__trigger"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                >
                  <span className="avatar avatar-sm">{initials}</span>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                    {user.name?.split(' ')[0]}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round">
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
                    <div className="user-menu__divider" />
                    <button onClick={handleLogout} role="menuitem">Sair</button>
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
              className="menu-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-nav" onClick={() => setMenuOpen(false)}>
          <div className="mobile-nav__panel" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <span className="brand">
                <span className="brand__mark" aria-hidden>
                  <img src={catLogo} alt="" />
                </span>
                <span className="brand__name">Shelf<em>Share</em></span>
              </span>
              <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu" style={{ padding: 8 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            ))}

            {!user && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                <Link to="/login" className="btn btn-secondary" onClick={() => setMenuOpen(false)}>Entrar</Link>
                <Link to="/register" className="btn btn-accent" onClick={() => setMenuOpen(false)}>Cadastrar</Link>
              </div>
            )}
          </div>
        </div>
      )}

      <ChatDrawer />
    </>
  );
}