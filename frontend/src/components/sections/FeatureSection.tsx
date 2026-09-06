import React from 'react';

const FeatureSection: React.FC = () => {
  return (
    <section className="feature-section fix section-padding">
      <div className="container-fluid">
        <div className="feature-wrapper">
          <div className="feature-box-items wow fadeInUp" data-wow-delay=".2s">
            <div className="icon"><i className="icon-icon-1"></i></div>
            <div className="content">
              <h3>Troca segura</h3>
              <p>Garantia de devolução</p>
            </div>
          </div>
          <div className="feature-box-items wow fadeInUp" data-wow-delay=".4s">
            <div className="icon"><i className="icon-icon-2"></i></div>
            <div className="content">
              <h3>Pagamento seguro</h3>
              <p>30% off ao assinar</p>
            </div>
          </div>
          <div className="feature-box-items wow fadeInUp" data-wow-delay=".6s">
            <div className="icon"><i className="icon-icon-3"></i></div>
            <div className="content">
              <h3>Suporte de qualidade</h3>
              <p>Sempre online 24/7</p>
            </div>
          </div>
          <div className="feature-box-items wow fadeInUp" data-wow-delay=".8s">
            <div className="icon"><i className="icon-icon-4"></i></div>
            <div className="content">
              <h3>Ofertas diárias</h3>
              <p>20% off ao assinar</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;