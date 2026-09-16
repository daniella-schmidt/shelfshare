import { Link } from 'react-router-dom';
import catLogo from '../../assets/cat.png';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero__grid">
        <div>
          <span className="hero__eyebrow">
            <span className="hero__eyebrow-dot" aria-hidden />
            Uma comunidade de leitores
          </span>

          <h1>
            Toda estante
            <br />
            guarda uma <em>nova história</em>.
          </h1>

          <p className="hero__lead">
            O ShelfShare conecta leitores da sua região para trocar livros de
            forma simples, gratuita e sustentável. Deixe seus livros circularem
            — e descubra o próximo sem sair de casa.
          </p>

          <div className="hero__actions">
            <Link to="/register" className="btn btn-accent btn-lg">
              Criar minha conta
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link to="/livros" className="btn btn-secondary btn-lg">
              Explorar catálogo
            </Link>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <strong>1.200+</strong>
              <span>Livros em circulação</span>
            </div>
            <div className="hero__stat">
              <strong>320+</strong>
              <span>Leitores ativos</span>
            </div>
            <div className="hero__stat">
              <strong>100%</strong>
              <span>Gratuito e sem taxas</span>
            </div>
          </div>
        </div>

        {/* Área reservada para o mascote + ilustração */}
        <div className="hero__visual" aria-hidden>
          <div className="hero__stage">
            <div className="hero__book-stack">
              <div className="hero__book hero__book--1">
                <span className="hero__book-title">A Revolução dos Bichos</span>
              </div>
              <div className="hero__book hero__book--2">
                <span className="hero__book-title">O Hobbit</span>
              </div>
              <div className="hero__book hero__book--3">
                <span className="hero__book-title">Sapiens</span>
              </div>
              <div className="hero__book hero__book--4">
                <span className="hero__book-title">Cem Anos de Solidão</span>
              </div>
              

            <div className="hero__shelf" />
            </div>
          </div>

          <span className="hero__float hero__float--1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Troca confirmada
          </span>

          <span className="hero__float hero__float--2">
            <svg width="14" height="14" viewBox="0 0 24 24"
              fill="currentColor" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            4.9 · 320 avaliações
          </span>
        </div>
      </div>
    </section>
  );
}