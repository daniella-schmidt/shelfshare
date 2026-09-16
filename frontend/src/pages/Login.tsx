import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function Login() {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Se veio de uma rota protegida, volta pra lá após login
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      nav(from, { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        'Não foi possível entrar. Verifique suas credenciais.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="auth-layout">
        <div className="auth-card">
          <h1>Bem-vindo de volta</h1>
          <p className="auth-card__subtitle">
            Entre para continuar trocando livros com a comunidade.
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && <div className="notice notice--error">{error}</div>}

            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                autoFocus
              />
            </div>

            <div className="field">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" /> Entrando…
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <p className="auth-card__footer">
            Ainda não tem conta? <Link to="/register">Cadastre-se grátis</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}