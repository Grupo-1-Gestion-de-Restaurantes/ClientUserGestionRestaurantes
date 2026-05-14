import { Suspense, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas } from '@react-three/fiber';
import { ScrollScene } from './ScrollScene';
import { useScrollStore } from '../store/useScrollStore';
import star from '../../../assets/img/star.svg';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  "Elige tu combo",
  "Elige tus papas",
  "Escoge un snack",
  "Reclama tu juguete",
];

export const HowItWorks = () => {
  const containerRef = useRef(null);
  const setProgress = useScrollStore((state) => state.setProgress);
  const progress = useScrollStore((state) => state.progress);
  
  const activeStep = Math.min(3, Math.floor(progress * 4));

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=4000", 
          scrub: 0.5,
          pin: true,
          onUpdate: (self) => {
            setProgress(self.progress);
          }
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [setProgress]);

  return (
    <section
      id="how"
      ref={containerRef}
      className="w-full h-screen bg-[var(--color-primary)] relative overflow-hidden"
    >
      {/* ── 3D Canvas (full background) ── */}
      <div className="absolute inset-0 z-0">
        <Canvas gl={{ antialias: true, alpha: true }}>
          <Suspense fallback={null}>
            <ScrollScene />
          </Suspense>
        </Canvas>
      </div>

      {/* ── Decorative stars ── */}
      <img
        src={star}
        alt=""
        className="absolute top-[10%] left-[5%] w-6 h-6 animate-twinkle pointer-events-none z-10"
      />
      <img
        src={star}
        alt=""
        className="absolute top-[25%] right-[10%] w-8 h-8 animate-float pointer-events-none z-10"
      />
      <img
        src={star}
        alt=""
        className="absolute bottom-[30%] right-[5%] w-5 h-5 animate-twinkle pointer-events-none z-10"
        style={{ animationDelay: '1.5s' }}
      />

      {/* ── Bottom overlay: Title + Steps ── */}
      <div className="relative z-10 w-full h-full pointer-events-none flex flex-col justify-end p-8 md:p-14">
        
        {/* Title */}
        <h2 
          className="font-bangers text-5xl md:text-7xl lg:text-8xl font-black text-white text-stroke drop-shadow-lg tracking-wider mb-5"
        >
          CÓMO FUNCIONA
        </h2>
        
        {/* Step Pills */}
        <div className="flex items-center gap-3 flex-wrap">
          {STEPS.map((stepName, i) => {
            const isActive = i === activeStep;
            return (
              <div 
                key={i}
                className={`border-[3px] border-black rounded-full font-black text-base md:text-lg transition-all duration-300 shadow-brutal-sm flex items-center justify-center select-none
                ${isActive 
                  ? 'bg-white text-black px-5 md:px-6 py-2' 
                  : 'bg-white text-black w-10 h-10 md:w-12 md:h-12'
                }`}
              >
                {isActive ? stepName : (i + 1)}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};