import React, { useEffect, useRef } from 'react';

const categories = [
  { id: 1, name: 'Romance Books (80)', image: '/assets/img/book-categori/01.png' },
  { id: 2, name: 'Design Low Book (6)', image: '/assets/img/book-categori/02.png' },
  { id: 3, name: 'safe Home (5)', image: '/assets/img/book-categori/03.png' },
  { id: 4, name: 'Grow flower (7)', image: '/assets/img/book-categori/04.png' },
  { id: 5, name: 'Adventure book (4)', image: '/assets/img/book-categori/05.png' },
];

const CategorySlider: React.FC = () => {
  const swiperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (swiperRef.current && (window as any).Swiper) {
      new (window as any).Swiper(swiperRef.current, {
        spaceBetween: 30,
        speed: 2000,
        loop: true,
        navigation: {
          nextEl: '.array-prev',
          prevEl: '.array-next',
        },
        breakpoints: {
          1399: { slidesPerView: 5 },
          1199: { slidesPerView: 4 },
          991: { slidesPerView: 3 },
          767: { slidesPerView: 2 },
          575: { slidesPerView: 1 },
        },
      });
    }
  }, []);

  return (
    <section className="book-catagories-section fix section-padding">
      <div className="container-fluid">
        <div className="book-catagories-wrapper">
          <div className="section-title text-center">
            <h2 className="wow fadeInUp" data-wow-delay=".3s">Categorias Principais</h2>
          </div>
          <div className="array-button">
            <button className="array-prev"><i className="fal fa-arrow-left"></i></button>
            <button className="array-next"><i className="fal fa-arrow-right"></i></button>
          </div>
          <div className="swiper book-catagories-slider" ref={swiperRef}>
            <div className="swiper-wrapper">
              {categories.map((cat) => (
                <div className="swiper-slide" key={cat.id}>
                  <div className="book-catagories-items">
                    <div className="book-thumb">
                      <img src={cat.image} alt={cat.name} />
                      <div className="circle-shape">
                        <img src="/assets/img/book-categori/circle-shape.png" alt="circle" />
                      </div>
                    </div>
                    <div className="number">{String(cat.id).padStart(2, '0')}</div>
                    <h3><a href="/books">{cat.name}</a></h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySlider;