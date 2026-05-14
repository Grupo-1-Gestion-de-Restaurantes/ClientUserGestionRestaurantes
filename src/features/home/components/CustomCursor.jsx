import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import cursor from "../../../assets/img/cursor.svg";   

export const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    // 1. Ocultar cursor nativo en el body
    document.body.style.cursor = 'none';

    // 2. Mover nuestro SVG con GSAP de forma suavizada
    const moveCursor = (e) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1, // Un ligero retraso para suavidad (Smooth trailing)
        ease: 'power2.out'
      });
    };

    // 3. Efectos Hover en botones y enlaces
    const handleMouseOver = (e) => {
      if (e.target.tagName.toLowerCase() === 'button' || e.target.closest('button')) {
        gsap.to(cursorRef.current, { scale: 1.5, duration: 0.2 });
      }
    };
    const handleMouseOut = () => {
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      // Limpieza (CleanUp) vital para evitar Memory Leaks si el usuario va al Dashboard
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
    >
      <img src={cursor} alt="cursor" className="w-full h-full" />
    </div>
  );
};