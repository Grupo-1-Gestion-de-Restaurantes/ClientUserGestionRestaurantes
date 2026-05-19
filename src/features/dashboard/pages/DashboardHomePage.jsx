import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { CategoryRow } from '../components/CategoryRow';
import { PopularDishes } from '../components/PopularDishes';
import { RestaurantPicker } from '../components/RestaurantPicker';
import { RestaurantsPage } from './RestaurantsPage';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useDishesStore } from '../store/useDishesStore';
import { useRestaurantsStore } from '../store/useRestaurantsStore';
import { useClientStore } from '../store/useClientStore';

export const DashboardHomePage = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(null);
  const [sortBy, setSortBy] = useState('popular');

  const user = useAuthStore((s) => s.user);
  const fetchMyInfo = useClientStore((s) => s.fetchMyInfo);
  const info = useClientStore((s) => s.info);
  
  const greetingName = info?.name || user?.username || user?.name || '';

  const fetchDishes = useDishesStore((s) => s.fetchDishes);
  const fetchRestaurants = useRestaurantsStore((s) => s.fetchRestaurants);

  const selectedRestaurantId = useRestaurantsStore((s) => s.selectedRestaurantId);

  useEffect(() => {
    fetchMyInfo();
    fetchRestaurants();
    if (selectedRestaurantId) {
      fetchDishes({ restaurant: selectedRestaurantId });
    }
  }, [fetchDishes, fetchRestaurants, fetchMyInfo, selectedRestaurantId]);

  if (!selectedRestaurantId) {
    return <RestaurantsPage />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-6">
        <p className="text-xs text-on-base-muted tracking-widest uppercase">
          Hola{greetingName ? `, ${String(greetingName).split(' ')[0]}` : ''}
        </p>
        <h1 className="mt-1 font-bangers tracking-wider text-4xl md:text-5xl text-on-base">
          ¿Qué quieres <span className="text-secondary">pedir hoy</span>?
        </h1>
      </header>

      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 rounded-2xl bg-surface-2 border-[3px] border-stroke-strong px-4 py-3 shadow-brutal-sm">
            <Search size={18} className="text-secondary" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar restaurante, comida o plato…"
              className="w-full bg-transparent outline-none text-sm font-semibold text-on-base placeholder:text-on-base-faint"
            />
          </div>
        </div>
      </div>

      <RestaurantPicker />

      <CategoryRow selected={category} onSelect={setCategory} />

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-on-base-muted font-black tracking-widest uppercase">
          Mostrando resultados para <span className="text-on-base">"{query || 'todo'}"</span>
        </div>
        <div className="flex items-center gap-2 bg-surface-2 border-[3px] border-stroke-strong rounded-2xl px-4 py-1 shadow-brutal-sm">
           <span className="text-[10px] font-black text-on-base-muted uppercase tracking-widest">Ordenar por:</span>
           <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent outline-none text-xs font-bangers tracking-widest text-primary cursor-pointer"
           >
              <option value="popular">POPULARIDAD</option>
              <option value="price-low">MENOR PRECIO</option>
              <option value="price-high">MAYOR PRECIO</option>
              <option value="rating">MEJOR CALIFICADOS</option>
           </select>
        </div>
      </div>

      <PopularDishes query={query} category={category} sortBy={sortBy} />
    </div>
  );
};

