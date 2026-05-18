import { useEffect, useState } from 'react';
import { DashboardTopbar } from '../components/DashboardTopbar';
import { CategoryRow } from '../components/CategoryRow';
import { PopularDishes } from '../components/PopularDishes';
import { RestaurantPicker } from '../components/RestaurantPicker';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useDishesStore } from '../store/useDishesStore';
import { useRestaurantsStore } from '../store/useRestaurantsStore';

export const DashboardHomePage = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(null);

  const user = useAuthStore((s) => s.user);
  const greetingName = user?.username || user?.name || '';

  const fetchDishes = useDishesStore((s) => s.fetchDishes);
  const fetchRestaurants = useRestaurantsStore((s) => s.fetchRestaurants);

  useEffect(() => {
    fetchDishes();
    fetchRestaurants();
  }, [fetchDishes, fetchRestaurants]);

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-6">
        <p className="text-xs text-on-base-muted tracking-widest uppercase">
          Hola{greetingName ? `, ${greetingName.split(' ')[0]}` : ''}
        </p>
        <h1 className="mt-1 font-bangers tracking-wider text-4xl md:text-5xl text-on-base">
          ¿Qué quieres <span className="text-secondary">pedir hoy</span>?
        </h1>
      </header>

      <DashboardTopbar value={query} onChange={setQuery} />

      <RestaurantPicker />

      <CategoryRow selected={category} onSelect={setCategory} />

      <PopularDishes query={query} category={category} />
    </div>
  );
};
