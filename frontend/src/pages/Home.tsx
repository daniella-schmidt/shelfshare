import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Hero from '../components/sections/Hero';
import TrustBar from '../components/sections/TrustBar';
import Features from '../components/sections/Features';
import BookSlider from '../components/sections/BookSlider';
import HowItWorks from '../components/sections/HowItWorks';
import FAQ from '../components/sections/FAQ';
import CTABanner from '../components/sections/CTABanner';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Features />
        <BookSlider />
        <HowItWorks />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}