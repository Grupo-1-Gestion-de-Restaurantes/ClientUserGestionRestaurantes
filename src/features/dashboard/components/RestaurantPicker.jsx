import { useState, useEffect } from 'react';
import { Store, ChevronDown } from 'lucide-react';
import { useRestaurantsStore } from '../store/useRestaurantsStore';
import { useOrderStore } from '../store/useOrderStore';

export const RestaurantPicker = () => {
  const restaurants = useRestaurantsStore((s) => s.restaurants);
  const selectedId = useRestaurantsStore((s) => s.selectedRestaurantId);
  const setSelected = useRestaurantsStore((s) => s.setSelectedRestaurant);
  const loading = useRestaurantsStore((s) => s.loading);
  const cartItems = useOrderStore((s) => s.cartItems);
  const clearCart = useOrderStore((s) => s.clearCart);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingRestaurantId, setPendingRestaurantId] = useState(null);
  const [localSelectValue, setLocalSelectValue] = useState(selectedId || '');

  useEffect(() => {
    if (!showConfirm) {
      setLocalSelectValue(selectedId || '');
    }
  }, [selectedId, showConfirm]);

  const selectedRestaurant = restaurants.find(r => (r._id || r.id) === selectedId);

  const handleChange = (newId) => {
    if (!newId) return;
    
    const hasItems = cartItems.length > 0;
    const isDifferent = newId !== selectedId;

    if (hasItems && isDifferent) {
      setPendingRestaurantId(newId);
      setShowConfirm(true);
    } else {
      setSelected(newId || null);
    }
  };

  const handleSelectChange = (e) => {
    const newId = e.target.value || null;
    if (!showConfirm) {
      handleChange(newId);
      setLocalSelectValue(e.target.value);
    }
  };

  const confirmChange = () => {
    clearCart();
    setSelected(pendingRestaurantId);
    setLocalSelectValue(pendingRestaurantId);
    setShowConfirm(false);
    setPendingRestaurantId(null);
  };

  const cancelChange = () => {
    setShowConfirm(false);
    setLocalSelectValue(selectedId || '');
    setPendingRestaurantId(null);
  };

  if (!restaurants.length && !loading) return null;

  return (
    <>
      <section className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-surface-2 border-[3px] border-stroke-strong rounded-3xl shadow-brutal-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border-2 border-primary">
            <Store size={18} className="text-primary" />
          </div>
          <div>
            <div className="text-on-base font-bangers tracking-wider text-xl leading-none">RESTAURANTE</div>
            <div className="text-[10px] text-on-base-muted font-black tracking-widest uppercase mt-1">
              ¿Dónde quieres pedir?
            </div>
          </div>
        </div>

        <div className="relative group min-w-[240px]">
          <select
            value={localSelectValue}
            onChange={handleSelectChange}
            className="w-full appearance-none bg-surface-3 border-[3px] border-stroke-strong rounded-2xl px-5 py-3 pr-12 text-sm font-bangers tracking-widest text-on-base cursor-pointer focus:border-secondary transition-all shadow-brutal-sm outline-none"
          >
            <option value="">SELECCIONAR LOCAL...</option>
            {restaurants.map((r) => (
              <option key={r._id || r.id} value={r._id || r.id}>
                {r.name.toUpperCase()}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-base-muted group-hover:text-secondary transition-colors">
            <ChevronDown size={18} />
          </div>
        </div>
      </section>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-1/90 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-surface-2 border-[3px] border-stroke-strong rounded-3xl shadow-brutal p-6">
            <h3 className="font-bangers text-2xl text-on-base mb-2">
              ¿Cambiar de restaurante?
            </h3>
            <p className="text-sm text-on-base-muted mb-6">
              Tu carrito tiene items de <strong>{selectedRestaurant?.name}</strong>. 
              Para pedir de otro lugar necesitas un pedido separate. 
              ¿Deseas resetear el carrito?
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelChange}
                className="flex-1 px-4 py-3 rounded-xl border-[3px] border-stroke-strong font-bangers tracking-widest text-on-base hover:bg-surface-3 transition-all"
              >
                MANTENER
              </button>
              <button
                onClick={confirmChange}
                className="flex-1 px-4 py-3 rounded-xl border-[3px] border-stroke-strong bg-primary text-on-primary font-bangers tracking-widest shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                RESETEAR
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
