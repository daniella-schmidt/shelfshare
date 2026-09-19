import { Link } from 'react-router-dom';

export default function CTABanner() {
  return (
    <section className="section" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-banner">
          <div className="cta-banner__content">
            <span className="cta-banner__eyebrow">Comece hoje</span>
            <h2 id="cta-title" className="cta-banner__title">
              Pronto para dar <em>nova vida</em> aos seus livros?
            </h2>
            <p className="cta-banner__lead">
              Criar uma conta leva menos de um minuto. É grátis, para sempre.
            </p>
            <div className="cta-banner__actions">
              <Link to="/register" className="btn btn-accent btn-lg">
                Criar minha conta
              </Link>
              <Link to="/livros" className="btn btn-outline-light btn-lg">
                Explorar catálogo
              </Link>
            </div>
            <p className="cta-banner__note">
              Sem cartão de crédito · Sem taxas · Sem assinatura
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}