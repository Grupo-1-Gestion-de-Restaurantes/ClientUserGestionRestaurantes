import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import arla from "../../../assets/icons-brands/arla-foods-logo.svg";
import comidasperuanas from "../../../assets/icons-brands/comidasperuanastop.svg";
import dominos from "../../../assets/icons-brands/dominos-pizza.svg";
import gloria from "../../../assets/icons-brands/gloria-jeans-coffee.svg";
import kfc from "../../../assets/icons-brands/kfc-2.svg";
import mcdonalds from "../../../assets/icons-brands/mcdonalds-7.svg";
import mrbeast from "../../../assets/icons-brands/mrbeast.svg";
import pizzahut from "../../../assets/icons-brands/pizza-hut.svg";
import starbucks from "../../../assets/icons-brands/starbucks-logo-ab-2011.svg";
import subway from "../../../assets/icons-brands/subway-12.svg";
import tacobell from "../../../assets/icons-brands/taco-bell-6.svg";
import wendys from "../../../assets/icons-brands/wendys-logo-1.svg";

const PARTNERS = [
  { id: "mcdonalds", name: "McDonald's", src: mcdonalds },
  { id: "tacobell", name: "Taco Bell", src: tacobell },
  { id: "wendys", name: "Wendy's", src: wendys },
  { id: "dominos", name: "Domino's Pizza", src: dominos },
  { id: "kfc", name: "KFC", src: kfc },
  { id: "mrbeastburgers", name: "MrBeast Burgers", src: mrbeast },
  { id: "pizzahut", name: "Pizza Hut", src: pizzahut },
  { id: "starbucks", name: "Starbucks", src: starbucks },
  { id: "subway", name: "Subway", src: subway },
  { id: "arla", name: "Arla", src: arla },
  { id: "gloria", name: "Gloria Jean's", src: gloria },
  { id: "comidasperuanas", name: "Comidas Peruanas", src: comidasperuanas }
];

export const PartnersMarquee = () => {
  const trackRef = useRef(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      const totalWidth = track.scrollWidth / 2;

      // Animación lenta y suave
      gsap.to(track, {
        x: -totalWidth,
        duration: 45,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
        },
      });
    },
    { scope: trackRef },
  );

  // Duplicate for seamless loop
  const allPartners = [...PARTNERS, ...PARTNERS];

  return (
    <section className="w-full bg-transparent py-12 md:py-16 overflow-hidden border-t border-stroke-soft border-b">
      <div className="max-w-7xl mx-auto px-6 mb-10 md:mb-12">
        <h2 className="text-center text-on-base-muted text-lg md:text-xl font-medium tracking-widest uppercase font-sans">
          Ellos depositan su confianza en <span className="text-secondary font-bold">Express</span>
        </h2>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Gradientes a los lados para disolver el carrusel y dar mejor UX */}
        <div className="absolute top-0 left-0 w-24 md:w-48 h-full bg-gradient-to-r from-surface-1 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-24 md:w-48 h-full bg-gradient-to-l from-surface-1 to-transparent z-10 pointer-events-none"></div>

        <div ref={trackRef} className="flex items-center gap-16 md:gap-24 w-max px-10">
          {allPartners.map((partner, i) => (
            <div
              key={i}
              className="group cursor-pointer flex items-center justify-center min-w-max transition-transform duration-500 hover:scale-110"
              title={partner.name}
            >
              <img
                src={partner.src}
                alt={partner.name}
                /* Iconos más grandes: w-32 a w-40, y md:w-48, con efecto gris por defecto */
                className="w-32 h-32 md:w-40 md:h-40 object-contain transition-all duration-500 filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
