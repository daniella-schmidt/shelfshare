import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Hero from '../components/sections/Hero';
import FeatureSection from '../components/sections/FeatureSection';
import BookSlider from '../components/sections/BookSlider';
import CategorySlider from '../components/sections/CategorySlider';
import CTABanner from '../components/sections/CTABanner';

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <FeatureSection />
      <BookSlider />
      <CategorySlider />
      <CTABanner />
      <Footer />
    </>
  );
};

export default Home;