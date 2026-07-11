import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ShoppingBag, Star, Store, ChevronDown, Filter } from 'lucide-react';
import { useRestaurantsStore } from '../store/useRestaurantsStore';
import { showSuccess } from '../../../shared/utils/toast';

export const RestaurantsPage = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('name');
  const [filters, setFilters] = useState({ city: '', rating: '', categories: '' });

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
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [restaurants, sortBy]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleStartOrder = (e, restaurant) => {
    e.preventDefault();
    e.stopPropagation();
    const id = restaurant._id || restaurant.id;
    setSelected(id);
    showSuccess(`${restaurant.name} seleccionado`);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-6 md:mb-8">
        <p className="text-xs text-on-base-muted tracking-widest uppercase">Explora</p>
        <h1 className="mt-1 font-bangers tracking-wider text-3xl sm:text-4xl md:text-5xl text-on-base">
          Restaurantes <span className="text-secondary">disponibles</span>
        </h1>
        <p className="mt-2 text-sm text-on-base-muted">
          Toca una tarjeta para ver detalles, reseñas y comenzar tu pedido.
        </p>
      </header>

      <section className="mb-6 md:mb-8 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 bg-surface-2 border-[3px] border-stroke-strong rounded-3xl p-4 md:p-6 shadow-brutal-sm">
        <div className="relative group">
          <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-on-base-muted">
            <MapPin size={16} />
          </div>
          <input
            type="text"
            name="city"
            placeholder="CIUDAD..."
            value={filters.city}
            onChange={handleFilterChange}
            className="w-full bg-surface-3 border-[3px] border-stroke-strong rounded-2xl pl-9 md:pl-11 pr-3 md:pr-4 py-2 text-[11px] md:text-xs font-bangers tracking-widest text-on-base focus:border-primary outline-none transition-all"
          />
        </div>

        <div className="relative group">
          <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-on-base-muted">
            <Star size={16} />
          </div>
          <select
            name="rating"
            value={filters.rating}
            onChange={handleFilterChange}
            className="w-full appearance-none bg-surface-3 border-[3px] border-stroke-strong rounded-2xl pl-9 md:pl-11 pr-8 md:pr-10 py-2 text-[11px] md:text-xs font-bangers tracking-widest text-on-base focus:border-primary outline-none cursor-pointer transition-all"
          >
            <option value="">RANKING...</option>
            <option value="5">5 ESTRELLAS</option>
            <option value="4">4+ ESTRELLAS</option>
            <option value="3">3+ ESTRELLAS</option>
          </select>
          <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-base-muted group-hover:text-primary transition-colors">
            <ChevronDown size={14} />
          </div>
        </div>

        <div className="relative group">
          <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-on-base-muted">
            <Filter size={16} />
          </div>
          <select
            name="categories"
            value={filters.categories}
            onChange={handleFilterChange}
            className="w-full appearance-none bg-surface-3 border-[3px] border-stroke-strong rounded-2xl pl-9 md:pl-11 pr-8 md:pr-10 py-2 text-[11px] md:text-xs font-bangers tracking-widest text-on-base focus:border-primary outline-none cursor-pointer transition-all"
          >
            <option value="">TIPO...</option>
            <option value="Gourmet">GOURMET</option>
            <option value="Casual">CASUAL</option>
          </select>
          <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-base-muted group-hover:text-primary transition-colors">
            <ChevronDown size={14} />
          </div>
        </div>

        <div className="relative group">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full appearance-none bg-primary/10 border-[3px] border-primary rounded-2xl px-3 md:px-5 py-2 pr-8 md:pr-10 text-[11px] md:text-xs font-bangers tracking-widest text-primary cursor-pointer outline-none transition-all"
          >
            <option value="name">POR NOMBRE</option>
            <option value="rating">MEJOR CALIFICADOS</option>
          </select>
          <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
            <ChevronDown size={14} />
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
          {[0, 1, 2, 3].map((i) => (
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
            <Link
              key={id}
              to={`/dashboard/restaurants/${id}`}
              className={`group rounded-3xl border-[3px] border-stroke-strong overflow-hidden shadow-brutal-sm transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_black] flex flex-col ${
                active ? 'bg-secondary/5 border-secondary' : 'bg-surface-2 text-on-base'
              }`}
            >
              <div className="relative h-32 sm:h-40 bg-surface-3 flex items-center justify-center shrink-0 overflow-hidden">
                {r.photo || r.image ? (
                  <img
                    src={r.photo || r.image}
                    alt={r.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Store className={`${active ? 'text-secondary' : 'text-on-base-muted'}`} size={40} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {r.categories && (
                    <span className="text-[9px] font-black tracking-widest uppercase bg-primary text-on-primary border-[2px] border-stroke-strong rounded-full px-2.5 py-0.5 shadow-brutal-sm">
                      {r.categories}
                    </span>
                  )}
                </div>
                {active && (
                  <div className="absolute top-2 left-2">
                    <span className="text-[9px] font-black tracking-widest uppercase bg-secondary text-on-secondary border-[2px] border-stroke-strong rounded-full px-2.5 py-0.5 shadow-brutal-sm">
                      ACTIVO
                    </span>
                  </div>
                )}

                <div className="absolute bottom-2 left-3 text-white font-bangers tracking-wide text-lg drop-shadow-md">
                  {r.name}
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <div className="mt-1 space-y-2 text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-on-base-muted">
                    <MapPin size={12} className="shrink-0 text-primary" />
                    <span className="truncate">{r.city || 'Guatemala'}, {r.address}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-stroke-soft">
                    <div className="flex items-center gap-1">
                      <Star size={13} className="text-secondary fill-secondary shrink-0" />
                      <span className="text-xs font-black">{r.rating ? r.rating.toFixed(1) : '5.0'}</span>
                    </div>
                    
                    <div className="text-[10px] font-black uppercase tracking-widest bg-surface-3 border-[2px] border-stroke-strong px-2 py-0.5 rounded-md">
                      {r.status || 'Abierto'}
                    </div>

                    <div className="text-[10px] text-on-base-muted">
                      30-45 min • Envío Q10
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStartOrder(e, r)}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border-[2px] border-stroke-strong font-bangers tracking-widest text-xs uppercase shadow-brutal-sm transition-all ${
                      active 
                        ? 'bg-secondary text-on-secondary cursor-default shadow-none' 
                        : 'bg-primary text-on-primary hover:bg-[#991f23] active:translate-y-0.5 active:shadow-none'
                    }`}
                  >
                    <ShoppingBag size={12} />
                    {active ? 'ORDENANDO AQUÍ' : 'PEDIR MENÚ'}
                  </button>
                </div>
              </div>
            </Link>
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