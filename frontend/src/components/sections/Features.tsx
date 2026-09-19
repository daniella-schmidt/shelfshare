const STEPS = [
  {
    number: '01',
    title: 'Monte sua estante',
    text: 'Cadastre os livros que você já leu. A busca automática por ISBN preenche capa, autor e editora em um clique.',
  },
  {
    number: '02',
    title: 'Encontre a próxima leitura',
    text: 'Explore o catálogo por título, autor, cidade ou condição. Salve os que te interessam.',
  },
  {
    number: '03',
    title: 'Proponha a troca',
    text: 'Ofereça um dos seus livros. Quando ambos aceitarem, o contato é liberado e vocês combinam a entrega.',
  },
];

export default function Features() {
  return (
    <section className="section">
      <div className="container">
        <header className="section-head section-head--center">
          <span className="section-eyebrow">Como funciona</span>
          <h2>Simples como folhear um livro</h2>
          <p className="section-head__lead">
            Três passos entre o livro parado na estante e a próxima leitura.
          </p>
        </header>

        <ol className="steps">
          {STEPS.map((s) => (
            <li key={s.number} className="step">
              <span className="step__number" aria-hidden="true">{s.number}</span>
              <h3 className="step__title">{s.title}</h3>
              <p className="step__text">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}