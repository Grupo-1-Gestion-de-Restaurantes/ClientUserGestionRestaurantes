import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { Icon } from '../ui/IconsFloats';

const ALL_ICON_NAMES = [
  'bread',
  'cucumber',
  'potato',
  'knife',
  'chicken',
  'hatchief',
  'fish',
  'chili',
  'cheese',
];

const LINE_ICON_NAMES = ['bread', 'cucumber', 'potato', 'knife'];

function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

export const FloatingBackground = () => {
  const refs = useRef([]);

  const config = useMemo(() => {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const names = isMobile ? LINE_ICON_NAMES : ALL_ICON_NAMES;
    const count = isMobile ? 12 : 22;

    const items = Array.from({ length: count }).map((_, i) => {
      const name = names[i % names.length];
      const size = gsap.utils.random(isMobile ? 28 : 32, isMobile ? 48 : 64, 1);
      const opacity = clamp01(gsap.utils.random(isMobile ? 0.08 : 0.08, isMobile ? 0.18 : 0.26, 0.01));

      return {
        id: `${name}-${i}`,
        name,
        size,
        opacity,
        top: gsap.utils.random(0, 100, 0.1),
        left: gsap.utils.random(0, 100, 0.1),
        rotate: gsap.utils.random(-20, 20, 1),
      };
    });

    return { isMobile, items };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      refs.current.forEach((el) => {
        if (!el) return;

        const baseRotate = Number(el.dataset.baseRotate || 0);

        gsap.set(el, {
          xPercent: -50,
          yPercent: -50,
          rotate: baseRotate,
        });

        const driftX = gsap.utils.random(-70, 70, 1);
        const driftY = gsap.utils.random(-55, 55, 1);
        const rot = baseRotate + gsap.utils.random(-25, 25, 1);
        const dur = gsap.utils.random(18, 34, 0.1);

        const tween = gsap.to(el, {
          x: driftX,
          y: driftY,
          rotate: rot,
          duration: dur,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });

        el._floatingTween = tween;
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (!window.matchMedia?.('(hover: hover)').matches) return undefined;

    const cleanups = [];

    refs.current.forEach((el) => {
      if (!el) return;

      const onEnter = () => {
        el._floatingTween?.pause();
        gsap.to(el, {
          scale: 1.3,
          filter: 'drop-shadow(8px 8px 0px #000)',
          duration: 0.15,
          ease: 'power3.out',
          overwrite: true,
        });
      };

      const onLeave = () => {
        el._floatingTween?.play();
        gsap.to(el, {
          scale: 1,
          filter: 'drop-shadow(0px 0px 0px transparent)',
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

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {config.items.map((item, idx) => (
        <div
          key={item.id}
          ref={(el) => {
            refs.current[idx] = el;
          }}
          data-base-rotate={item.rotate}
          className="absolute will-change-transform pointer-events-auto"
          style={{
            top: `${item.top}%`,
            left: `${item.left}%`,
            opacity: item.opacity,
          }}
          aria-hidden
        >
          <Icon
            name={item.name}
            className="text-on-base"
            style={{ width: item.size, height: item.size }}
          />
        </div>
      ))}
    </div>
  );
};
