import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageSquare, Store, Trash2 } from 'lucide-react';
import { useReviewsStore } from '../store/useReviewsStore';
import { showError, showSuccess } from '../../../shared/utils/toast';
import { StarRating } from '../../../shared/components/ui/StarRating';

const formatDate = (iso) => {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

export const MyReviewsPage = () => {
  const myComments = useReviewsStore((s) => s.myComments);
  const loading = useReviewsStore((s) => s.loading);
  const error = useReviewsStore((s) => s.error);
  const fetchMyComments = useReviewsStore((s) => s.fetchMyComments);
  const removeReview = useReviewsStore((s) => s.removeReview);

  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchMyComments();
  }, [fetchMyComments]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    const res = await removeReview(id);
    setDeletingId(null);
    if (res.success) showSuccess('Reseña eliminada');
    else showError(res.error || 'No se pudo eliminar');
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <header className="mb-8">
        <p className="text-xs text-on-base-muted tracking-widest uppercase">Tu actividad</p>
        <h1 className="mt-1 font-bangers tracking-wider text-4xl md:text-5xl text-on-base">
          Mis <span className="text-secondary">reseñas</span>
        </h1>
        <p className="mt-2 text-sm text-on-base-muted">
          Aquí están todas las calificaciones que has dejado en restaurantes.
        </p>
      </header>

      {error && (
        <div className="rounded-2xl border-[3px] border-stroke-strong bg-primary/10 px-4 py-3 text-sm text-primary font-bold mb-4">
          {error}
        </div>
      )}

      {loading && myComments.length === 0 ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 rounded-3xl bg-surface-2 border-[3px] border-stroke-strong animate-pulse" />
          ))}
        </div>
      ) : myComments.length === 0 ? (
        <div className="rounded-3xl bg-surface-2 border-[3px] border-stroke-strong p-10 text-center shadow-brutal-sm">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-surface-3 border-[3px] border-stroke-strong flex items-center justify-center">
            <MessageSquare size={22} className="text-on-base-muted" />
          </div>
          <div className="mt-4 text-on-base font-bangers tracking-wider text-2xl">
            AÚN NO HAS CALIFICADO
          </div>
          <p className="mt-1 text-sm text-on-base-muted">
            Cuando hagas un pedido podrás compartir tu experiencia.
          </p>
          <Link
            to="/dashboard/history"
            className="inline-flex items-center gap-2 mt-4 bg-secondary text-on-secondary px-5 py-2 rounded-xl border-[3px] border-stroke-strong shadow-brutal-sm font-bangers tracking-widest text-sm"
          >
            VER MI HISTORIAL
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {myComments.map((c) => {
            const restaurant = c.restaurantId || {};
            const restaurantId = restaurant._id || restaurant.id;
            const restaurantName = restaurant.name || 'Restaurante';
            const id = c._id || c.id;
            return (
              <li
                key={id}
                className="rounded-3xl bg-surface-2 border-[3px] border-stroke-strong p-5 shadow-brutal-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {restaurant.photo ? (
                      <img
                        src={restaurant.photo}
                        alt=""
                        className="h-12 w-12 rounded-2xl object-cover border-[3px] border-stroke-strong shrink-0"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong flex items-center justify-center text-primary shrink-0">
                        <Store size={20} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-bangers tracking-wide text-lg text-on-base truncate">
                        {restaurantName}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-on-base-muted">
                        <Calendar size={10} />
                        {formatDate(c.createdAt)}
                      </div>
                    </div>
                  </div>
                  <StarRating value={c.review} readonly size={16} />
                </div>

                <p className="mt-3 text-sm text-on-base whitespace-pre-wrap break-words">
                  {c.comment}
                </p>

                <div className="mt-4 flex items-center justify-end">
                  <button
                    type="button"
                    disabled={deletingId === id}
                    onClick={() => handleDelete(id)}
                    className="flex items-center gap-1 text-[10px] font-black tracking-widest uppercase text-on-base-muted hover:text-error transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={12} />
                    {deletingId === id ? 'Eliminando…' : 'Eliminar'}
                  </button>
                </div>

                {restaurantId && (
                  <Link
                    to={`/dashboard/restaurants/${restaurantId}`}
                    className="block text-[10px] font-black tracking-widest uppercase text-on-base-muted hover:text-primary transition-colors mt-2"
                  >
                    Ver restaurante →
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};