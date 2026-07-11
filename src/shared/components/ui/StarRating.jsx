import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export const StarRating = ({
  value = 0,
  onChange,
  size = 22,
  readonly = false,
  showValue = false,
}) => {
  const interactive = !readonly && typeof onChange === 'function';
  const safeValue = Math.max(0, Math.min(5, Number(value) || 0));

  const handleClick = (star) => {
    if (interactive) onChange(star);
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="inline-flex items-center gap-1">
      <div className="inline-flex items-center gap-0.5">
        {stars.map((star) => {
          const filled = safeValue >= star;
          return (
            <motion.button
              key={star}
              type="button"
              whileHover={interactive ? { scale: 1.15 } : undefined}
              whileTap={interactive ? { scale: 0.9 } : undefined}
              onClick={() => handleClick(star)}
              disabled={!interactive}
              aria-label={`${star} estrella${star === 1 ? '' : 's'}`}
              className={`transition-colors ${
                interactive ? 'cursor-pointer' : 'cursor-default'
              } p-0.5 rounded-md ${interactive ? 'hover:bg-surface-3' : ''}`}
            >
              <Star
                size={size}
                strokeWidth={filled ? 1.5 : 2}
                className={filled ? 'text-primary' : 'text-on-base-muted'}
                fill={filled ? 'currentColor' : 'none'}
              />
            </motion.button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-bangers tracking-widest text-on-base-muted ml-1">
          {safeValue.toFixed(1)}
        </span>
      )}
    </div>
  );
};