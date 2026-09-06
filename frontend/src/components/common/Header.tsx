// src/components/common/Header.tsx
import React from 'react';

const Header: React.FC = () => {
  return (
    <>
      {/* Top header - igual ao template */}
      <div className="header-top-1">
        <div className="container">
          <div className="header-top-wrapper">
            {/* Adicione aqui os elementos do cabeçalho superior, como informações de contato, links de login, etc.
            <ul className="contact-list">
              <li>
                <i className="fa-regular fa-phone"></i>
                <a href="tel:+20866660112">+208-6666-0112</a>
              </li>
              <li>
                <i className="far fa-envelope"></i>
                <a href="mailto:info@example.com">info@example.com</a>
              </li>
              <li>
                <i className="far fa-clock"></i>
                <span>Sunday - Fri: 9 aM - 6 pM</span>
              </li>
            </ul> */}
            <ul className="list">
              <li><i className="fa-light fa-comments"></i><a href="/contact">Live Chat</a></li>
              <li><i className="fa-light fa-user"></i>
                <button data-bs-toggle="modal" data-bs-target="#loginModal">
                  Login
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main header - estrutura original do Bookle */}
      <header className="header-1">
        <div className="mega-menu-wrapper">
          <div className="header-main">
            <div className="container">
              <div className="row">
                <div className="col-6 col-md-6 col-lg-10 col-xl-8 col-xxl-10">
                  <div className="header-left">
                    <div className="logo">
                      <a href="/" className="header-logo">
                        <img src="/assets/img/logo/white-logo.svg" alt="ShelfShare" />
                      </a>
                    </div>
                    <div className="mean__menu-wrapper">
                      <div className="main-menu">
                        <nav>
                          <ul>
                            <li>
                              <a href="/">
                                Home
                                <i className="fas fa-angle-down"></i>
                              </a>
                              <ul className="submenu">
                                <li><a href="/">Home 01</a></li>
                              </ul>
                            </li>
                            <li>
                              <a href="/books">
                                Livros
                                <i className="fas fa-angle-down"></i>
                              </a>
                              <ul className="submenu">
                                <li><a href="/books">Todos os Livros</a></li>
                                <li><a href="/books?category=romance">Romance</a></li>
                                <li><a href="/books?category=ficcao">Ficção</a></li>
                                <li><a href="/books?category=aventura">Aventura</a></li>
                              </ul>
                            </li>
                            <li className="has-dropdown">
                              <a href="/about">
                                Sobre
                                <i className="fas fa-angle-down"></i>
                              </a>
                              <ul className="submenu">
                                <li><a href="/about">Sobre Nós</a></li>
                                <li className="has-dropdown">
                                  <a href="/team">
                                    Autores
                                    <i className="fas fa-angle-down"></i>
                                  </a>
                                  <ul className="submenu">
                                    <li><a href="/team">Autores</a></li>
                                    <li><a href="/team-details">Perfil do Autor</a></li>
                                  </ul>
                                </li>
                              </ul>
                            </li>
                            <li>
                              <a href="/contact">Contato</a>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-6 col-lg-2 col-xl-4 col-xxl-2">
                  <div className="header-right">
                    <div className="category-oneadjust gap-6 d-flex align-items-center">
                      <div className="icon">
                        <i className="fa-sharp fa-solid fa-grid-2"></i>
                      </div>
                      <select name="cate" className="category">
                        <option value="1">Categoria</option>
                        <option value="1">Web Design</option>
                        <option value="1">Web Development</option>
                      </select>
                      <form action="#" className="search-toggle-box d-md-block">
                        <div className="input-area">
                          <input type="text" placeholder="Buscar livro..." />
                          <button className="cmn-btn">
                            <i className="far fa-search"></i>
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="menu-cart">
                      <a href="/wishlist" className="cart-icon">
                        <i className="fa-regular fa-heart"></i>
                      </a>
                      <a href="/cart" className="cart-icon">
                        <i className="fa-regular fa-cart-shopping"></i>
                      </a>
                      <div className="header-humbager ml-30">
                        <a className="sidebar__toggle" href="#">
                          <div className="bar-icon-2">
                            <img src="/assets/img/icon/icon-13.svg" alt="menu" />
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;