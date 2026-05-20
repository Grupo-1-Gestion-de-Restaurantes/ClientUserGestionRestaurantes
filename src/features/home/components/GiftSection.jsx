import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import star from '../../../assets/img/star.svg';
import { useParallax2D } from '../../../shared/hooks/useParallax2D';

gsap.registerPlugin(ScrollTrigger);

export const GiftSection = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      '.gift-line',
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, { scope: sectionRef });

  // Parallax 2D nativo (GSAP scrub) sobre estrellas y blob de fondo
  useParallax2D(sectionRef, [
    { selector: '.gift-star-a', yPercent: -60 },
    { selector: '.gift-star-b', yPercent: 50 },
    { selector: '.gift-star-c', yPercent: -30, xPercent: -20 },
    { selector: '.gift-blob', yPercent: -25, scale: 1.1 },
  ]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-transparent flex flex-col items-center justify-center px-8 md:px-20 py-24 overflow-hidden"
    >
      {/* Texturas de fondo */}
      <div className="absolute inset-0 bg-grid-faint pointer-events-none" aria-hidden />
      <div className="gift-blob absolute top-[15%] right-[-10%] w-[480px] h-[480px] bg-radial-secondary opacity-60 pointer-events-none" aria-hidden />

      {/* Floating stars con parallax */}
      <img src={star} alt="" aria-hidden className="gift-star-a absolute top-[10%] left-[8%] w-10 h-10 animate-float pointer-events-none" />
      <img src={star} alt="" aria-hidden className="gift-star-b absolute bottom-[15%] right-[10%] w-8 h-8 animate-float-delay pointer-events-none" />
      <img src={star} alt="" aria-hidden className="gift-star-c absolute top-[40%] right-[5%] w-6 h-6 animate-twinkle pointer-events-none" />

      <div className="relative max-w-4xl text-center">
        <p className="gift-line text-secondary font-bangers tracking-[0.3em] text-sm md:text-base uppercase mb-4">
          Gift Cards Express
        </p>
        <h2 className="gift-line font-bangers text-5xl md:text-7xl lg:text-8xl font-black text-on-base leading-tight tracking-wide">
          Regálalo a un <span className="text-secondary">amigo</span>
        </h2>
        <h2 className="gift-line font-bangers text-5xl md:text-7xl lg:text-8xl font-black text-on-base leading-tight tracking-wide mt-2">
          o quédatelo <span className="text-primary">todo</span>
        </h2>
        <h2 className="gift-line font-bangers text-5xl md:text-7xl lg:text-8xl font-black text-on-base leading-tight tracking-wide mt-2">
          para ti
        </h2>
        <p className="gift-line text-2xl md:text-3xl font-bold text-on-base-muted mt-8">
          No te juzgaremos
        </p>
      </div>
    </section>
  );
};
