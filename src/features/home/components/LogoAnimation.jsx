export const LogoAnimation = () => {
  const title = "EXPRESS";

  return (
    <div className="flex flex-col items-center justify-center cursor-pointer pointer-events-auto">
      <div className="flex overflow-hidden gap-[2px]">
        {title.split('').map((char, i) => (
          <span 
            key={i} 
            className="logo-letter font-bangers text-3xl md:text-5xl font-black text-black opacity-0 inline-block drop-shadow-md tracking-wider"
          >
            {char}
          </span>
        ))}
      </div>
      <div className="sub-logo opacity-0 font-bold text-xs md:text-sm tracking-[0.3em] uppercase mt-1">
        Estación Espacial
      </div>
    </div>
  );
};