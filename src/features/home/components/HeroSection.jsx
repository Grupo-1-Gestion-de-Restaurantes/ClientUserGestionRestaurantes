import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ArrowLeft, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useHeroSlider } from "../hooks/useHeroSlider";
import { HeroModels } from "./HeroModels";
import star from "../../../assets/img/star.svg";
import bubble from "../../../assets/img/bubble.svg";
import pizza_bubble from "../../../assets/img/pizza_bubble.svg";
import hotDog_bubble from "../../../assets/img/hotDog_bubble.svg";

gsap.registerPlugin(useGSAP);

/**
 * ── CONSTANTES DE AJUSTE DEL PORTAL ──
 */
const PORTAL_CONFIG = {
  // Dimensiones (Desktop)
  desktopWidth: "380px",
  desktopHeight: "530px",

  // Dimensiones (Mobile)
  mobileWidth: "250px",
  mobileHeight: "375px",

  // Clip-path del portal En forma de ovalo
  clipPath: "ellipse(50% 50% at 60% 40%)",

  colorTransitionDuration: "0.5s",

  canvasScale: 1.2,
  canvasTranslateY: "-5%",

  borderThickness: "8px",
  borderColor: "var(--color-stroke-strong, #000000)",
  borderHighlightThickness: "8px",
  borderHighlightColor: "#ffffff",
  ellipseScale: 0.8,
};

const BUBBLE_IMAGES = [bubble, pizza_bubble, hotDog_bubble];

export const HeroSection = ({ paused = false, isStarting = false }) => {
  const { current, progress, goTo, slideData, totalSlides } =
    useHeroSlider(paused);
  const textRef = useRef(null);
  const bubbleRef = useRef(null);
  const firstSlideRef = useRef(true);

  // ── Synced transition: bubble + text ──
  useGSAP(
    () => {
      const text = textRef.current;
      const bubbleEl = bubbleRef.current;
      if (!text) return;

      if (firstSlideRef.current) {
        firstSlideRef.current = false;
        gsap.set(text, { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

      // Text: fade-out/up then fade-in/up
      tl.fromTo(
        text,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -20, duration: 0.25, ease: "power2.in" },
        0,
      ).fromTo(
        text,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        0.35,
      );

      // Bubble image: scale pulse
      if (bubbleEl) {
        tl.fromTo(
          bubbleEl,
          { scale: 1, rotate: 0 },
          { scale: 0, rotate: -10, duration: 0.25, ease: "power3.in" },
          0,
        ).fromTo(
          bubbleEl,
          { scale: 0, rotate: 10 },
          { scale: 1, rotate: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" },
          0.35,
        );
      }
    },
    { dependencies: [current] },
  );

  return (
    <section
      id="hero"
      className="hero relative min-h-screen w-full overflow-hidden bg-transparent"
    >
      {/* ── Decorative floating stars ── */}
      <img
        src={star}
        alt=""
        className="absolute top-[15%] left-[5%] w-8 h-8 animate-float opacity-80 pointer-events-none"
      />
      <img
        src={star}
        alt=""
        className="absolute top-[60%] right-[8%] w-6 h-6 animate-float-delay opacity-60 pointer-events-none"
      />
      <img
        src={star}
        alt=""
        className="absolute bottom-[20%] left-[15%] w-5 h-5 animate-twinkle opacity-70 pointer-events-none"
      />

      {/* ── 3-Column Hero Grid ── */}
      <div className="relative grid h-screen grid-cols-1 items-center px-6 md:px-10 lg:px-16 md:grid-cols-[1fr_1.4fr_1.2fr] gap-4">
        {/* ── Col 1: Manga Speech Bubble ── */}
        <div className="hidden md:flex flex-col items-start justify-center gap-6 relative">
          <div
            ref={bubbleRef}
            className="relative w-full max-w-[380px] will-change-transform"
          >
            <img
              src={BUBBLE_IMAGES[current]}
              alt={slideData.bubbleTitle}
              className="w-full h-auto drop-shadow-lg"
            />
          </div>
          <img src={star} alt="" className="w-10 h-10 animate-float" />
        </div>

        {/* Col 2: Simplified 2-Layer Portal */}
        <div className="relative flex h-full items-center justify-center">
          <div
            data-hero-portal
            className="portal-wrapper relative flex items-center justify-center"
            style={{
              width: "var(--p-w)",
              height: "var(--p-h)",
              transform: `scale(${PORTAL_CONFIG.ellipseScale})`,
              "--p-w":
                window.innerWidth < 768
                  ? PORTAL_CONFIG.mobileWidth
                  : PORTAL_CONFIG.desktopWidth,
              "--p-h":
                window.innerWidth < 768
                  ? PORTAL_CONFIG.mobileHeight
                  : PORTAL_CONFIG.desktopHeight,
            }}
          >
            {/* CAPA 1: Fondo de Color del Portal (Elipse visual) */}
            <div
              className="portal-bg absolute inset-0 z-0"
              style={{
                backgroundColor: slideData.portalColor,
                borderRadius: "50%",
                border: `${PORTAL_CONFIG.borderThickness} solid ${slideData.borderColor || PORTAL_CONFIG.borderColor}`,
                transition: `background-color ${PORTAL_CONFIG.colorTransitionDuration} ease, border-color ${PORTAL_CONFIG.colorTransitionDuration} ease, box-shadow ${PORTAL_CONFIG.colorTransitionDuration} ease`,
                boxShadow: `inset 0 0 0 ${PORTAL_CONFIG.borderHighlightThickness} ${slideData.borderColor || PORTAL_CONFIG.borderColor}, inset 0 0 60px rgba(0,0,0,0.4)`,
              }}
            />

            {/* CAPA 2: Three.js Canvas - Desbordando el portal para efecto 3D vs 2D */}
            <div
              className="three-canvas-container absolute pointer-events-none"
              style={{
                inset: "-20%", // Se expande un 20% hacia afuera de los bordes del portal
                zIndex: 10,
                overflow: "visible",
              }}
            >
              <div className="w-full h-full">
                <Canvas
                  camera={{ position: [0, 0, 45], fov: 45 }}
                  gl={{ antialias: true, alpha: true }}
                  onCreated={({ gl }) => {
                    gl.setClearColor(0x000000, 0);
                  }}
                  frameloop={paused ? "never" : "always"}
                >
                  <Suspense fallback={null}>
                    <HeroModels activeIndex={current} isStarting={isStarting} />
                  </Suspense>
                </Canvas>
              </div>
            </div>
          </div>
        </div>

        {/* ── Col 3: Text + Controls ── */}
        <div
          ref={textRef}
          className="z-10 flex flex-col gap-5 will-change-transform"
        >
          <h1 className="font-bangers text-3xl md:text-4xl lg:text-5xl font-black leading-tight whitespace-pre-line text-secondary drop-shadow-sm tracking-wide">
            {slideData.title}
          </h1>

          <div className="grid grid-cols-2 gap-5 text-sm text-on-base-muted font-medium">
            <p>{slideData.desc1}</p>
            <p>{slideData.desc2}</p>
          </div>

          {/* ── Carousel Controls ── */}
          <div className="mt-4 flex items-center gap-5">
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              className="rounded-lg border-[3px] border-stroke-strong bg-on-base text-surface-1 p-3 shadow-brutal transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] active:scale-95"
              aria-label="Previous slide"
            >
              <ArrowLeft size={20} strokeWidth={3} />
            </button>

            <div className="flex items-center gap-3">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => goTo(i)}
                  className="relative flex items-center"
                  aria-label={`Go to slide ${i + 1}`}
                >
                  {i === current ? (
                    <div className="h-2.5 w-20 overflow-hidden rounded-full bg-surface-3 border border-stroke-soft">
                      <div
                        className="h-full rounded-full bg-secondary transition-none"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  ) : (
                    <div className="h-2.5 w-2.5 rounded-full bg-on-base-faint transition-colors hover:bg-secondary" />
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => goTo(current + 1)}
              className="rounded-lg border-[3px] border-stroke-strong bg-on-base text-surface-1 p-3 shadow-brutal transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] active:scale-95"
              aria-label="Next slide"
            >
              <ArrowRight size={20} strokeWidth={3} />
            </button>
          </div>

          <p className="text-sm font-bold text-on-base-muted tracking-wider font-bangers">
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(totalSlides).padStart(2, "0")}
          </p>
        </div>
      </div>
    </section>
  );
};
