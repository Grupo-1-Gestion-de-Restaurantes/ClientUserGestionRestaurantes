import { useState, useRef } from "react";
import locationImg from "../../../assets/img/locations.avif";
import markerImg from "../../../assets/img/marker.svg";

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

  return (
    <section className="relative w-full py-32 bg-[var(--color-background-base)] overflow-hidden flex flex-col items-center">
      <h2 className="font-bangers text-5xl md:text-7xl font-black text-white drop-shadow-sm tracking-wide mb-20 text-center">
        ENCUÉNTRANOS
      </h2>

      <div ref={containerRef} className="relative w-full max-w-6xl mx-auto px-8 flex flex-col md:flex-row gap-16 justify-center items-center">
        {/* Imagen Izquierda (Rotación ligera, translate-y distinto) */}
        <div className="relative w-full md:w-1/2 max-w-md -rotate-2 translate-y-4">
          <div className="w-full h-auto border-[4px] border-black shadow-brutal bg-white overflow-hidden rounded-xl">
            <img src={locationImg} alt="Ubicaciones 1" className="w-full h-auto object-cover opacity-90" />
            
            {/* Marcador 1 */}
            <button
              className="absolute top-[35%] left-[45%] w-12 h-12 -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform z-10 cursor-none"
              onClick={() => setActiveMarker(activeMarker === 1 ? null : 1)}
            >
              <img src={markerImg} alt="Marker" className="w-full h-full drop-shadow-md" />
            </button>

            {/* Tooltip 1 */}
            {activeMarker === 1 && (
              <div className="absolute top-[35%] left-[45%] -translate-x-1/2 -translate-y-[130%] bg-white border-[3px] border-black shadow-brutal px-4 py-3 min-w-[200px] z-20 rounded-lg pointer-events-none animate-fade-in-up">
                <h4 className="font-bangers text-xl text-black">{LOCATIONS_DATA[0].title}</h4>
                <p className="text-xs text-black/70 font-bold">{LOCATIONS_DATA[0].schedule}</p>
                {/* Triangulito de tooltip */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-[3px] border-r-[3px] border-black rotate-45"></div>
              </div>
            )}
          </div>
        </div>

        {/* Imagen Derecha (Rotación invertida, translate-y hacia arriba) */}
        <div className="relative w-full md:w-1/2 max-w-md rotate-1 -translate-y-8 mt-12 md:mt-0">
          <div className="w-full h-auto border-[4px] border-black shadow-brutal bg-white overflow-hidden rounded-xl">
            <img src={locationImg} alt="Ubicaciones 2" className="w-full h-auto object-cover opacity-90 scale-x-[-1]" />
            
            {/* Marcador 2 */}
            <button
              className="absolute top-[50%] left-[60%] w-12 h-12 -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform z-10 cursor-none"
              onClick={() => setActiveMarker(activeMarker === 2 ? null : 2)}
            >
              <img src={markerImg} alt="Marker" className="w-full h-full drop-shadow-md" />
            </button>

            {/* Tooltip 2 */}
            {activeMarker === 2 && (
              <div className="absolute top-[50%] left-[60%] -translate-x-1/2 -translate-y-[130%] bg-[var(--color-secondary)] border-[3px] border-black shadow-brutal px-4 py-3 min-w-[200px] z-20 rounded-lg pointer-events-none animate-fade-in-up">
                <h4 className="font-bangers text-xl text-black">{LOCATIONS_DATA[1].title}</h4>
                <p className="text-xs text-black/70 font-bold">{LOCATIONS_DATA[1].schedule}</p>
                {/* Triangulito de tooltip */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--color-secondary)] border-b-[3px] border-r-[3px] border-black rotate-45"></div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
