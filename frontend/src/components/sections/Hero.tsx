import { Link } from 'react-router-dom';
import bookGirl from '../../assets/book_girl.png';

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__inner">
        <div className="hero__copy">
          <span className="hero__eyebrow">
            <span className="hero__eyebrow-dot" aria-hidden="true" />
            Bem-vindo à ShelfShare
          </span>

          <h1 id="hero-title" className="hero__title">
            Toda estante
            <br />
            guarda uma <em>nova história</em>.
          </h1>

          <p className="hero__lead">
            Troque livros com leitores da sua região. Sem taxas, sem comissões,
            sem complicação — só histórias circulando.
          </p>

          <div className="hero__actions">
            <Link to="/register" className="btn btn-accent btn-lg">
              Começar agora
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link to="/livros" className="btn btn-outline-light btn-lg">
              Explorar catálogo
            </Link>
          </div>
          
          <p className="hero__nametype">Desenvolvido por:</p>

          <ul className="hero__meta"> 
            <li><span className="hero__meta-dot" aria-hidden="true" />Daniella Vitória Schmidt</li>
            <li><span className="hero__meta-dot" aria-hidden="true" />Leandra de Oliveira</li>
            <li><span className="hero__meta-dot" aria-hidden="true" />Yuliangel Silvera Herrera</li>
          </ul>
        </div>

        <div className="hero__visual">
          <div className="hero__portrait">
            <img
              src={bookGirl}
              alt="Leitora da comunidade ShelfShare segurando um livro aberto"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>

          <span className="hero__badge hero__badge--top" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="3" strokeLinecap="round"
              strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Troca confirmada
          </span>

          <span className="hero__badge hero__badge--bottom" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            4.9 · 320 avaliações
          </span>
        </div>
      </div>
    </section>
  );
}