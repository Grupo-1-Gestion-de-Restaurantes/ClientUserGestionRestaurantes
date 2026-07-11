import { useEffect, useState } from 'react';
import { MessageSquare, Store, X } from 'lucide-react';
import { StarRating } from '../../../shared/components/ui/StarRating';
import { useReviewsStore } from '../store/useReviewsStore';

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

const initials = (name) => {
  if (!name) return '?';
  return String(name).split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
};

export const RestaurantReviewsModal = ({ open, onClose, restaurantId, restaurantName, canReview = false, onAddReview }) => {
  const [loading, setLoading] = useState(false);
  const byRestaurant = useReviewsStore((s) => s.byRestaurant);
  const fetchRestaurantComments = useReviewsStore((s) => s.fetchRestaurantComments);

  const comments = byRestaurant[restaurantId] || [];

  useEffect(() => {
    if (!open || !restaurantId) return;
    setLoading(true);
    Promise.resolve(fetchRestaurantComments(restaurantId)).finally(() => setLoading(false));
  }, [open, restaurantId, fetchRestaurantComments]);

  if (!open) return null;

  const avg = comments.length
    ? comments.reduce((acc, c) => acc + Number(c.review || 0), 0) / comments.length
    : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div className="relative w-full max-w-lg bg-surface-2 border-[3px] border-stroke-strong rounded-3xl shadow-brutal p-6 md:p-8 flex flex-col max-h-[85vh]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 h-9 w-9 rounded-xl bg-surface-3 border-[2px] border-stroke-strong flex items-center justify-center"
        >
          <X size={16} />
        </button>

        <div className="text-xs text-on-base-muted font-black tracking-widest uppercase mb-1">
          Reseñas
        </div>
        <h2 className="font-bangers text-3xl md:text-4xl text-on-base flex items-center gap-2">
          <Store className="text-secondary" size={26} /> {restaurantName || 'Restaurante'}
        </h2>

        <div className="mt-4 flex items-center gap-4 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong px-4 py-3">
          <div className="font-bangers text-4xl text-on-base leading-none">
            {avg ? avg.toFixed(1) : '—'}
          </div>
          <div className="flex-1 min-w-0">
            <StarRating value={avg} readonly showValue={false} size={18} />
            <div className="text-[10px] font-black tracking-widest uppercase text-on-base-muted mt-1">
              {comments.length} reseña{comments.length === 1 ? '' : 's'}
            </div>
          </div>
          {canReview && onAddReview && (
            <button
              type="button"
              onClick={onAddReview}
              className="bg-primary text-on-primary px-3 py-2 rounded-xl border-[3px] border-stroke-strong shadow-brutal-sm text-[10px] font-bangers tracking-widest"
            >
              CALIFICAR
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto mt-5 pr-1 custom-scrollbar">
          {loading ? (
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong animate-pulse" />
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="rounded-2xl bg-surface-3 border-[3px] border-stroke-strong p-8 text-center">
              <MessageSquare className="mx-auto text-on-base-muted" size={28} />
              <div className="mt-3 font-bangers text-xl text-on-base">SIN RESEÑAS AÚN</div>
              <p className="text-xs text-on-base-muted mt-1">
                Sé el primero en compartir tu experiencia.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {comments.map((c) => (
                <li
                  key={c._id || c.id}
                  className="rounded-2xl bg-surface-3 border-[3px] border-stroke-strong p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bangers text-sm border-[2px] border-stroke-strong shrink-0">
                      {initials(c.clientId?.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-on-base truncate">
                        {c.clientId?.name || 'Cliente'}
                      </div>
                      <div className="text-[10px] text-on-base-muted">
                        {formatDate(c.createdAt)}
                      </div>
                    </div>
                    <StarRating value={c.review} readonly size={14} />
                  </div>
                  <p className="mt-3 text-sm text-on-base whitespace-pre-wrap break-words">
                    {c.comment}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};