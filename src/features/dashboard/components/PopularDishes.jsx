import { Plus, Star } from 'lucide-react';
import { useDishesStore } from '../store/useDishesStore';
import { useOrderStore } from '../store/useOrderStore';
import { DishImage } from './DishImage';

export const PopularDishes = ({ query = '', category = null }) => {
  const dishes = useDishesStore((s) => s.dishes);
  const loading = useDishesStore((s) => s.loading);
  const error = useDishesStore((s) => s.error);
  const addItem = useOrderStore((s) => s.addItem);

  const normalized = String(query).trim().toLowerCase();

  let filtered = dishes;
  if (category) filtered = filtered.filter((d) => (d.category || 'Sin categoría') === category);
  if (normalized)
    filtered = filtered.filter((d) =>
      `${d.name || ''} ${d.description || ''}`.toLowerCase().includes(normalized),
    );

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-on-base font-bangers tracking-wider text-xl">PLATOS POPULARES</div>
          <div className="text-xs text-on-base-muted">
            {filtered.length} resultado{filtered.length === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border-[3px] border-stroke-strong bg-primary/10 px-4 py-3 text-sm text-primary font-bold">
          {error}
        </div>
      ) : null}

      {loading && !filtered.length ? (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-3xl bg-surface-2 border-[3px] border-stroke-strong h-44 animate-pulse"
            />
          ))}
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((d) => {
          const id = d._id || d.id;
          const price = Number(d.price) || 0;
          return (
            <div
              key={id}
              className="rounded-3xl bg-surface-2 border-[3px] border-stroke-strong p-5 shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] transition-all"
            >
              <div className="flex items-start justify-between">
                <DishImage
                  src={d.photo}
                  alt={d.name}
                  className="h-16 w-16 rounded-2xl border-[3px] border-stroke-strong"
                />
                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      dishId: id,
                      name: d.name,
                      photo: d.photo,
                      subtitle: d.description,
                      price,
                    })
                  }
                  className="h-10 w-10 rounded-2xl bg-primary text-on-primary flex items-center justify-center border-[3px] border-stroke-strong shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] transition-all"
                  aria-label={`Agregar ${d.name}`}
                >
                  <Plus size={18} strokeWidth={3} />
                </button>
              </div>

              <div className="mt-4">
                <div className="text-on-base font-bangers tracking-wide text-lg truncate">
                  {d.name}
                </div>
                {d.description ? (
                  <div className="text-xs text-on-base-muted line-clamp-2">{d.description}</div>
                ) : null}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-on-base font-bangers text-xl">${price.toFixed(2)}</div>
                {typeof d.rating === 'number' ? (
                  <div className="flex items-center gap-1 text-xs text-on-base-muted">
                    <Star size={14} className="text-secondary" fill="currentColor" />
                    <span className="font-semibold">{d.rating.toFixed(1)}</span>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {!loading && !filtered.length && !error ? (
        <div className="mt-6 rounded-3xl bg-surface-2 border-[3px] border-stroke-strong p-10 text-center text-sm text-on-base-muted">
          No encontramos platos que coincidan con tu búsqueda.
        </div>
      ) : null}
    </section>
  );
};
