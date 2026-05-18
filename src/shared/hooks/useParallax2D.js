import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useParallax2D — Hook compartido para parallax 2D nativo con GSAP.
 *
 * Aplica tweens con `scrub:true` a los elementos indicados por selector
 * dentro de `scopeRef`. Respeta `prefers-reduced-motion` (early return).
 *
 * @param {React.RefObject} scopeRef - Contenedor que actúa como ScrollTrigger.trigger
 * @param {Array<{selector:string, yPercent?:number, xPercent?:number, rotate?:number, scale?:number, start?:string, end?:string}>} layers
 * @param {Array} deps - Dependencias para re-ejecutar
 */
export const useParallax2D = (scopeRef, layers = [], deps = []) => {
  useGSAP(
    () => {
      if (typeof window === 'undefined') return;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;
      if (!scopeRef?.current || !layers.length) return;

      layers.forEach((layer) => {
        const {
          selector,
          yPercent = 0,
          xPercent = 0,
          rotate = 0,
          scale,
          start = 'top bottom',
          end = 'bottom top',
        } = layer;

        const targets = scopeRef.current.querySelectorAll(selector);
        if (!targets.length) return;

        const toVars = { yPercent, xPercent, rotate, ease: 'none' };
        if (typeof scale === 'number') toVars.scale = scale;

        gsap.to(targets, {
          ...toVars,
          scrollTrigger: {
            trigger: scopeRef.current,
            start,
            end,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: scopeRef, dependencies: deps },
  );
};
