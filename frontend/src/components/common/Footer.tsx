import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer-section footer-bg">
      <div className="container">
        <div className="contact-info-area">
          <div className="contact-info-items wow fadeInUp" data-wow-delay=".2s">
            <div className="icon"><i className="icon-icon-5"></i></div>
            <div className="content">
              <p>Call Us 7/24</p>
              <h3><a href="tel:+2085550112">+208-555-0112</a></h3>
            </div>
          </div>
          <div className="contact-info-items wow fadeInUp" data-wow-delay=".4s">
            <div className="icon"><i className="icon-icon-6"></i></div>
            <div className="content">
              <p>Make a Quote</p>
              <h3><a href="mailto:example@gmail.com">example@gmail.com</a></h3>
            </div>
          </div>
          <div className="contact-info-items wow fadeInUp" data-wow-delay=".6s">
            <div className="icon"><i className="icon-icon-7"></i></div>
            <div className="content">
              <p>Opening Hour</p>
              <h3>Sunday - Fri: 9 aM - 6 pM</h3>
            </div>
          </div>
          <div className="contact-info-items wow fadeInUp" data-wow-delay=".8s">
            <div className="icon"><i className="icon-icon-8"></i></div>
            <div className="content">
              <p>Location</p>
              <h3>4517 Washington ave.</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-widgets-wrapper">
        <div className="plane-shape float-bob-y">
          <img src="/assets/img/plane-shape.png" alt="plane" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".2s">
              <div className="single-footer-widget">
                <div className="widget-head">
                  <a href="/"><img src="/assets/img/logo/white-logo.svg" alt="logo" /></a>
                </div>
                <div className="footer-content">
                  <p>Phasellus ultricies aliquam volutpat ullamcorper laoreet neque, a lacinia curabitur lacinia mollis</p>
                  <div className="social-icon d-flex align-items-center">
                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-youtube"></i></a>
                    <a href="#"><i className="fab fa-linkedin-in"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 ps-lg-5 wow fadeInUp" data-wow-delay=".4s">
              <div className="single-footer-widget">
                <div className="widget-head"><h3>Costumers Support</h3></div>
                <ul className="list-area">
                  <li><a href="/shop"><i className="fa-solid fa-chevrons-right"></i> Store List</a></li>
                  <li><a href="/contact"><i className="fa-solid fa-chevrons-right"></i> Opening Hours</a></li>
                  <li><a href="/contact"><i className="fa-solid fa-chevrons-right"></i> Contact Us</a></li>
                  <li><a href="/contact"><i className="fa-solid fa-chevrons-right"></i> Return Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 ps-lg-5 wow fadeInUp" data-wow-delay=".6s">
              <div className="single-footer-widget">
                <div className="widget-head"><h3>Categories</h3></div>
                <ul className="list-area">
                  <li><a href="/shop"><i className="fa-solid fa-chevrons-right"></i> Novel Books</a></li>
                  <li><a href="/shop"><i className="fa-solid fa-chevrons-right"></i> Poetry Books</a></li>
                  <li><a href="/contact"><i className="fa-solid fa-chevrons-right"></i> Political Books</a></li>
                  <li><a href="/contact"><i className="fa-solid fa-chevrons-right"></i> History Books</a></li>
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".8s">
              <div className="single-footer-widget">
                <div className="widget-head"><h3>Newsletter</h3></div>
                <div className="footer-content">
                  <p>Sign up to searing weekly newsletter to get the latest updates.</p>
                  <div className="footer-input">
                    <input type="email" id="email2" placeholder="Enter Email Address" />
                    <button className="newsletter-btn" type="submit">
                      <i className="fa-regular fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-wrapper d-flex align-items-center justify-content-between">
            <p className="wow fadeInLeft" data-wow-delay=".3s">
              © All Copyright 2024 by <a href="/">Bookle</a>
            </p>
            <ul className="brand-logo wow fadeInRight" data-wow-delay=".5s">
              <li><a href="#"><img src="/assets/img/visa-logo.png" alt="visa" /></a></li>
              <li><a href="#"><img src="/assets/img/mastercard.png" alt="mastercard" /></a></li>
              <li><a href="#"><img src="/assets/img/payoneer.png" alt="payoneer" /></a></li>
              <li><a href="#"><img src="/assets/img/affirm.png" alt="affirm" /></a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;