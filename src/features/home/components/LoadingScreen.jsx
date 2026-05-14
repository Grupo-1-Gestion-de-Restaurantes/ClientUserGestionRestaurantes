import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useProgress } from '@react-three/drei';
import star from '../../../assets/img/star.svg';

// Registramos el plugin de React para GSAP
gsap.registerPlugin(useGSAP);

export const LoadingScreen = ({ onStart }) => {
  const containerRef = useRef(null);
  
  // Mentoría PRO: Mezclamos tu animación GSAP con la carga REAL de los modelos 3D
  const { progress } = useProgress(); 
  const isLoaded = progress === 100;

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. Aparecen las estrellas
    tl.to('.star', {
      opacity: 1,
      stagger: 0.25,
      duration: 0.4,
    })
    // 2. Desaparecen las estrellas
    .to('.stars', {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        gsap.set('.stars', { display: 'none' });
      }
    })
    // 3. Entran las letras desde la izquierda
    .fromTo(
      '.logo-letter',
      { x: -60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.5,
        ease: "power3.out",
      }
    )
    // 4. Efecto rebote (Yoyo)
    .to('.logo-letter', {
      y: -20,
      stagger: 0.08,
      duration: 0.25,
      ease: "power2.out",
      repeat: 2, 
      yoyo: true, 
    })
    // 5. Aterrizaje final de las letras
    .to('.logo-letter', {
      y: 0,
      stagger: 0.08,
      duration: 0.4,
      ease: "bounce.out",
    })
    // 6. Aparece el sub-logo
    .to('.sub-logo', {
      opacity: 1,
      y: -10,
      duration: 0.4,
    });

  }, { scope: containerRef });

  // Animación separada para el botón: Solo aparece si GSAP terminó Y los modelos 3D ya cargaron
  useGSAP(() => {
    if (isLoaded) {
      gsap.to('.start-btn', {
        opacity: 1,
        y: -10,
        duration: 0.4,
        pointerEvents: 'auto'
      });
    }
  }, [isLoaded]);

  // Texto a animar (simulando LogoAnimation)
  const title = "PLANETONO";

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-red-600 flex flex-col items-center justify-center relative z-50 fixed inset-0"
    >
      {/* Estrellas */}
      <div className="stars flex gap-2 h-[60px] items-center justify-center absolute top-1/4">
        {[...Array(5)].map((_, i) => (
          <img key={i} src={star} alt="star" width={60} height={60} className="star opacity-0" />
        ))}
      </div>

      {/* Reemplazo de LogoAnimation */}
      <div className="flex flex-col items-center">
        <div className="flex overflow-hidden pb-4">
          {title.split('').map((char, i) => (
            <span key={i} className="logo-letter text-7xl font-extrabold text-white opacity-0 inline-block">
              {char}
            </span>
          ))}
        </div>
        {/* Barra de progreso de carga real bajo el logo */}
        <div className="sub-logo opacity-0 w-64 h-2 bg-black/20 rounded-full mt-4 overflow-hidden">
             <div className="h-full bg-white transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="absolute bottom-10 flex flex-col gap-8 items-center">
        <button
          className="start-btn opacity-0 pointer-events-none bg-white text-black text-2xl font-bold px-8 py-3 rounded-lg border-2 border-black shadow-[5px_4px_black] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] active:scale-95"
          onClick={onStart}
        >
          START
        </button>

        <p className="text-white/80 text-base flex items-center gap-2 font-medium">
          Immersive sound ahead. Use headphones for best effect <span className="text-lg">🎧</span>
        </p>
      </div>
    </div>
  );
};