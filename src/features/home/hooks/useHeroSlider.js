import { useState, useEffect, useCallback } from "react";

export const SLIDES_DATA = [
  {
    title: "BIGGER\nTHAN HUNGER.\nSMALLER THAN\nA PLANET",
    desc1: "Stacked cosmic burger with orbit fries and stardust sauce.",
    desc2: "Comes with Major Paws, the fluffiest captain in the Milky Way.",
  },
  {
    title: "SLICED\nACROSS THE\nGALAXY\nONE BITE",
    desc1: "Cosmic pizza baked in a supernova oven with asteroid toppings.",
    desc2: "Paired with Coffee Nebula — brewed from the darkest matter.",
  },
  {
    title: "THE DOG\nTHAT CROSSED\nTHE EVENT\nHORIZON",
    desc1: "A hotdog so long it bends spacetime. Mustard from Jupiter.",
    desc2: "Relish harvested from the rings of Saturn. Worth the trip.",
  },
];

const AUTO_SWITCH_MS = 3000;

export const useHeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  const goTo = useCallback((index) => {
    setCurrent((index + SLIDES_DATA.length) % SLIDES_DATA.length);
    setProgress(0);
  }, []);

  useEffect(() => {
    setProgress(0);
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / AUTO_SWITCH_MS) * 100, 100);
      setProgress(pct);

      if (elapsed >= AUTO_SWITCH_MS) {
        setCurrent((prev) => (prev + 1) % SLIDES_DATA.length);
        setProgress(0);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [current]);

  return {
    current,
    progress,
    goTo,
    slideData: SLIDES_DATA[current],
    totalSlides: SLIDES_DATA.length,
  };
};
