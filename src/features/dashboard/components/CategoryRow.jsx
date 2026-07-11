import { useMemo } from 'react';
import { buildCategoriesFromDishes, useDishesStore } from '../store/useDishesStore';
import { ChevronDown, Filter } from 'lucide-react';

export const CategoryRow = ({ selected, onSelect }) => {
  const dishes = useDishesStore((s) => s.dishes);
  const loading = useDishesStore((s) => s.loading);

  const categories = useMemo(() => buildCategoriesFromDishes(dishes), [dishes]);

  if (!categories.length && !loading) return null;

  return (
    <section className="mt-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none custom-scrollbar-hide">
        <button
          type="button"
          onClick={() => onSelect?.(null)}
          className={`shrink-0 rounded-2xl border-[3px] border-stroke-strong px-4 py-2.5 text-xs font-bangers tracking-widest uppercase transition-all shadow-brutal-sm ${
            selected === null
              ? 'bg-secondary text-on-secondary shadow-none'
              : 'bg-surface-2 text-on-base hover:bg-surface-3'
          }`}
        >
          TODAS
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect?.(c.id)}
            className={`shrink-0 rounded-2xl border-[3px] border-stroke-strong px-4 py-2.5 text-xs font-bangers tracking-widest uppercase transition-all shadow-brutal-sm ${
              selected === c.id
                ? 'bg-secondary text-on-secondary shadow-none'
                : 'bg-surface-2 text-on-base hover:bg-surface-3'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </section>
  );
};
