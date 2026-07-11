import { useEffect, useState } from 'react';
import { Send, Star, X } from 'lucide-react';
import { StarRating } from '../../../shared/components/ui/StarRating';
import { useReviewsStore } from '../store/useReviewsStore';
import { showError, showSuccess } from '../../../shared/utils/toast';

export const ReviewModal = ({ open, onClose, onReviewed, restaurantId, restaurantName, orderId }) => {
  const [review, setReview] = useState(0);
  const [comment, setComment] = useState('');

  const submitReview = useReviewsStore((s) => s.submitReview);
  const submitting = useReviewsStore((s) => s.submitting);
  const clearError = useReviewsStore((s) => s.clearError);

  useEffect(() => {
    if (open) {
      setReview(0);
      setComment('');
      clearError();
    }
  }, [open, clearError]);

  if (!open) return null;

  const trimmed = comment.trim();
  const canSubmit = review >= 1 && review <= 5 && trimmed.length > 0 && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const res = await submitReview({ restaurantId, review, comment: trimmed });
    if (res.success) {
      showSuccess('¡Gracias por tu reseña!');
      onReviewed?.(orderId);
      onClose?.(res.data);
    } else {
      showError(res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-surface-2 border-[3px] border-stroke-strong rounded-3xl shadow-brutal p-6 md:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 h-9 w-9 rounded-xl bg-surface-3 border-[2px] border-stroke-strong flex items-center justify-center"
        >
          <X size={16} />
        </button>

        <div className="text-xs text-on-base-muted font-black tracking-widest uppercase mb-1">
          Tu opinión
        </div>
        <h2 className="font-bangers text-3xl md:text-4xl text-on-base mb-1">
          Califica tu <span className="text-primary">experiencia</span>
        </h2>
        {restaurantName && (
          <p className="text-sm text-on-base-muted mb-6">
            en <span className="font-semibold text-on-base">{restaurantName}</span>
          </p>
        )}

        <div className="rounded-2xl bg-surface-3 border-[3px] border-stroke-strong p-5">
          <div className="text-[10px] font-black text-on-base-muted uppercase tracking-widest mb-3">
            ¿Cómo calificarías la experiencia?
          </div>
          <div className="flex items-center justify-between gap-2">
            <StarRating value={review} onChange={setReview} size={32} />
            <span className="text-xs font-bangers tracking-widest text-on-base-muted">
              {review > 0 ? `${review}/5` : '—'}
            </span>
          </div>
          <div className="mt-3 flex justify-between text-[10px] font-black uppercase tracking-widest text-on-base-muted">
            <span>Mala</span>
            <span>Regular</span>
            <span>Increíble</span>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-black text-on-base-muted uppercase tracking-widest">
              Cuéntanos más
            </div>
            <div className="text-[10px] font-bangers tracking-widest text-on-base-muted">
              {trimmed.length}/500
            </div>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 500))}
            placeholder="¿Qué fue lo que más te gustó? ¿Qué mejorarías?"
            rows={4}
            className="w-full bg-surface-1 text-on-base border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-5 w-full bg-secondary text-on-secondary font-bangers tracking-widest text-lg py-3 rounded-2xl border-[3px] border-stroke-strong shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {submitting ? 'ENVIANDO…' : (<><Send size={16} /> ENVIAR RESEÑA</>)}
        </button>
      </form>
    </div>
  );
};