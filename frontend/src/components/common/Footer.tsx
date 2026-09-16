import { Link } from 'react-router-dom';
import catLogo from '../../assets/cat.png';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand">
              <span className="brand__mark" aria-hidden>
                <img src={catLogo} alt="" />
              </span>
              <span className="brand__name">
                Shelf<em>Share</em>
              </span>
            </Link>
            <p>
              Compartilhe conhecimento. Troque livros com leitores da sua comunidade
              e dê uma nova vida à sua estante.
            </p>
          </div>

          <div className="footer-col">
            <h4>Plataforma</h4>
            <ul>
              <li><Link to="/livros">Explorar livros</Link></li>
              <li><Link to="/trocas">Trocas</Link></li>
              <li><Link to="/minha-estante">Minha estante</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Conta</h4>
            <ul>
              <li><Link to="/login">Entrar</Link></li>
              <li><Link to="/register">Cadastrar</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Suporte</h4>
            <ul>
              <li><a href="mailto:contato@shelfshare.app">contato@shelfshare.app</a></li>
              <li><a href="#faq">Perguntas frequentes</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ShelfShare. Todos os direitos reservados.</span>
          <span>Feito com ♥ para leitores</span>
        </div>
      </div>
    </footer>
  );
}