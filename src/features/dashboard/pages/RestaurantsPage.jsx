import { useEffect } from 'react';
import { Clock, MapPin, Star, Store } from 'lucide-react';
import { useRestaurantsStore } from '../store/useRestaurantsStore';

export const RestaurantsPage = () => {
  const restaurants = useRestaurantsStore((s) => s.restaurants);
  const loading = useRestaurantsStore((s) => s.loading);
  const error = useRestaurantsStore((s) => s.error);
  const selectedId = useRestaurantsStore((s) => s.selectedRestaurantId);
  const setSelected = useRestaurantsStore((s) => s.setSelectedRestaurant);
  const fetchRestaurants = useRestaurantsStore((s) => s.fetchRestaurants);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <p className="text-xs text-on-base-muted tracking-widest uppercase">Explora</p>
        <h1 className="mt-1 font-bangers tracking-wider text-4xl md:text-5xl text-on-base">
          Restaurantes <span className="text-secondary">disponibles</span>
        </h1>
        <p className="mt-2 text-sm text-on-base-muted">
          Selecciona un local y todos tus pedidos se asociarán a él.
        </p>
      </header>

      {error ? (
        <div className="rounded-2xl border-[3px] border-stroke-strong bg-primary/10 px-4 py-3 text-sm text-primary font-bold mb-4">
          {error}
        </div>
      ) : null}

      {loading && !restaurants.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-3xl bg-surface-2 border-[3px] border-stroke-strong h-44 animate-pulse"
            />
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {restaurants.map((r) => {
          const id = r._id || r.id;
          const active = id === selectedId;
          return (
            <article
              key={id}
              className={`rounded-3xl border-[3px] border-stroke-strong p-5 shadow-brutal-sm transition-all ${
                active ? 'bg-secondary text-on-secondary' : 'bg-surface-2 text-on-base'
              }`}
            >
              <div className="flex items-start justify-between">
                {r.photo ? (
                  <img
                    src={r.photo}
                    alt=""
                    className="h-14 w-14 rounded-2xl object-cover border-[3px] border-stroke-strong"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-2xl bg-surface-3 flex items-center justify-center border-[3px] border-stroke-strong">
                    <Store size={22} />
                  </div>
                )}
                {typeof r.capacity === 'number' ? (
                  <span className="text-[11px] font-black tracking-widest uppercase bg-surface-3 border-[3px] border-stroke-strong rounded-full px-3 py-1">
                    {r.capacity} pax
                  </span>
                ) : null}
              </div>

              <h2 className="mt-4 font-bangers tracking-wide text-2xl">{r.name}</h2>

              <div className="mt-3 space-y-2 text-sm font-semibold">
                {r.address ? (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span className="truncate">{r.address}</span>
                  </div>
                ) : null}
                <div className="flex items-center gap-4">
                  {typeof r.rating === 'number' ? (
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-secondary" fill="currentColor" />
                      {r.rating.toFixed(1)}
                    </span>
                  ) : null}
                  {typeof r.etaMin === 'number' ? (
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {r.etaMin} min
                    </span>
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelected(id)}
                className="mt-5 w-full font-bangers tracking-widest text-base py-2 rounded-xl bg-primary text-on-primary border-[3px] border-stroke-strong shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] transition-all"
              >
                {active ? 'SELECCIONADO' : 'ELEGIR'}
              </button>
            </article>
          );
        })}
      </div>

      {!loading && !restaurants.length && !error ? (
        <div className="rounded-3xl bg-surface-2 border-[3px] border-stroke-strong p-10 text-center text-sm text-on-base-muted">
          Aún no hay restaurantes disponibles.
        </div>
      ) : null}
    </div>
  );
};
