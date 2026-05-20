const STEPS = [
  { n: '01', title: 'Solicita', desc: 'Envía el formulario con los datos de tu restaurante.' },
  { n: '02', title: 'Te contactamos', desc: 'Un partner manager te llama en menos de 24 horas.' },
  { n: '03', title: 'Onboarding', desc: 'Subimos tu menú, fotos y configuramos pagos.' },
  { n: '04', title: 'Vendes', desc: 'Tu restaurante en línea, recibiendo pedidos en horas.' },
];

export const PartnersProcess = () => {
  return (
    <section className="relative w-full bg-transparent py-24 px-8 md:px-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-faint pointer-events-none" aria-hidden />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-secondary font-bangers tracking-[0.3em] text-sm md:text-base uppercase mb-3">
            Cómo es el proceso
          </p>
          <h2 className="font-bangers text-5xl md:text-6xl text-on-base tracking-wider">
            En <span className="text-primary">4 pasos</span>, listo
          </h2>
        </div>

        {/* Timeline horizontal */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-[3px] bg-secondary/60 z-0" aria-hidden />

          {STEPS.map((s, i) => (
            <div key={s.n} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-secondary text-on-secondary border-[3px] border-stroke-strong shadow-brutal flex items-center justify-center font-bangers text-2xl tracking-wider">
                {s.n}
              </div>
              <h3 className="font-bangers text-2xl text-on-base mt-5 tracking-wide">{s.title}</h3>
              <p className="text-on-base-muted text-sm md:text-base leading-relaxed mt-2 max-w-[220px]">
                {s.desc}
              </p>
              {i < STEPS.length - 1 && (
                <span className="lg:hidden text-secondary text-2xl my-3" aria-hidden>↓</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
