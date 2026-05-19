import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useProgress } from '@react-three/drei';
import star from '../../../assets/img/star.svg';
import { useSoundStore } from '../store/useSoundStore';
import { useState } from 'react';
import { FloatingText } from '../../../shared/components/ui/FloatingText';
import { useUIStore } from '../../../shared/store/useUIStore';

gsap.registerPlugin(useGSAP);

export const LoadingScreen = ({ onPortalOpen, onStart }) => {
  const containerRef = useRef(null);
  const [titleAnimationFinished, setTitleAnimationFinished] = useState(false);
  const hasAnimatedBtn = useRef(false);

  const { progress } = useProgress();
  const isLoaded = progress === 100;

  // Main entrance animation
  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => setTitleAnimationFinished(true)
    });

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

  // Show START button when models are loaded AND title is done
  useGSAP(() => {
    if (isLoaded && titleAnimationFinished && !hasAnimatedBtn.current) {
      hasAnimatedBtn.current = true;
      gsap.to('.start-btn-group', {
        opacity: 1,
        y: -10,
        duration: 0.5,
        ease: 'power3.out',
        pointerEvents: 'auto',
      });
    }
  }, [isLoaded, titleAnimationFinished]);

  const handleStart = () => {
    // Init and play ambient sound (requires user gesture)
    const sound = useSoundStore.getState();
    sound.initAudio();
    sound.play();

    // Libera hovers globales (letras EXPRESS, iconos flotantes) en cuanto el
    // usuario interactúa con el botón START.
    useUIStore.getState().unlockIntro();

    // Notify HomePage to reveal main content (opacity 100 on the rest of the page)
    onPortalOpen();

    // Measure where the hero portal oval actually is on screen right now
    const heroPortalEl = document.querySelector('[data-hero-portal]');
    let finalClipPath = "ellipse(190px 280px at 50% 50%)"; // fallback
    if (heroPortalEl) {
      const rect = heroPortalEl.getBoundingClientRect();
      const cx = ((rect.left + rect.width / 2) / window.innerWidth * 100).toFixed(2);
      const cy = ((rect.top + rect.height / 2) / window.innerHeight * 100).toFixed(2);
      const rx = Math.round(rect.width / 2);
      const ry = Math.round(rect.height / 2);
      finalClipPath = `ellipse(${rx}px ${ry}px at ${cx}% ${cy}%)`;
    }

    // Animate loading screen into a portal!
    const tl = gsap.timeline({
      onComplete: () => onStart(),
    });

    gsap.set(containerRef.current, { clipPath: "ellipse(150% 150% at 50% 50%)" });

    // Hide everything inside the loading screen first
    tl.to('.loading-content', {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: 'power3.in',
    })
    // Shrink the red background to land exactly on the hero portal
    .to(containerRef.current, {
      clipPath: finalClipPath,
      duration: 1.2,
      ease: "power2.inOut",
    })
    // Fade out so the hero portal takes over seamlessly
    .to(containerRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const title = "EXPRESS";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary will-change-[clip-path]"
    >
      <div className="loading-content relative w-full h-full flex flex-col items-center justify-center">
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
          <FloatingText
            text={title}
            wrapperClassName="flex overflow-hidden pb-4 gap-1"
            letterClassName="logo-letter font-bangers text-6xl md:text-8xl font-black text-white opacity-0 inline-block drop-shadow-lg tracking-wider cursor-default"
          />

          {/* Real loading progress bar */}
          <div className="sub-logo opacity-0 w-64 h-2 bg-black/20 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Bottom: START button + message */}
        <div className="start-btn-group absolute bottom-12 flex flex-col gap-6 items-center opacity-0 pointer-events-none">
          <button
            className="bg-white text-black font-bangers text-2xl tracking-widest px-10 py-3 rounded-lg border-[3px] border-black shadow-brutal transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] active:scale-95"
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
    </div>
  );
};