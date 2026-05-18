export const Spinner = ({ label = 'Cargando…' }) => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center gap-3 text-on-base">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 rounded-full border-4 border-primary/30"></div>
      <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      <div className="absolute inset-2 rounded-full bg-surface-2 flex items-center justify-center">
        <span className="text-2xl">🍳</span>
      </div>
    </div>
    <p className="text-sm font-bold uppercase tracking-widest text-on-base-muted">{label}</p>
  </div>
);
