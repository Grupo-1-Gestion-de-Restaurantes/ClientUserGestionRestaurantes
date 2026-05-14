import { Canvas } from "@react-three/fiber";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useHeroSlider } from "../hooks/useHeroSlider";
import { HeroModels } from "./HeroModels";
import star from "../../../assets/img/star.svg";
import bubble from "../../../assets/img/bubble.svg";
import pizza_bubble from "../../../assets/img/pizza_bubble.svg";
import hotDog_bubble from "../../../assets/img/hotDog_bubble.svg";

// Sustituye por la ruta a tu propio Navbar si ya tienes uno en shared/components
import { Navbar } from "./Navbar";

const IMAGES = [bubble, pizza_bubble, hotDog_bubble];

export const HeroSection = () => {
  const { current, progress, goTo, slideData, totalSlides } = useHeroSlider();

  return (
    <div className="hero w-full min-h-screen bg-[#f4be2c] relative overflow-hidden">
      <Navbar />

      <div className="relative grid grid-cols-1 md:grid-cols-3 items-center px-10 h-[calc(100vh-80px)]">
        
        {/* LEFT DECORATION */}
        <div className="hidden md:flex flex-col items-start gap-6">
          <div className="absolute top-0">
            <img src={IMAGES[current]} alt="bubble effect" width={350} height={350} />
          </div>
          <img src={star} alt="star" width={60} height={60} />
        </div>

        {/* CENTER: 3D CANVAS */}
        <div className="flex justify-center h-full relative">
          <div className="absolute top-10 w-full h-full max-h-[80vh]">
            <Canvas camera={{ position: [0, 0, 90], fov: 45 }}>
              <HeroModels activeIndex={current} />
            </Canvas>
          </div>
        </div>

        {/* RIGHT: CONTENT & CONTROLS */}
        <div className="flex flex-col gap-6 transition-all duration-500 z-10">
          <h1 className="text-5xl font-extrabold leading-tight whitespace-pre-line animate-fade-in">
            {slideData.title}
          </h1>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <p>{slideData.desc1}</p>
            <p>{slideData.desc2}</p>
          </div>

          {/* CONTROLS */}
          <div className="flex items-center gap-6 mt-6">
            <button
              onClick={() => goTo(current - 1)}
              className="border-2 border-black rounded-lg p-3 shadow-[4px_4px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] transition-all active:scale-95 bg-white"
            >
              <ArrowLeft />
            </button>

            {/* DOT INDICATORS */}
            <div className="flex items-center gap-3">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="relative flex items-center"
                >
                  {i === current ? (
                    <div className="w-20 h-2 bg-black/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black rounded-full transition-none"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  ) : (
                    <div className="w-2 h-2 bg-black/40 rounded-full hover:bg-black transition-colors" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => goTo(current + 1)}
              className="border-2 border-black rounded-lg p-3 shadow-[4px_4px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] transition-all active:scale-95 bg-white"
            >
              <ArrowRight />
            </button>
          </div>

          {/* COUNTER */}
          <p className="text-sm font-bold text-black/50">
            {String(current + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
          </p>
        </div>
      </div>
    </div>
  );
};