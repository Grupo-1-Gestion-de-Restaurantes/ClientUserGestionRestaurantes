import { HelpCircle } from 'lucide-react';
import { useUIStore } from '../../../shared/store/useUIStore';

export const DashboardHelpFab = () => {
  const requestDashboardTour = useUIStore((s) => s.requestDashboardTour);

  return (
    <div 
      className="flex flex-row items-center justify-center gap-2 w-full animate-in fade-in slide-in-from-bottom-2 duration-500 py-2"
      style={{ isolation: 'isolate' }}
    >
      <button
        type="button"
        onClick={requestDashboardTour}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-3 text-on-base-muted border-[2px] border-stroke-strong font-bangers tracking-widest text-xs hover:bg-surface-4 hover:text-on-base transition-colors shadow-brutal-sm active:translate-y-[1px]"
        title="Repetir recorrido"
      >
        <HelpCircle size={14} />
        <span>RECORRIDO</span>
      </button>
    </div>
  );
};
