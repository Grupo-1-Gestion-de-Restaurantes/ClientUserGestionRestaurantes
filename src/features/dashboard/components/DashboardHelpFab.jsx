import { HelpCircle, Rocket } from 'lucide-react';
import { useUIStore } from '../../../shared/store/useUIStore';

export const DashboardHelpFab = () => {
  const requestDashboardTour = useUIStore((s) => s.requestDashboardTour);
  const openOrderWizard = useUIStore((s) => s.openOrderWizard);

  return (
    <div className="fixed bottom-4 left-4 z-[80] flex flex-col gap-2">
      <button
        type="button"
        onClick={() => requestDashboardTour()}
        className="h-12 w-12 rounded-2xl bg-surface-2 border-[3px] border-stroke-strong shadow-brutal-sm flex items-center justify-center text-on-base hover:text-secondary transition-colors"
        aria-label="Ayuda"
        title="Ayuda"
      >
        <HelpCircle size={18} strokeWidth={2.5} />
      </button>

      <button
        type="button"
        onClick={() => openOrderWizard()}
        className="h-12 w-12 rounded-2xl bg-primary text-on-primary border-[3px] border-stroke-strong shadow-brutal-sm flex items-center justify-center hover:brightness-110 transition-colors"
        aria-label="Configurar pedido"
        title="Configurar"
      >
        <Rocket size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
};
