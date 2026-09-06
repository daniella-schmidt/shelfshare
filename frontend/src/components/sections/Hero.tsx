// src/components/sections/Hero.tsx
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="hero-section hero-1 fix">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-xl-8 col-lg-6">
            <div className="hero-items">
              <div className="book-shape">
                <img src="/assets/img/hero/book.png" alt="shape" />
              </div>
              <div className="frame-shape1 float-bob-x">
                <img src="/assets/img/hero/frame.png" alt="shape" />
              </div>
              <div className="frame-shape2 float-bob-y">
                <img src="/assets/img/hero/frame-2.png" alt="shape" />
              </div>
              <div className="hero-content">
                <h6 className="wow fadeInUp" data-wow-delay=".3s">
                  Até 30% Off
                </h6>
                <h1 className="wow fadeInUp" data-wow-delay=".5s">
                  Encontre seu próximo <br /> livro com o melhor preço
                </h1>
                <div className="form-clt wow fadeInUp" data-wow-delay=".9s">
                  <button type="submit" className="theme-btn">
                    Comprar agora <i className="fa-solid fa-arrow-right-long"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-xl-4 col-lg-6">
            <div className="girl-image">
              <img className="float-bob-x" src="/assets/img/hero/hero-girl-1.png" alt="girl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;