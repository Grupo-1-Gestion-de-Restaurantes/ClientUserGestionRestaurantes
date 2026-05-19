import { Suspense, useRef, useLayoutEffect } from 'react';
import { Environment } from '@react-three/drei';
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
          end: "+=6000", 
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
      className="w-full h-screen bg-transparent relative overflow-hidden mb-[30vh]"
    >
      {/* ── Radial red glow behind 3D (énfasis sin saturar) ── */}
      <div className="absolute inset-0 bg-radial-primary mask-radial-fade pointer-events-none z-0" aria-hidden />
      <div className="absolute inset-0 bg-grid-faint opacity-60 pointer-events-none z-0" aria-hidden />

      {/* ── 3D Canvas (full background) ── */}
      <div className="absolute inset-0 z-[1]">
        <Canvas
          gl={{ antialias: true, alpha: true }}
          camera={{ near: 0.1, far: 100000 }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
          shadows
        >
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
        <p className="text-secondary font-bangers tracking-[0.3em] text-sm md:text-base uppercase mb-2">
          Paso a paso
        </p>
        <h2
          className="font-bangers text-5xl md:text-7xl lg:text-8xl font-black text-on-base text-stroke drop-shadow-lg tracking-wider mb-5"
        >
          CÓMO <span className="text-secondary">FUNCIONA</span>
        </h2>
        
        {/* Step Pills */}
        <div className="flex items-center gap-3 flex-wrap">
          {STEPS.map((stepName, i) => {
            const isActive = i === activeStep;
            return (
              <div 
                key={i}
                className={`border-[3px] border-stroke-strong rounded-full font-black text-base md:text-lg transition-all duration-300 shadow-brutal-sm flex items-center justify-center select-none
                ${isActive
                  ? 'bg-secondary text-on-secondary px-5 md:px-6 py-2'
                  : 'bg-surface-2 text-on-base w-10 h-10 md:w-12 md:h-12'
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