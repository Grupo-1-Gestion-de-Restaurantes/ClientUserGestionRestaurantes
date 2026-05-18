import { useState, useRef } from "react";
import locationImg from "../../../assets/img/locations.avif";
import markerImg from "../../../assets/img/marker.svg";
import { useParallax2D } from "../../../shared/hooks/useParallax2D";

const LOCATIONS_DATA = [
  {
    id: 1,
    title: "Sucursal Zona 10",
    schedule: "Lun - Dom: 8am - 10pm",
    top: "30%",
    left: "40%",
  },
  {
    id: 2,
    title: "Sucursal Centro",
    schedule: "Lun - Sab: 9am - 9pm",
    top: "60%",
    left: "70%",
  },
];

export const LocationsSection = () => {
  const [activeMarker, setActiveMarker] = useState(null);
  const containerRef = useRef(null);

  useParallax2D(containerRef, [
    { selector: '.loc-img-a', yPercent: -10 },
    { selector: '.loc-img-b', yPercent: 10 },
  ]);

  return (
    <section id="locations" className="relative w-full py-32 bg-transparent overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 bg-grid-faint pointer-events-none" aria-hidden />
      <p className="relative text-secondary font-bangers tracking-[0.3em] text-sm md:text-base uppercase mb-3">
        Sucursales
      </p>
      <h2 className="relative font-bangers text-5xl md:text-7xl font-black text-on-base drop-shadow-sm tracking-wide mb-16 text-center">
        ENCUÉNTRA<span className="text-primary">NOS</span>
      </h2>

      <div
        ref={containerRef}
        className="relative w-full max-w-5xl mx-auto px-8 flex flex-col md:flex-row gap-12 md:gap-16 justify-center items-center"
      >
        {/* Imagen Izquierda */}
        <div className="loc-img-a relative w-full md:w-1/2 max-w-md border-[3px] border-stroke-strong shadow-brutal rounded-xl overflow-hidden bg-surface-2">
          <img
            src={locationImg}
            alt="Ubicaciones 1"
            className="w-full h-auto object-cover"
          />

          {/* Marcador 1 */}
          <button
            className="absolute top-[35%] left-[45%] w-12 h-12 -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform z-10 cursor-none"
            onClick={() => setActiveMarker(activeMarker === 1 ? null : 1)}
          >
            <img
              src={markerImg}
              alt="Marker"
              className="w-full h-full drop-shadow-md"
            />
          </button>

          {/* Tooltip 1 */}
          {activeMarker === 1 && (
            <div className="absolute top-[35%] left-[45%] -translate-x-1/2 -translate-y-[130%] bg-secondary text-on-secondary border-[3px] border-stroke-strong shadow-brutal px-4 py-3 min-w-[200px] z-20 rounded-lg pointer-events-none animate-fade-in-up">
              <h4 className="font-bangers text-xl">
                {LOCATIONS_DATA[0].title}
              </h4>
              <p className="text-xs font-bold opacity-80">
                {LOCATIONS_DATA[0].schedule}
              </p>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-secondary border-b-[3px] border-r-[3px] border-stroke-strong rotate-45"></div>
            </div>
          )}
        </div>

        {/* Imagen Derecha */}
        <div className="loc-img-b relative w-full md:w-1/2 max-w-md rotate-1 border-[3px] border-stroke-strong shadow-brutal rounded-xl overflow-hidden bg-surface-2 mt-8 md:mt-0">
          <img
            src={locationImg}
            alt="Ubicaciones 2"
            className="w-full h-auto object-cover opacity-95 scale-x-[-1]"
          />

          {/* Marcador 2 */}
          <button
            className="absolute top-[50%] left-[60%] w-12 h-12 -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform z-10 cursor-none"
            onClick={() => setActiveMarker(activeMarker === 2 ? null : 2)}
          >
            <img
              src={markerImg}
              alt="Marker"
              className="w-full h-full drop-shadow-md"
            />
          </button>

          {/* Tooltip 2 */}
          {activeMarker === 2 && (
            <div className="absolute top-[50%] left-[60%] -translate-x-1/2 -translate-y-[130%] bg-primary text-on-primary border-[3px] border-stroke-strong shadow-brutal px-4 py-3 min-w-[200px] z-20 rounded-lg pointer-events-none animate-fade-in-up">
              <h4 className="font-bangers text-xl">
                {LOCATIONS_DATA[1].title}
              </h4>
              <p className="text-xs font-bold opacity-90">
                {LOCATIONS_DATA[1].schedule}
              </p>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary border-b-[3px] border-r-[3px] border-stroke-strong rotate-45"></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
