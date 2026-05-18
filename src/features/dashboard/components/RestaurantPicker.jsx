import { Store } from 'lucide-react';
import { useRestaurantsStore } from '../store/useRestaurantsStore';

export const RestaurantPicker = () => {
  const restaurants = useRestaurantsStore((s) => s.restaurants);
  const selectedId = useRestaurantsStore((s) => s.selectedRestaurantId);
  const setSelected = useRestaurantsStore((s) => s.setSelectedRestaurant);
  const loading = useRestaurantsStore((s) => s.loading);

  if (!restaurants.length && !loading) return null;

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-on-base font-bangers tracking-wider text-xl">RESTAURANTE</div>
          <div className="text-xs text-on-base-muted">
            Elige dónde quieres pedir
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 overflow-x-auto pb-2">
        {restaurants.map((r) => {
          const id = r._id || r.id;
          const active = id === selectedId;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelected(id)}
              className={`shrink-0 flex items-center gap-3 rounded-2xl border-[3px] border-stroke-strong px-4 py-2 transition-all ${
                active
                  ? 'bg-secondary text-on-secondary shadow-brutal-sm'
                  : 'bg-surface-2 text-on-base hover:bg-surface-3'
              }`}
            >
              {r.photo ? (
                <img
                  src={r.photo}
                  alt=""
                  className="h-8 w-8 rounded-xl object-cover border-2 border-stroke-strong"
                />
              ) : (
                <Store size={18} />
              )}
              <span className="text-sm font-bangers tracking-wide truncate max-w-[10rem]">
                {r.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
