import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas } from '@react-three/fiber';
import { ScrollScene } from './ScrollScene';
import { useScrollStore } from '../store/useScrollStore';

gsap.registerPlugin(ScrollTrigger);

export const HowItWorks = () => {
  const containerRef = useRef(null);
  const setProgress = useScrollStore((state) => state.setProgress);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      
      // Creamos la línea de tiempo atada al scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=5000", // 5000px de scroll para recorrer todo el tubo 3D
          scrub: 0.5, // Suavizado nativo del scroll
          pin: true,  // Ancla la pantalla mientras haces scroll
          onUpdate: (self) => {
            // Actualizamos nuestro store Zustand con el progreso (de 0.000 a 1.000)
            setProgress(self.progress);
          }
        }
      });

      // Animaciones de la UI (HTML) que aparecen en ciertos momentos del viaje 3D
      // El texto "ORDER" aparece al principio y luego se desvanece
      tl.fromTo('.step-1', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 })
        .to('.step-1', { opacity: 0, y: -50, duration: 1 })
        
      // El texto "PREPARE" aparece más adelante en el túnel
        .fromTo('.step-2', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 })
        .to('.step-2', { opacity: 0, y: -50, duration: 1 })
        
      // El texto "DELIVER" aparece al final
        .fromTo('.step-3', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 });

    }, containerRef);

    return () => ctx.revert(); // Evitamos fugas de memoria
  }, [setProgress]);

  return (
    <div ref={containerRef} className="w-full h-screen bg-black relative overflow-hidden text-white font-sans">
      
      {/* CAPA 1: El Canvas 3D que llena toda la pantalla al fondo */}
      <div className="absolute inset-0 z-0">
        <Canvas gl={{ antialias: true, alpha: false }}>
          <ScrollScene />
        </Canvas>
      </div>

      {/* CAPA 2: La UI que flota por encima del 3D */}
      <div className="relative z-10 w-full h-full pointer-events-none flex flex-col justify-center px-10 md:px-32">
        
        <div className="step-1 absolute">
          <h2 className="text-6xl md:text-8xl font-black text-[#f4be2c] drop-shadow-lg">01. ORDER</h2>
          <p className="text-xl md:text-2xl max-w-lg mt-4 font-medium drop-shadow-md bg-black/30 p-2 rounded">
            Select your intergalactic meal directly from our terminal.
          </p>
        </div>
        
        <div className="step-2 absolute opacity-0">
          <h2 className="text-6xl md:text-8xl font-black text-[#f4be2c] drop-shadow-lg">02. PREPARE</h2>
          <p className="text-xl md:text-2xl max-w-lg mt-4 font-medium drop-shadow-md bg-black/30 p-2 rounded">
            Our alien chefs cook your meal at the speed of light inside the stellar oven.
          </p>
        </div>

        <div className="step-3 absolute opacity-0">
          <h2 className="text-6xl md:text-8xl font-black text-[#f4be2c] drop-shadow-lg">03. DELIVER</h2>
          <p className="text-xl md:text-2xl max-w-lg mt-4 font-medium drop-shadow-md bg-black/30 p-2 rounded">
            Straight to your planetary coordinates. Hot and ready.
          </p>
        </div>

      </div>
    </div>
  );
};