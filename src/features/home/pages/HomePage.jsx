import { useState, useEffect, useRef } from "react";
import { LoadingScreen } from "../components/LoadingScreen";
import { Navbar, Footer } from "../../../shared/components/layout";
import { HeroSection } from "../components/HeroSection";
import { HowItWorks } from "../components/HowItWorks";
import { AboutSection } from "../components/AboutSection";
import { GiftSection } from "../components/GiftSection";
import { FeaturesSection } from "../components/FeaturesSection";
import { StatsSection } from "../components/StatsSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { LocationsSection } from "../components/LocationsSection";
import { FAQSection } from "../components/FAQSection";
import { CTAPartners } from "../components/CTAPartners";
import { PartnersMarquee } from "../components/PartnersMarquee";

export const HomePage = () => {
  const [isStarting, setIsStarting] = useState(false); // Portal begins!
  const [isStarted, setIsStarted] = useState(false); // Unmount LoadingScreen entirely
  const [heroInView, setHeroInView] = useState(true);
  const heroRef = useRef(null);

  // ── Lock global scroll until portal sequence is completely finished ──
  useEffect(() => {
    if (!isStarted) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isStarted]);

  // ── Canvas optimization: pause Hero Canvas when out of viewport ──
  useEffect(() => {
    if (!isStarted || !heroRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(heroRef.current);

    return () => observer.disconnect();
  }, [isStarted]);

  return (
    <main className="relative bg-transparent min-h-screen font-sans">
      {/* 2. Loading Screen */}
      {!isStarted && (
        <LoadingScreen 
          onPortalOpen={() => setIsStarting(true)}
          onStart={() => setIsStarted(true)} 
        />
      )}

      {/* 3. Main Content — revealed when portal opens */}
      <div
        className={`transition-opacity duration-1000 ${
          isStarting ? "opacity-100" : "opacity-0 pointer-events-none"
        } relative z-10`}
      >
        {/* Navbar — fixed, always visible */}
        <Navbar />

        {/* Hero — pauses its Canvas when scrolled out of view */}
        <div ref={heroRef}>
          <HeroSection paused={!heroInView} isStarted={isStarting} />
        </div>

        {/* How It Works — scroll-pinned with its own Canvas */}
        <HowItWorks />

        {/* Quiénes somos */}
        <AboutSection />

        {/* Gift Section */}
        <GiftSection />

        {/* Features */}
        <FeaturesSection />

        {/* Stats / números */}
        <StatsSection />

        {/* Testimonios */}
        <TestimonialsSection />

        {/* Locations */}
        <LocationsSection />

        {/* FAQ */}
        <FAQSection />

        {/* CTA hacia /partners */}
        <CTAPartners />

        {/* Partners Marquee */}
        <PartnersMarquee />

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
};
