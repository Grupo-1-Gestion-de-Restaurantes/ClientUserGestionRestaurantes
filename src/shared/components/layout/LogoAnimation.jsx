import { FloatingText } from '../ui/FloatingText';

export const LogoAnimation = () => {
  const title = "EXPRESS";

  return (
    <div className="flex flex-col items-center justify-center cursor-pointer pointer-events-auto">
      <FloatingText
        text={title}
        wrapperClassName="flex overflow-hidden gap-[2px]"
        letterClassName="logo-letter font-bangers text-3xl md:text-5xl font-black text-on-base opacity-0 inline-block drop-shadow-md tracking-wider"
      />
      <div className="sub-logo opacity-0 font-bold text-xs md:text-sm tracking-[0.3em] uppercase mt-1 text-secondary">
        Estación Espacial
      </div>
    </div>
  );
};
