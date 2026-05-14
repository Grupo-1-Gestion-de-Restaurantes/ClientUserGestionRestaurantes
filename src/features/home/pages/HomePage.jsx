import { useState } from 'react';
import { CustomCursor } from '../components/CustomCursor';
import { LoadingScreen } from '../components/LoadingScreen';
import { HeroSection } from '../components/HeroSection';
import { HowItWorks } from '../components/HowItWorks';

export const HomePage = () => {
  // Estado para controlar cuándo el usuario hace clic en "START" en el loader
  const [isStarted, setIsStarted] = useState(false);

  return (
    // Es vital el overflow-hidden en el padre si queremos que el scroll lo maneje GSAP internamente
    <main className="relative bg-[#f4be2c] min-h-screen font-sans">
      
      {/* 1. Cursor Global de la Landing */}
      <CustomCursor />

      {/* 2. Pantalla de Carga (Desaparece al hacer click en START) */}
      {!isStarted && <LoadingScreen onStart={() => setIsStarted(true)} />}

      {/* 3. El Contenido Principal */}
      {/* Usamos CSS para ocultarlo visualmente sin desmontarlo, así el 3D carga en segundo plano */}
      <div 
        className={`transition-opacity duration-1000 ${
          isStarted ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden pointer-events-none'
        }`}
      >
        <HeroSection />
        <HowItWorks />
      </div>
      
    </main>
  );
};