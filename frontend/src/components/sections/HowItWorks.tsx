const STEPS = [
  {
    title: 'Monte sua estante',
    text: 'Cadastre os livros que você já leu. A busca automática por ISBN preenche capa, autor e editora em um clique.',
  },
  {
    title: 'Encontre a próxima leitura',
    text: 'Explore o catálogo por título, autor, cidade ou condição. Salve os que te interessam.',
  },
  {
    title: 'Proponha a troca',
    text: 'Ofereça um dos seus livros. Quando ambos aceitarem, o contato é liberado e vocês combinam a entrega.',
  },
];

export default function HowItWorks() {
  return (
    <section className="section section--dark">
      <div className="container">
        <div className="section-head">
          <div className="section-head__left">
            <span className="section-eyebrow" style={{ color: 'var(--royal-gold)' }}>
              Passo a passo
            </span>
            <h2 style={{ color: '#fdf7e6' }}>Do seu livro até outro leitor</h2>
            <p className="section-head__lead" style={{ color: 'rgba(253,247,230,0.72)' }}>
              Sem burocracia, sem taxas. Um fluxo pensado para quem lê.
            </p>
          </div>
        </div>

        <div className="steps">
          {STEPS.map((s, i) => (
            <article key={s.title} className="step">
              <div className="step__number">{String(i + 1).padStart(2, '0')}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}