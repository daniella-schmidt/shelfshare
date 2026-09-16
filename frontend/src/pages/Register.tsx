import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function Register() {
  const { signUp } = useAuth();
  const nav = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
        city: city.trim(),
        state: state.trim().toUpperCase(),
      });
      nav('/', { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        'Não foi possível criar sua conta. Tente novamente.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="auth-layout">
        <div className="auth-card" style={{ maxWidth: 520 }}>
          <h1>Crie sua conta</h1>
          <p className="auth-card__subtitle">
            Leva menos de um minuto. É grátis e para sempre.
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && <div className="notice notice--error">{error}</div>}

            <div className="field">
              <label htmlFor="name">Nome completo</label>
              <input
                id="name"
                type="text"
                className="input"
                placeholder="Maria Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                autoFocus
              />
            </div>

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
              />
            </div>

            <div className="field">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                className="input"
                placeholder="Mínimo de 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: 'var(--space-4)',
              }}
            >
              <div className="field">
                <label htmlFor="city">Cidade</label>
                <input
                  id="city"
                  type="text"
                  className="input"
                  placeholder="São Paulo"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="state">UF</label>
                <input
                  id="state"
                  type="text"
                  className="input"
                  placeholder="SP"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  maxLength={2}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" /> Criando conta…
                </>
              ) : (
                'Criar conta'
              )}
            </button>
          </form>

          <p className="auth-card__footer">
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}