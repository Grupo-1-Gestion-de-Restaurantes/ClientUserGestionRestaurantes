import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useProgress } from '@react-three/drei';
import star from '../../../assets/img/star.svg';
import { useSoundStore } from '../store/useSoundStore';

gsap.registerPlugin(useGSAP);

export const LoadingScreen = ({ onStart }) => {
  const containerRef = useRef(null);
  const hasAnimatedBtn = useRef(false);

  const { progress } = useProgress();
  const isLoaded = progress === 100;

  // Main entrance animation
  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. Stars appear one by one in the CENTER
    tl.to('.star', {
      opacity: 1,
      scale: 1,
      stagger: 0.2,
      duration: 0.35,
      ease: 'back.out(1.7)',
    })
    // 2. Stars pulse once
    .to('.star', {
      scale: 1.3,
      duration: 0.2,
      stagger: 0.05,
      yoyo: true,
      repeat: 1,
    })
    // 3. Stars fade out
    .to('.stars-container', {
      opacity: 0,
      scale: 0.5,
      duration: 0.4,
      ease: 'power3.in',
      onComplete: () => {
        gsap.set('.stars-container', { display: 'none' });
      }
    })
    // 4. Logo letters enter from below with stagger
    .fromTo(
      '.logo-letter',
      { y: 60, opacity: 0, scale: 0.5 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power3.out',
      }
    )
    // 5. Bounce yoyo
    .to('.logo-letter', {
      y: -20,
      stagger: 0.06,
      duration: 0.25,
      ease: 'power2.out',
      repeat: 2,
      yoyo: true,
    })
    // 6. Final settle
    .to('.logo-letter', {
      y: 0,
      stagger: 0.06,
      duration: 0.4,
      ease: 'bounce.out',
    })
    // 7. Sub-logo (progress bar) appears
    .to('.sub-logo', {
      opacity: 1,
      y: -10,
      duration: 0.4,
    });

  }, { scope: containerRef });

  // Show START button when models are loaded
  useGSAP(() => {
    if (isLoaded && !hasAnimatedBtn.current) {
      hasAnimatedBtn.current = true;
      gsap.to('.start-btn', {
        opacity: 1,
        y: -10,
        duration: 0.5,
        ease: 'power3.out',
        pointerEvents: 'auto',
      });
    }
  }, [isLoaded]);

  const handleStart = () => {
    // Init ambient sound (requires user gesture)
    useSoundStore.getState().initAudio();

    // Animate loading screen out
    const tl = gsap.timeline({
      onComplete: () => onStart(),
    });

    tl.to('.start-btn', {
      scale: 0.8,
      opacity: 0,
      duration: 0.2,
      ease: 'power3.in',
    })
    .to(containerRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power3.inOut',
    });
  };

  const title = "EXPRESS";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-landing-red"
    >
      {/* Stars — centered */}
      <div className="stars-container absolute inset-0 flex items-center justify-center gap-3 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <img
            key={i}
            src={star}
            alt=""
            width={50}
            height={50}
            className="star opacity-0 scale-50"
          />
        ))}
      </div>

      {/* Logo letters */}
      <div className="flex flex-col items-center">
        <div className="flex overflow-hidden pb-4 gap-1">
          {title.split('').map((char, i) => (
            <span
              key={i}
              className="logo-letter font-bangers text-6xl md:text-8xl font-black text-white opacity-0 inline-block drop-shadow-lg tracking-wider"
            >
              {char}
            </span>
          ))}
        </div>

        {/* Real loading progress bar */}
        <div className="sub-logo opacity-0 w-64 h-2 bg-black/20 rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom: START button + message */}
      <div className="absolute bottom-12 flex flex-col gap-6 items-center">
        <button
          className="start-btn opacity-0 pointer-events-none bg-white text-black font-bangers text-2xl tracking-widest px-10 py-3 rounded-lg border-[3px] border-black shadow-brutal transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] active:scale-95"
          onClick={handleStart}
        >
          START
        </button>

        <p className="text-white/80 text-base flex items-center gap-2 font-medium">
          Immersive sound ahead. Use headphones for best effect{' '}
          <span className="text-lg">🎧</span>
        </p>
      </div>
    </div>
  );
};