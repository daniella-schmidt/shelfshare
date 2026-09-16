import { Link } from 'react-router-dom';

export default function CTABanner() {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-banner">
          <div className="cta-banner__content">
            <span className="cta-banner__eyebrow">Comece hoje</span>
            <h2>
              Pronto para dar <em>nova vida</em> aos seus livros?
            </h2>
            <p>
              Cadastre-se gratuitamente e comece a trocar com leitores da sua
              região em poucos minutos.
            </p>
            <div className="cta-banner__actions">
              <Link to="/register" className="btn btn-accent btn-lg">
                Criar minha conta
              </Link>
              <Link to="/livros" className="btn btn-secondary btn-lg">
                Explorar catálogo
              </Link>
            </div>
          </div>

          <div className="cta-banner__visual" aria-hidden>
            <div className="cta-banner__mini-book" />
            <div className="cta-banner__mini-book" />
            <div className="cta-banner__mini-book" />
          </div>
        </div>
      </div>
    </section>
  );
}