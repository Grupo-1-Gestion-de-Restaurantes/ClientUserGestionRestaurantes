import star from '../../../assets/img/star.svg';

export const Footer = () => {
  return (
    <footer className="relative w-full bg-[var(--color-primary)] border-t-[4px] border-black overflow-hidden">
      <div className="max-w-5xl mx-auto px-8 md:px-20 py-16 flex flex-col items-center text-center gap-6">
        <div className="max-w-2xl">
          <h3 className="font-bangers text-3xl md:text-5xl font-black text-white text-stroke-sm tracking-wider leading-tight">
            InTenTaMos haCeRlo ReAl.
          </h3>
          <h3 className="font-bangers text-3xl md:text-5xl font-black text-white text-stroke-sm tracking-wider leading-tight mt-2">
            La NaSA diJo QuE nO.
          </h3>
          <p className="text-white/80 text-base md:text-lg mt-6 font-medium">
            AsÍ quE poR aHoRa, es soLo uN dEliCiOso ConCepTo
          </p>
          <p className="text-white/60 text-sm mt-2">
            Por el equipo de <span className="text-[var(--color-secondary)] font-bold">Express</span>
          </p>
        </div>
        <div className="w-full max-w-xs h-[3px] bg-white/20 rounded-full my-4" />
        <div className="flex flex-wrap items-center justify-center gap-6 text-white/60 text-sm font-medium">
          <a href="#hero" className="hover:text-white transition-colors">Inicio</a>
          <a href="#how" className="hover:text-white transition-colors">Cómo funciona</a>
          <a href="#features" className="hover:text-white transition-colors">Funcionalidades</a>
          <a href="mailto:contacto@express.space" className="hover:text-white transition-colors">Contacto</a>
        </div>
        <p className="text-white/30 text-xs mt-4">
          © {new Date().getFullYear()} Express Space Station. Todos los derechos reservados.
        </p>
      </div>
      <img src={star} alt="" className="absolute top-6 left-10 w-5 h-5 animate-twinkle pointer-events-none opacity-40" />
      <img src={star} alt="" className="absolute bottom-8 right-12 w-6 h-6 animate-float pointer-events-none opacity-30" />
    </footer>
  );
};
