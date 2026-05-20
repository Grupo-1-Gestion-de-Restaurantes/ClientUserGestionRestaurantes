import { useEffect, useState, useMemo } from 'react';
import { Clock, MapPin, Star, Store, ChevronDown, Search, Filter } from 'lucide-react';
import { useRestaurantsStore } from '../store/useRestaurantsStore';

export const RestaurantsPage = () => {
  const [sortBy, setSortBy] = useState('name');
  const [filters, setFilters] = useState({
    city: '',
    rating: '',
    categories: ''
  });

  const restaurants = useRestaurantsStore((s) => s.restaurants);
  const loading = useRestaurantsStore((s) => s.loading);
  const error = useRestaurantsStore((s) => s.error);
  const selectedId = useRestaurantsStore((s) => s.selectedRestaurantId);
  const setSelected = useRestaurantsStore((s) => s.setSelectedRestaurant);
  const fetchRestaurants = useRestaurantsStore((s) => s.fetchRestaurants);

  useEffect(() => {
    const params = {};
    if (filters.city) params.city = filters.city;
    if (filters.rating) params.rating = filters.rating;
    if (filters.categories) params.categories = filters.categories;
    
    fetchRestaurants(params);
  }, [fetchRestaurants, filters]);

  const sortedRestaurants = useMemo(() => {
    const list = [...restaurants];
    if (sortBy === 'rating') return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === 'eta') return list.sort((a, b) => (a.etaMin || 0) - (b.etaMin || 0));
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [restaurants, sortBy]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

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

      {/* Filters Section */}
      <section className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface-2 border-[3px] border-stroke-strong rounded-3xl p-6 shadow-brutal-sm">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-base-muted">
            <MapPin size={16} />
          </div>
          <input
            type="text"
            name="city"
            placeholder="CIUDAD..."
            value={filters.city}
            onChange={handleFilterChange}
            className="w-full bg-surface-3 border-[3px] border-stroke-strong rounded-2xl pl-11 pr-4 py-2 text-xs font-bangers tracking-widest text-on-base focus:border-primary outline-none transition-all"
          />
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-base-muted">
            <Star size={16} />
          </div>
          <select
            name="rating"
            value={filters.rating}
            onChange={handleFilterChange}
            className="w-full appearance-none bg-surface-3 border-[3px] border-stroke-strong rounded-2xl pl-11 pr-10 py-2 text-xs font-bangers tracking-widest text-on-base focus:border-primary outline-none cursor-pointer transition-all"
          >
            <option value="">RANKING...</option>
            <option value="5">5 ESTRELLAS</option>
            <option value="4">4+ ESTRELLAS</option>
            <option value="3">3+ ESTRELLAS</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-base-muted group-hover:text-primary transition-colors">
            <ChevronDown size={16} />
          </div>
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-base-muted">
            <Filter size={16} />
          </div>
          <select
            name="categories"
            value={filters.categories}
            onChange={handleFilterChange}
            className="w-full appearance-none bg-surface-3 border-[3px] border-stroke-strong rounded-2xl pl-11 pr-10 py-2 text-xs font-bangers tracking-widest text-on-base focus:border-primary outline-none cursor-pointer transition-all"
          >
            <option value="">TIPO COMIDA...</option>
            <option value="Gourmet">GOURMET</option>
            <option value="Casual">CASUAL</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-base-muted group-hover:text-primary transition-colors">
            <ChevronDown size={16} />
          </div>
        </div>

        <div className="relative group">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full appearance-none bg-primary/10 border-[3px] border-primary rounded-2xl px-5 py-2 pr-10 text-xs font-bangers tracking-widest text-primary cursor-pointer outline-none transition-all"
          >
            <option value="name">ORDENAR POR NOMBRE</option>
            <option value="rating">MEJOR CALIFICADOS</option>
            <option value="eta">MENOR TIEMPO ESPERA</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
            <ChevronDown size={16} />
          </div>
        </div>
      </section>

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
        {sortedRestaurants.map((r) => {
          const id = r._id || r.id;
          const active = id === selectedId;
          return (
            <article
              key={id}
              className={`rounded-3xl border-[3px] border-stroke-strong p-5 shadow-brutal-sm transition-all hover:-translate-y-1 ${
                active ? 'bg-secondary text-on-secondary' : 'bg-surface-2 text-on-base'
              }`}
            >
              <div className="flex items-start justify-between">
                {r.photo || r.image ? (
                  <img
                    src={r.photo || r.image}
                    alt=""
                    className="h-14 w-14 rounded-2xl object-cover border-[3px] border-stroke-strong"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-2xl bg-surface-3 flex items-center justify-center border-[3px] border-stroke-strong text-primary">
                    <Store size={22} />
                  </div>
                )}
                <div className="flex flex-col items-end gap-1">
                  {typeof r.capacity === 'number' ? (
                    <span className="text-[10px] font-black tracking-widest uppercase bg-surface-3 border-[2px] border-stroke-strong rounded-full px-2 py-0.5">
                      {r.capacity} pax
                    </span>
                  ) : null}
                  <span className="text-[10px] font-black tracking-widest uppercase bg-primary/10 text-primary border-[2px] border-primary rounded-full px-2 py-0.5">
                    {r.categories}
                  </span>
                </div>
              </div>

              <h2 className="mt-4 font-bangers tracking-wide text-2xl truncate">{r.name}</h2>

              <div className="mt-3 space-y-2 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="shrink-0" />
                  <span className="truncate">{r.city || 'Guatemala'}, {r.address}</span>
                </div>
                <div className="flex items-center gap-4">
                  {typeof r.rating === 'number' ? (
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-primary" fill="currentColor" />
                      {r.rating.toFixed(1)}
                    </span>
                  ) : null}
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-surface-3 rounded-md">
                    {r.status || 'Abierto'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelected(id)}
                className={`mt-5 w-full font-bangers tracking-widest text-base py-2 rounded-xl border-[3px] border-stroke-strong shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] transition-all ${
                  active ? 'bg-primary text-on-primary' : 'bg-surface-3 text-on-base'
                }`}
              >
                {active ? 'SELECCIONADO' : 'COMENZAR PEDIDO'}
              </button>
            </article>
          );
        })}
      </div>

      {!loading && !restaurants.length && !error ? (
        <div className="rounded-3xl bg-surface-2 border-[3px] border-stroke-strong p-10 text-center text-sm text-on-base-muted">
          No se encontraron restaurantes con esos filtros.
        </div>
      ) : null}
    </div>
  );
};

