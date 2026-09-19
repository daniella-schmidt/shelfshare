import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import BookSlider from '../components/sections/BookSlider';
import FAQ from '../components/sections/FAQ';
import CTABanner from '../components/sections/CTABanner';

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <BookSlider />
        <Features />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}