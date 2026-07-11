export const normalizeRefId = (ref) => {
  if (!ref) return null;
  if (typeof ref === 'string') return ref;
  if (typeof ref === 'object') return ref._id || ref.id || null;
  return String(ref);
};

export const getApplicableDishIds = (promo) => {
  if (!promo?.dishesApplicables?.length) return null;
  return new Set(
    promo.dishesApplicables.map(normalizeRefId).filter(Boolean).map(String),
  );
};

export const isDishApplicableToPromo = (dishId, promo) => {
  const ids = getApplicableDishIds(promo);
  if (!ids) return true;
  return ids.has(String(dishId));
};

export const filterDishesForPromo = (promo, dishes) => {
  if (!Array.isArray(dishes)) return [];
  const ids = getApplicableDishIds(promo);
  if (!ids) return dishes;
  return dishes.filter((d) => ids.has(String(d._id || d.id)));
};
