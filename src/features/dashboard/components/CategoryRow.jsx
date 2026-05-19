import { useMemo } from 'react';
import { buildCategoriesFromDishes, useDishesStore } from '../store/useDishesStore';
import { ChevronDown, Filter } from 'lucide-react';

export const CategoryRow = ({ selected, onSelect }) => {
  const dishes = useDishesStore((s) => s.dishes);
  const loading = useDishesStore((s) => s.loading);

  const categories = useMemo(() => buildCategoriesFromDishes(dishes), [dishes]);

  if (!categories.length && !loading) return null;

  return (
    <section className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center border-2 border-secondary">
          <Filter size={18} className="text-secondary" />
        </div>
        <div>
          <div className="text-on-base font-bangers tracking-wider text-xl leading-none">FILTRAR</div>
          <div className="text-[10px] text-on-base-muted font-black tracking-widest uppercase mt-1">
            Por tipo de comida
          </div>
        </div>
      </div>

      <div className="relative group min-w-[200px]">
        <select
          value={selected || ''}
          onChange={(e) => onSelect?.(e.target.value || null)}
          className="w-full appearance-none bg-surface-2 border-[3px] border-stroke-strong rounded-2xl px-5 py-3 pr-12 text-sm font-bangers tracking-widest text-on-base cursor-pointer focus:border-primary transition-all shadow-brutal-sm outline-none"
        >
          <option value="">TODAS LAS CATEGORÍAS</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name.toUpperCase()}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-base-muted group-hover:text-primary transition-colors">
          <ChevronDown size={18} />
        </div>
      </div>
    </section>
  );
};
