import { useState, useRef } from "react";
import locationImg from "../../../assets/img/locations.avif";
import markerImg from "../../../assets/img/marker.svg";
import { useParallax2D } from "../../../shared/hooks/useParallax2D";

const LOCATIONS_DATA = [
  {
    id: 1,
    title: "Sucursal Zona 10",
    schedule: "Lun - Dom: 8am - 10pm",
    top: "35%",
    left: "45%",
    color: "secondary",
  },
  {
    id: 2,
    title: "Sucursal Centro",
    schedule: "Lun - Sab: 9am - 9pm",
    top: "50%",
    left: "60%",
    color: "primary",
  },
  {
    id: 3,
    title: "Sucursal Miraflores",
    schedule: "Lun - Dom: 10am - 11pm",
    top: "20%",
    left: "25%",
    color: "secondary",
  },
  {
    id: 4,
    title: "Sucursal Cayalá",
    schedule: "Lun - Dom: 7am - 11pm",
    top: "70%",
    left: "35%",
    color: "primary",
  },
  {
    id: 5,
    title: "Sucursal Pradera",
    schedule: "Lun - Dom: 9am - 10pm",
    top: "60%",
    left: "80%",
    color: "secondary",
  },
  {
    id: 6,
    title: "Sucursal San Cristóbal",
    schedule: "Lun - Dom: 8am - 10pm",
    top: "25%",
    left: "40%",
    color: "primary",
  },
  {
    id: 7,
    title: "Sucursal Oakland",
    schedule: "Lun - Dom: 10am - 10pm",
    top: "75%",
    left: "15%",
    color: "secondary",
  },
  {
    id: 8,
    title: "Sucursal Naranjo",
    schedule: "Lun - Sab: 8am - 9pm",
    top: "10%",
    left: "75%",
    color: "primary",
  },
  {
    id: 9,
    title: "Sucursal Majadas",
    schedule: "Lun - Dom: 9am - 11pm",
    top: "45%",
    left: "70%",
    color: "secondary",
  },
  {
    id: 10,
    title: "Sucursal Portales",
    schedule: "Lun - Dom: 10am - 9pm",
    top: "60%",
    left: "80%",
    color: "primary",
  },
  {
    id: 11,
    title: "Sucursal Roosevelt",
    schedule: "Lun - Dom: 6am - 11pm",
    top: "15%",
    left: "85%",
    color: "secondary",
  },
  {
    id: 12,
    title: "Sucursal Villa Nueva",
    schedule: "Lun - Sab: 9am - 8pm",
    top: "45%",
    left: "20%",
    color: "primary",
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
        className="relative w-full max-w-6xl mx-auto px-8 flex flex-col lg:flex-row gap-12 lg:gap-16 justify-center items-center"
      >
        {/* Imagen Izquierda (Mapa Simulado 1) */}
        <div className="loc-img-a relative w-full lg:w-1/2 max-w-lg border-[3px] border-stroke-strong shadow-brutal rounded-xl overflow-hidden bg-surface-2">
          <img
            src={locationImg}
            alt="Ubicaciones 1"
            className="w-full h-[400px] object-cover"
          />

          {LOCATIONS_DATA.filter(l => l.id % 2 !== 0).map((loc) => (
            <div key={loc.id}>
              <button
                className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform z-10 cursor-none"
                style={{ top: loc.top, left: loc.left }}
                onClick={() => setActiveMarker(activeMarker === loc.id ? null : loc.id)}
              >
                <img
                  src={markerImg}
                  alt="Marker"
                  className="w-full h-full drop-shadow-md"
                />
              </button>

              {activeMarker === loc.id && (
                <div 
                  className={`absolute -translate-x-1/2 -translate-y-[130%] bg-${loc.color} text-on-${loc.color} border-[3px] border-stroke-strong shadow-brutal px-4 py-3 min-w-[200px] z-20 rounded-lg pointer-events-none animate-fade-in-up`}
                  style={{ top: loc.top, left: loc.left }}
                >
                  <h4 className="font-bangers text-xl">{loc.title}</h4>
                  <p className="text-xs font-bold opacity-80">{loc.schedule}</p>
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-${loc.color} border-b-[3px] border-r-[3px] border-stroke-strong rotate-45`}></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Imagen Derecha (Mapa Simulado 2) */}
        <div className="loc-img-b relative w-full lg:w-1/2 max-w-lg rotate-1 border-[3px] border-stroke-strong shadow-brutal rounded-xl overflow-hidden bg-surface-2 mt-8 lg:mt-0">
          <img
            src={locationImg}
            alt="Ubicaciones 2"
            className="w-full h-[400px] object-cover opacity-95 scale-x-[-1]"
          />

          {LOCATIONS_DATA.filter(l => l.id % 2 === 0).map((loc) => (
            <div key={loc.id}>
              <button
                className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform z-10 cursor-none"
                style={{ top: loc.top, left: loc.left }}
                onClick={() => setActiveMarker(activeMarker === loc.id ? null : loc.id)}
              >
                <img
                  src={markerImg}
                  alt="Marker"
                  className="w-full h-full drop-shadow-md"
                />
              </button>

              {activeMarker === loc.id && (
                <div 
                  className={`absolute -translate-x-1/2 -translate-y-[130%] bg-${loc.color} text-on-${loc.color} border-[3px] border-stroke-strong shadow-brutal px-4 py-3 min-w-[200px] z-20 rounded-lg pointer-events-none animate-fade-in-up`}
                  style={{ top: loc.top, left: loc.left }}
                >
                  <h4 className="font-bangers text-xl">{loc.title}</h4>
                  <p className="text-xs font-bold opacity-90">{loc.schedule}</p>
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-${loc.color} border-b-[3px] border-r-[3px] border-stroke-strong rotate-45`}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

