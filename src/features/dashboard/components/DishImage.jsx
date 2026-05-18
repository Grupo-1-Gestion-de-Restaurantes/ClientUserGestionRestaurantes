import { Utensils } from 'lucide-react';

export const DishImage = ({ src, alt = '', className = '', iconSize = 20 }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`object-cover ${className}`}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement?.querySelector('[data-dish-fallback]')?.removeAttribute('hidden');
        }}
      />
    );
  }
  return (
    <div
      data-dish-fallback
      className={`flex items-center justify-center bg-surface-3 text-on-base-muted ${className}`}
    >
      <Utensils size={iconSize} />
    </div>
  );
};
