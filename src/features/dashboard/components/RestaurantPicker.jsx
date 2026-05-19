import { Store, ChevronDown } from 'lucide-react';
import { useRestaurantsStore } from '../store/useRestaurantsStore';

export const RestaurantPicker = () => {
  const restaurants = useRestaurantsStore((s) => s.restaurants);
  const selectedId = useRestaurantsStore((s) => s.selectedRestaurantId);
  const setSelected = useRestaurantsStore((s) => s.setSelectedRestaurant);
  const loading = useRestaurantsStore((s) => s.loading);

  if (!restaurants.length && !loading) return null;

  return (
    <section className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-surface-2 border-[3px] border-stroke-strong rounded-3xl shadow-brutal-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border-2 border-primary">
          <Store size={18} className="text-primary" />
        </div>
        <div>
          <div className="text-on-base font-bangers tracking-wider text-xl leading-none">RESTAURANTE</div>
          <div className="text-[10px] text-on-base-muted font-black tracking-widest uppercase mt-1">
            ¿Dónde quieres pedir?
          </div>
        </div>
      </div>

      <div className="relative group min-w-[240px]">
        <select
          value={selectedId || ''}
          onChange={(e) => setSelected(e.target.value || null)}
          className="w-full appearance-none bg-surface-3 border-[3px] border-stroke-strong rounded-2xl px-5 py-3 pr-12 text-sm font-bangers tracking-widest text-on-base cursor-pointer focus:border-secondary transition-all shadow-brutal-sm outline-none"
        >
          <option value="">SELECCIONAR LOCAL...</option>
          {restaurants.map((r) => (
            <option key={r._id || r.id} value={r._id || r.id}>
              {r.name.toUpperCase()}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-base-muted group-hover:text-secondary transition-colors">
          <ChevronDown size={18} />
        </div>
      </div>
    </section>
  );
};
