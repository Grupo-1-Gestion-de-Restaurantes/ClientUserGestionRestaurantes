import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const PARTNERS = [
  "McDonald's",
  "Taco Bell",
  "Pollo Campero",
  "Burger King",
  "Wendy's",
  "Domino's Pizza",
  "KFC"
];

export const PartnersMarquee = () => {
  const trackRef = useRef(null);

  useGSAP(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 2;

    gsap.to(track, {
      x: -totalWidth,
      duration: 20,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
      },
    });
  }, { scope: trackRef });

  // Duplicate for seamless loop
  const allPartners = [...PARTNERS, ...PARTNERS];

  return (
    <section className="w-full bg-black py-10 overflow-hidden border-t-[4px] border-black border-b-[4px]">
      <p className="text-center text-white/50 text-sm font-bold tracking-widest uppercase mb-6 font-bangers">
        Restaurantes que confían en Express
      </p>

      <div className="relative w-full overflow-hidden">
        <div ref={trackRef} className="flex items-center gap-16 w-max">
          {allPartners.map((partner, i) => (
            <div
              key={i}
              className="group cursor-default flex items-center justify-center min-w-max"
            >
              <span 
                className="font-bangers text-6xl md:text-8xl tracking-widest text-transparent transition-colors duration-300 group-hover:text-[var(--color-secondary)]"
                style={{ WebkitTextStroke: "2px var(--color-secondary)" }}
              >
                {partner}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
