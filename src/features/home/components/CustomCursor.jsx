import { useEffect, useRef } from "react";
import gsap from "gsap";

import cursorImg from "../../../assets/img/cursor.svg";

export const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    gsap.set(el, { xPercent: -50, yPercent: -50 });

    document.body.style.cursor = "none";

    const moveCursor = (e) => {
      gsap.to(el, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.12,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName.toLowerCase() === "button" ||
        e.target.closest("button")
      ) {
        gsap.to(el, { scale: 1.5, duration: 0.2, overwrite: "auto" });
      }
    };

    const handleMouseOut = () => {
      gsap.to(el, { scale: 1, duration: 0.2, overwrite: "auto" });
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-12 w-12 will-change-transform mix-blend-difference"
    >
      <img src={cursorImg} alt="" className="h-full w-full select-none" />
    </div>
  );
};
