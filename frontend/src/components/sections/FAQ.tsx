const FAQS = [
  {
    q: 'Como funciona a troca de livros?',
    a: 'Você cadastra os livros que já leu, procura alguém que tenha o título que você quer e propõe uma troca. Quando ambos aceitarem, combinam a entrega ou o envio diretamente pela plataforma.',
  },
  {
    q: 'A ShelfShare cobra alguma taxa?',
    a: 'Não. A troca é 100% gratuita para todos os leitores — sem comissões, sem taxas escondidas e sem assinatura.',
  },
  {
    q: 'Preciso estar em uma cidade grande?',
    a: 'Não. O catálogo é nacional e você pode filtrar por cidade e estado. Quando não houver leitores por perto, é possível combinar envio por correio diretamente com a outra pessoa.',
  },
  {
    q: 'Como sei que a troca é segura?',
    a: 'Cada perfil passa por verificação e toda troca precisa ser confirmada pelas duas partes. As avaliações ficam visíveis publicamente para toda a comunidade.',
  },
  {
    q: 'Que tipo de livro posso cadastrar?',
    a: 'Qualquer livro físico em bom estado de leitura — do romance ao técnico, do infantil ao acadêmico. A condição é escolhida por você ao cadastrar.',
  },
  {
    q: 'Posso trocar um livro que já foi trocado antes?',
    a: 'Sim. Uma das ideias da ShelfShare é justamente dar novas vidas aos mesmos livros. Quando ele chegar até você, basta marcá-lo novamente como disponível na sua estante.',
  },
];

export default function FAQ() {
  return (
    <section className="section section--paper" id="faq">
      <div className="container">
        <div className="section-head">
          <div className="section-head__left">
            <span className="section-eyebrow">Dúvidas frequentes</span>
            <h2>Tudo o que você precisa saber</h2>
            <p className="section-head__lead">
              Reunimos as perguntas mais comuns da comunidade sobre como
              funciona a troca de livros na ShelfShare.
            </p>
          </div>
        </div>

        <div className="faq-list">
          {FAQS.map((item) => (
            <details key={item.q} className="faq-item">
              <summary className="faq-item__summary">
                <span className="faq-item__q">{item.q}</span>
                <span className="faq-item__icon" aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </summary>
              <p className="faq-item__a">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}