import { useState, useEffect, useRef } from 'react';
import { CustomCursor } from '../components/CustomCursor';
import { LoadingScreen } from '../components/LoadingScreen';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { HowItWorks } from '../components/HowItWorks';
import { GiftSection } from '../components/GiftSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { LocationsSection } from '../components/LocationsSection';
import { PartnersMarquee } from '../components/PartnersMarquee';
import { Footer } from '../components/Footer';

export const HomePage = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const heroRef = useRef(null);

  // ── Canvas optimization: pause Hero Canvas when out of viewport ──
  useEffect(() => {
    if (!isStarted || !heroRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(heroRef.current);

    return () => observer.disconnect();
  }, [isStarted]);

  return (
    <main className="relative bg-[var(--color-background-base)] min-h-screen font-sans">
      
      {/* 1. Custom Cursor */}
      <CustomCursor />

      {/* 2. Loading Screen (slides up on START) */}
      {!isStarted && <LoadingScreen onStart={() => setIsStarted(true)} />}

      {/* 3. Main Content — rendered behind LoadingScreen so Canvas initializes at full size */}
      <div 
        className={`transition-opacity duration-700 ${
          isStarted ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Navbar — fixed, always visible */}
        <Navbar />

        {/* Hero — pauses its Canvas when scrolled out of view */}
        <div ref={heroRef}>
          <HeroSection paused={!heroInView} />
        </div>

        {/* How It Works — scroll-pinned with its own Canvas */}
        <HowItWorks />

        {/* Gift Section */}
        <GiftSection />

        {/* Features */}
        <FeaturesSection />

        {/* Locations */}
        <LocationsSection />

        {/* Partners Marquee */}
        <PartnersMarquee />

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
};