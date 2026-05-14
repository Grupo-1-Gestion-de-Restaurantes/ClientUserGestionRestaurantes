import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import star from '../../../assets/img/star.svg';

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

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[var(--color-background-base)] flex flex-col items-center justify-center px-8 md:px-20 py-20 overflow-hidden"
    >
      {/* Floating stars */}
      <img src={star} alt="" className="absolute top-[10%] left-[8%] w-10 h-10 animate-float pointer-events-none" />
      <img src={star} alt="" className="absolute bottom-[15%] right-[10%] w-8 h-8 animate-float-delay pointer-events-none" />
      <img src={star} alt="" className="absolute top-[40%] right-[5%] w-6 h-6 animate-twinkle pointer-events-none" />

      <div className="max-w-4xl text-center">
        <h2 className="gift-line font-bangers text-5xl md:text-7xl lg:text-8xl font-black text-[var(--color-secondary)] leading-tight tracking-wide">
          reGáLaLO a uN aMiGo
        </h2>
        <h2 className="gift-line font-bangers text-5xl md:text-7xl lg:text-8xl font-black text-[var(--color-secondary)] leading-tight tracking-wide mt-2">
          o QuÉdAtELo ToDo
        </h2>
        <h2 className="gift-line font-bangers text-5xl md:text-7xl lg:text-8xl font-black text-[var(--color-secondary)] leading-tight tracking-wide mt-2">
          PaRa Ti
        </h2>
        <p className="gift-line text-2xl md:text-3xl font-bold text-white/70 mt-8">
          No te juzgaremos 
        </p>
      </div>
    </section>
  );
};
