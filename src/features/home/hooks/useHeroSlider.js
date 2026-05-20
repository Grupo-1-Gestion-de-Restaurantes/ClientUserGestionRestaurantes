import { useState, useEffect, useCallback } from "react";

export const SLIDES_DATA = [
  {
    title: "MÁS GRANDE\nQUE EL HAMBRE.\nMÁS PEQUEÑO\nQUE UN PLANETA",
    desc1: "Hamburguesa cósmica con papas orbitales y salsa estelar.",
    desc2: "Incluye al Mayor Paws, el capitán más esponjoso de la Vía Láctea.",
    bubbleTitle: "GALAXY BITE",
    bubbleSubtitle: "銀河バイト",
    portalColor: "#E8423A",
    borderColor: "#8E1B15",
  },
  {
    title: "PIZZA\nTAN BUENA,\nQUE LA GRAVEDAD\nPUEDE ESPERAR",
    desc1: "Pepperoni supernova, papas asteroidales y un batido cósmico.",
    desc2: "Servido con Koalantis, el koala más relajado de la galaxia.",
    bubbleTitle: "PIZZANAUT SET",
    bubbleSubtitle: "ピッツァノートセット",
    portalColor: "#4FC3F7",
    borderColor: "#0B72A4",
  },
  {
    title: "EL PERRITO\nQUE CRUZÓ\nEL HORIZONTE\nDE EVENTOS",
    desc1: "Un hot dog tan largo que dobla el espacio-tiempo. Mostaza de Júpiter.",
    desc2: "Salsa cosechada de los anillos de Saturno. Vale la pena el viaje.",
    bubbleTitle: "HOTDOG ODYSSEY",
    bubbleSubtitle: "ホットドッグオデッセイ",
    portalColor: "#7B4FD4",
    borderColor: "#4E269B",
  },
];

const AUTO_SWITCH_MS = 5000;

export const useHeroSlider = (paused = false) => {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  const goTo = useCallback((index) => {
    setCurrent((index + SLIDES_DATA.length) % SLIDES_DATA.length);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (paused) {
      setProgress(0);
      return;
    }
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
  }, [current, paused]);

  return {
    current,
    progress,
    goTo,
    slideData: SLIDES_DATA[current],
    totalSlides: SLIDES_DATA.length,
  };
};
