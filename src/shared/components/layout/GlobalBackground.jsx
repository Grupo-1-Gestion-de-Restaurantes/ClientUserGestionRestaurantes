import { FloatingBackground } from './FloatingBackground';

export const GlobalBackground = () => (
  <>
    <div className="fixed inset-0 z-0 bg-surface-1" aria-hidden />

    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
      <div className="absolute -top-40 -left-48 h-[640px] w-[640px] bg-radial-primary opacity-45" />
      <div className="absolute -bottom-56 -right-56 h-[720px] w-[720px] bg-radial-secondary opacity-35" />
      <div
        className="absolute top-[25%] left-[55%] h-[560px] w-[560px] opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at center, rgba(91, 92, 246, 0.55) 0%, rgba(91, 92, 246, 0) 70%)',
        }}
      />
    </div>

    <FloatingBackground />
  </>
);
