import React from 'react';

const CTABanner: React.FC = () => {
  return (
    <section className="cta-banner-section fix section-padding pt-0">
      <div className="container-fluid">
        <div className="cta-banner-wrapper section-padding bg-cover" style={{ backgroundImage: "url('/assets/img/cta-banner.jpg')" }}>
          <div className="book-shape">
            <img src="/assets/img/book-shape.png" alt="book" />
          </div>
          <div className="girl-shape float-bob-x">
            <img src="/assets/img/girl-shape-2.png" alt="girl" />
          </div>
          <div className="cta-content text-center">
            <h2 className="mb-40 wow fadeInUp" data-wow-delay=".3s">
              Ganhe 25% de desconto em todos <br /> os super best-sellers
            </h2>
            <a href="/books" className="theme-btn wow fadeInUp" data-wow-delay=".5s">
              Comprar agora <i className="fa-solid fa-arrow-right-long"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;