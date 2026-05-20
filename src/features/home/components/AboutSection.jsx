import { useRef } from 'react';
import { Rocket, Target, Sparkles } from 'lucide-react';
import star from '../../../assets/img/star.svg';
import { useParallax2D } from '../../../shared/hooks/useParallax2D';

const VALUES = [
  { icon: Rocket, label: 'Velocidad' },
  { icon: Target, label: 'Precisión' },
  { icon: Sparkles, label: 'Sabor' },
];

export const AboutSection = () => {
  const ref = useRef(null);

  useParallax2D(ref, [
    { selector: '.about-blob-red', yPercent: -30 },
    { selector: '.about-blob-yellow', yPercent: 40 },
    { selector: '.about-star-a', yPercent: -80, rotate: 45 },
    { selector: '.about-star-b', yPercent: 60, rotate: -30 },
    { selector: '.about-illust', yPercent: -15 },
  ]);

  return (
    <section
      ref={ref}
      id="about"
      className="relative w-full min-h-screen bg-transparent py-24 px-8 md:px-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-faint pointer-events-none" aria-hidden />
      <div className="about-blob-red absolute -top-20 -left-32 w-[500px] h-[500px] bg-radial-primary opacity-50 pointer-events-none" aria-hidden />
      <div className="about-blob-yellow absolute bottom-0 right-[-12%] w-[420px] h-[420px] bg-radial-secondary opacity-40 pointer-events-none" aria-hidden />
      <img src={star} alt="" aria-hidden className="about-star-a absolute top-[15%] right-[12%] w-7 h-7 opacity-70 animate-twinkle pointer-events-none" />
      <img src={star} alt="" aria-hidden className="about-star-b absolute bottom-[20%] left-[8%] w-9 h-9 opacity-60 animate-float pointer-events-none" />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        {/* Illustration column */}
        <div className="about-illust relative aspect-square max-w-md mx-auto md:mx-0">
          {/* Layered card: yellow back + red front */}
          <div className="absolute inset-0 bg-secondary rounded-3xl border-[3px] border-stroke-strong shadow-brutal rotate-[-4deg]" aria-hidden />
          <div className="relative bg-primary text-on-primary rounded-3xl border-[3px] border-stroke-strong shadow-brutal p-10 h-full flex flex-col justify-between rotate-[2deg]">
            <div>
              <p className="font-bangers text-2xl tracking-[0.25em] uppercase opacity-90">Desde 2026</p>
              <h3 className="font-bangers text-6xl md:text-7xl leading-none mt-3">
                EXPRESS<br/>
                <span className="text-secondary">SPACE</span>
              </h3>
            </div>
            <div className="text-sm md:text-base font-medium leading-relaxed opacity-95">
              Una estación espacial donde tu comida favorita orbita junto a la mejor tecnología.
            </div>
            <div className="flex gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-on-primary" />
              <span className="inline-block w-3 h-3 rounded-full bg-secondary" />
              <span className="inline-block w-3 h-3 rounded-full bg-on-primary/40" />
            </div>
          </div>
        </div>

        {/* Text column */}
        <div className="relative">
          <p className="text-secondary font-bangers tracking-[0.3em] text-sm md:text-base uppercase mb-3">
            Quiénes somos
          </p>
          <h2 className="font-bangers text-5xl md:text-7xl text-on-base leading-tight tracking-wider">
            Una <span className="text-primary">misión</span><br/>
            con <span className="text-secondary">sabor</span>
          </h2>
          <p className="text-on-base-muted text-base md:text-lg leading-relaxed mt-6 max-w-lg">
            Somos un equipo que cree que pedir comida debería sentirse como un viaje espacial:
            rápido, divertido y sin fricciones. Construimos la plataforma que conecta a los mejores
            restaurantes con clientes hambrientos de buenas experiencias.
          </p>

          <div className="grid grid-cols-3 gap-3 mt-8 max-w-md">
            {VALUES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 bg-surface-2 border-[3px] border-stroke-strong rounded-xl shadow-brutal-sm py-4 hover:bg-surface-3 transition-colors"
              >
                <Icon className="text-secondary" size={26} strokeWidth={2.5} />
                <span className="font-bangers text-sm md:text-base text-on-base tracking-wide">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 border-l-4 border-secondary pl-5">
            <p className="text-on-base-muted text-sm md:text-base italic max-w-md">
              "Hacemos que cada pedido se sienta como abrir un regalo, incluso si es solo una pizza."
            </p>
            <p className="text-on-base-faint text-xs tracking-widest uppercase mt-2 font-bold">
              — Equipo Express
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
