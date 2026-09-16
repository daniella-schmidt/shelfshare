const FEATURES = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    title: 'Cadastre seus livros',
    text: 'Adicione títulos em segundos — busca automática por ISBN preenche capa, autor e editora.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
    title: 'Encontre leitores próximos',
    text: 'Filtre por cidade, gênero ou condição. Descubra quem tem o livro que você procura.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7h16M4 12h16M4 17h10" />
        <circle cx="19" cy="17" r="2.5" />
      </svg>
    ),
    title: 'Proponha e conclua a troca',
    text: 'Combine pelo próprio ShelfShare. Ambos confirmam — o contato é liberado com segurança.',
  },
];

export default function Features() {
  return (
    <section className="section section--paper">
      <div className="container">
        <div className="section-head">
          <div className="section-head__left">
            <span className="section-eyebrow">Como funciona</span>
            <h2>Simples como folhear um livro</h2>
            <p className="section-head__lead">
              Em três passos você transforma livros parados em novas leituras.
            </p>
          </div>
        </div>

        <div className="features-grid">
          {FEATURES.map((f) => (
            <article key={f.title} className="feature-card">
              <span className="feature-card__icon" aria-hidden>{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}