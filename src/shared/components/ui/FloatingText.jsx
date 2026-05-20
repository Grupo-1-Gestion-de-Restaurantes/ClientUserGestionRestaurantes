import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useUIStore } from '../../store/useUIStore';

gsap.registerPlugin(useGSAP);

export const FloatingText = ({
  text,
  wrapperClassName = '',
  letterClassName = '',
}) => {
  const rootRef = useRef(null);
  const isIntroLocked = useUIStore((s) => s.isIntroLocked);

  useGSAP(
    () => {
      if (typeof window === 'undefined') return;
      if (!window.matchMedia?.('(hover: hover)').matches) return;
      if (isIntroLocked) return;

      const letters = rootRef.current?.querySelectorAll('[data-floating-letter]');
      if (!letters?.length) return;

      const cleanups = [];

      letters.forEach((el) => {
        gsap.set(el, { yPercent: 0 });

        const onEnter = () => {
          gsap.to(el, {
            yPercent: -15,
            duration: 0.12,
            ease: 'power3.out',
            overwrite: true,
          });
        };

        const onLeave = () => {
          gsap.to(el, {
            yPercent: 0,
            duration: 0.22,
            ease: 'power3.out',
            overwrite: true,
          });
        };

        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);

        cleanups.push(() => {
          el.removeEventListener('mouseenter', onEnter);
          el.removeEventListener('mouseleave', onLeave);
        });
      });

      return () => {
        cleanups.forEach((fn) => fn());
      };
    },
    { scope: rootRef, dependencies: [isIntroLocked] },
  );

  const pointerStyle = isIntroLocked ? { pointerEvents: 'none' } : undefined;

  return (
    <span ref={rootRef} className={wrapperClassName} style={pointerStyle}>
      {String(text)
        .split('')
        .map((char, i) => (
          <span
            key={`${char}-${i}`}
            data-floating-letter
            className={letterClassName}
          >
            {char}
          </span>
        ))}
    </span>
  );
};
