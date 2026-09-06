import React, { useEffect, useRef } from "react";

const books = [
  { id: 1, title: 'Simple Things You To Save BOOK', author: 'Wilson', price: 30.00, oldPrice: 39.99, image: '/assets/img/book/01.png' },
  { id: 2, title: 'How Deal With Very Bad BOOK', author: 'Esther', price: 39.00, image: '/assets/img/book/02.png' },
  { id: 3, title: 'The Hidden Mystery Behind', author: 'Hawkins', price: 29.00, image: '/assets/img/book/03.png' },
  { id: 4, title: 'Qple GPad With Retina Sisplay', author: 'Albert', price: 19.00, image: '/assets/img/book/04.png' },
  { id: 5, title: 'Flovely and Unicom Erna', author: 'Alexander', price: 30.00, image: '/assets/img/book/05.png' },
];

const BookSlider: React.FC = () => {
  const swiperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (swiperRef.current && (window as any).Swiper) {
      new (window as any).Swiper(swiperRef.current, {
        spaceBetween: 30,
        speed: 2000,
        loop: true,
        autoplay: { delay: 2000, disableOnInteraction: false },
        breakpoints: {
          1499: { slidesPerView: 5 },
          1199: { slidesPerView: 3 },
          767: { slidesPerView: 2 },
          575: { slidesPerView: 1 },
        },
      });
    }
  }, []);

  return (
    <section className="shop-section section-padding fix pt-0">
      <div className="container-fluid">
        <div className="section-title-area">
          <div className="section-title">
            <h2 className="wow fadeInUp" data-wow-delay=".3s">Livros em Destaque</h2>
          </div>
          <a href="/books" className="theme-btn transparent-btn wow fadeInUp" data-wow-delay=".5s">
            Ver todos <i className="fa-solid fa-arrow-right-long"></i>
          </a>
        </div>
        <div className="swiper book-slider" ref={swiperRef}>
          <div className="swiper-wrapper">
            {books.map((book) => (
              <div className="swiper-slide" key={book.id}>
                <div className="shop-box-items style-2">
                  <div className="book-thumb center">
                    <a href={`/books/${book.id}`}>
                      <img src={book.image} alt={book.title} />
                    </a>
                    {book.oldPrice && (
                      <ul className="post-box">
                        <li>Hot</li>
                        <li>-30%</li>
                      </ul>
                    )}
                    <ul className="shop-icon d-grid">
                      <li><a href="#"><i className="far fa-heart"></i></a></li>
                      <li><a href="#"><img className="icon" src="/assets/img/icon/shuffle.svg" alt="compare" /></a></li>
                      <li><a href={`/books/${book.id}`}><i className="far fa-eye"></i></a></li>
                    </ul>
                  </div>
                  <div className="shop-content">
                    <h5>Design Low Book</h5>
                    <h3><a href={`/books/${book.id}`}>{book.title}</a></h3>
                    <ul className="price-list">
                      <li>${book.price.toFixed(2)}</li>
                      {book.oldPrice && <li><del>${book.oldPrice.toFixed(2)}</del></li>}
                    </ul>
                    <ul className="author-post">
                      <li className="authot-list">
                        <span className="thumb">
                          <img src="/assets/img/testimonial/client-1.png" alt="author" />
                        </span>
                        <span className="content">{book.author}</span>
                      </li>
                      <li className="star">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                      </li>
                    </ul>
                  </div>
                  <div className="shop-button">
                    <a href={`/books/${book.id}`} className="theme-btn">
                      <i className="fa-solid fa-basket-shopping"></i> Trocar
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookSlider;