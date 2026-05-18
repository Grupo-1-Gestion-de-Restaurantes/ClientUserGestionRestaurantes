import { useMemo } from 'react';
import { buildCategoriesFromDishes, useDishesStore } from '../store/useDishesStore';
import { DishImage } from './DishImage';

export const CategoryRow = ({ selected, onSelect }) => {
  const dishes = useDishesStore((s) => s.dishes);
  const loading = useDishesStore((s) => s.loading);

  const categories = useMemo(() => buildCategoriesFromDishes(dishes), [dishes]);

  if (!categories.length && !loading) return null;

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-on-base font-bangers tracking-wider text-xl">CATEGORÍAS</div>
          <div className="text-xs text-on-base-muted">
            {categories.length} categoría{categories.length === 1 ? '' : 's'} disponibles
          </div>
        </div>
        {selected ? (
          <button
            type="button"
            onClick={() => onSelect?.(null)}
            className="text-xs font-bold text-primary hover:text-secondary transition-colors"
          >
            Limpiar filtro
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2">
        {loading && !categories.length ? (
          <div className="text-xs text-on-base-muted">Cargando…</div>
        ) : null}

        {categories.map((c) => {
          const active = selected === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect?.(active ? null : c.id)}
              className={`shrink-0 w-24 rounded-2xl liquid-glass px-2 py-3 transition-all ${
                active
                  ? 'bg-secondary text-black font-bold'
                  : 'hover:bg-surface-3'
              }`}
            >
              <DishImage
                src={c.photo}
                alt={c.name}
                className="h-12 w-12 rounded-2xl mx-auto border border-stroke-soft"
                iconSize={18}
              />
              <div className="mt-2 text-[11px] font-bold uppercase tracking-wide truncate">
                {c.name}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
