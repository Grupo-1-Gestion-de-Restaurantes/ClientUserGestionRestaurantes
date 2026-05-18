import { Search } from 'lucide-react';

export const DashboardTopbar = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 rounded-2xl bg-surface-2 border-[3px] border-stroke-strong px-4 py-3 shadow-brutal-sm">
          <Search size={18} className="text-secondary" />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Buscar restaurante, comida o plato…"
            className="w-full bg-transparent outline-none text-sm font-semibold text-on-base placeholder:text-on-base-faint"
          />
        </div>
      </div>
    </div>
  );
};
