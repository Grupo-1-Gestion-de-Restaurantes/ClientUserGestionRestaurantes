import { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useClientStore } from '../store/useClientStore';
import { useRestaurantsStore } from '../store/useRestaurantsStore';
import { useOrderStore } from '../store/useOrderStore';
import { usePromotionsStore } from '../store/usePromotionsStore';
import { Check, ChevronRight, MapPin, Store, Utensils, Tag, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { DishImage } from './DishImage';
import { useUIStore } from '../../../shared/store/useUIStore';

export const OrderWizard = () => {
  const user = useAuthStore((s) => s.user);
  const [isOpen, setIsOpen] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  
  const [step, setStep] = useState(1);
  
  const fetchMyInfo = useClientStore((s) => s.fetchMyInfo);
  const addAddress = useClientStore((s) => s.addAddress);
  const info = useClientStore((s) => s.info);
  const loadingInfo = useClientStore((s) => s.loading);

  const isForcedOpen = useUIStore((s) => s.isOrderWizardOpen);
  const closeOrderWizard = useUIStore((s) => s.closeOrderWizard);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onAddAddress = async (data) => {
    const res = await addAddress(data.address);
    if (res.success) {
      reset();
      setAddingAddress(false);
      // We assume the backend updates `info` or we just fetch again
      await fetchMyInfo();
      // Wait for fetchMyInfo to update info, or just select it if we can get the ID.
      // We'll rely on the user clicking it if we don't know the exact ID yet.
    }
  };
  
  const fetchRestaurants = useRestaurantsStore((s) => s.fetchRestaurants);
  const restaurants = useRestaurantsStore((s) => s.restaurants);
  const selectedRestaurantId = useRestaurantsStore((s) => s.selectedRestaurantId);
  const setSelectedRestaurant = useRestaurantsStore((s) => s.setSelectedRestaurant);
  
  const fetchPromotions = usePromotionsStore((s) => s.fetchPromotions);
  const promotions = usePromotionsStore((s) => s.promotions);
  
  const cartItems = useOrderStore((s) => s.cartItems);
  const addItem = useOrderStore((s) => s.addItem);
  const setAddressId = useOrderStore((s) => s.setAddressId);
  const addressId = useOrderStore((s) => s.addressId);
  const setPromotionId = useOrderStore((s) => s.setPromotionId);
  const setPromoCode = useOrderStore((s) => s.setPromoCode);
  
  useEffect(() => {
    if (!user?._id && !user?.id) return;
    const userId = user._id || user.id;
    const key = `clientuser:orderWizardDone:${userId}`;
    const hasRun = localStorage.getItem(key);
    
    if (!hasRun) {
      setIsOpen(true);
      fetchMyInfo();
      fetchRestaurants();
      fetchPromotions();
    }
  }, [user, fetchMyInfo, fetchRestaurants, fetchPromotions]);

  useEffect(() => {
    if (!isForcedOpen) return;
    setIsOpen(true);
    fetchMyInfo();
    fetchRestaurants();
    fetchPromotions();
  }, [isForcedOpen, fetchMyInfo, fetchRestaurants, fetchPromotions]);
  
  const handleFinish = () => {
    const userId = user?._id || user?.id;
    if (userId) {
      localStorage.setItem(`clientuser:orderWizardDone:${userId}`, 'true');
    }
    setIsOpen(false);
    closeOrderWizard();
  };
  
  if (!isOpen) return null;
  
  const addresses = info?.addresses || (info?.address ? [info.address] : []);
  const selectedRestaurant = restaurants.find(r => (r._id || r.id) === selectedRestaurantId);
  const dishes = selectedRestaurant?.dishes || [];
  
  const validPromotions = promotions.filter(p => 
    p.restaurant === selectedRestaurantId && p.status === 'APROBADA'
  );
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface-1/90 backdrop-blur-sm" />
      
      <div className="relative w-full max-w-2xl bg-surface-2 border-[3px] border-stroke-strong rounded-3xl shadow-brutal p-6 md:p-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="mb-6">
          <div className="text-xs text-on-base-muted font-bangers tracking-widest uppercase mb-1">
            Primer Pedido
          </div>
          <h2 className="font-bangers text-3xl md:text-4xl text-on-base">
            ¡Preparando tu <span className="text-secondary">primera orden</span>!
          </h2>
          <p className="text-sm text-on-base-muted mt-2">
            Sigue estos rápidos pasos para realizar tu primer pedido.
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s} 
              className={`flex-1 h-3 rounded-full border-[3px] border-stroke-strong transition-colors ${
                step >= s ? 'bg-secondary' : 'bg-surface-3'
              }`}
            />
          ))}
        </div>
        
        {/* Step Content */}
        <div className="flex-1 overflow-y-auto mb-6 pr-2">
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="font-bangers text-2xl text-on-base flex items-center gap-2 mb-4">
                <MapPin className="text-secondary" /> 1. ¿A dónde enviamos?
              </h3>
              
              {!addingAddress ? (
                <>
                  {addresses.length > 0 ? (
                    <div className="space-y-3">
                      {addresses.map((addr) => {
                        const id = addr._id || addr.id;
                        return (
                          <button
                            key={id}
                            onClick={() => setAddressId(id)}
                            className={`w-full text-left p-4 rounded-2xl border-[3px] flex items-center justify-between ${
                              addressId === id 
                                ? 'border-stroke-strong bg-secondary/10 shadow-brutal-sm' 
                                : 'border-stroke-soft bg-surface-3 hover:border-stroke-strong'
                            }`}
                          >
                            <div>
                              <div className="font-semibold text-on-base">{addr.addressLine} {addr.houseNumber}</div>
                              <div className="text-xs text-on-base-muted">{addr.alias || 'Dirección'}</div>
                            </div>
                            {addressId === id && <Check className="text-secondary" />}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="p-4 bg-surface-3 border-[3px] border-stroke-strong rounded-2xl text-center mb-4">
                      <p className="text-sm text-on-base-muted mb-2">No tienes direcciones guardadas.</p>
                      <p className="text-xs font-semibold text-secondary">
                        Agrega una para poder enviarte el pedido.
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => setAddingAddress(true)}
                    className="mt-4 flex items-center gap-2 text-sm font-bangers tracking-widest text-on-base bg-surface-3 px-4 py-2 rounded-xl border-[3px] border-stroke-strong"
                  >
                    <Plus size={16} /> AGREGAR NUEVA DIRECCIÓN
                  </button>
                </>
              ) : (
                <form onSubmit={handleSubmit(onAddAddress)} className="flex flex-col gap-3 bg-surface-3 p-4 rounded-2xl border-[3px] border-stroke-strong">
                  <input
                    type="text"
                    placeholder="Ej. Av. Siempre Viva"
                    disabled={loadingInfo}
                    {...register('address.addressLine', { required: true })}
                    className="w-full bg-surface-1 text-on-base placeholder:text-on-base-faint border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary"
                  />
                  <input
                    type="text"
                    placeholder="Número (ej. 742)"
                    disabled={loadingInfo}
                    {...register('address.houseNumber', { required: true })}
                    className="w-full bg-surface-1 text-on-base placeholder:text-on-base-faint border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary"
                  />
                  <select
                    disabled={loadingInfo}
                    {...register('address.alias')}
                    className="w-full bg-surface-1 text-on-base border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary"
                  >
                    <option value="Casa">Casa</option>
                    <option value="Trabajo">Trabajo</option>
                    <option value="Otro">Otro</option>
                  </select>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setAddingAddress(false)}
                      className="flex-1 bg-surface-2 text-on-base font-bangers tracking-widest py-2 rounded-xl border-[3px] border-stroke-strong"
                    >
                      CANCELAR
                    </button>
                    <button
                      type="submit"
                      disabled={loadingInfo}
                      className="flex-1 bg-primary text-on-primary font-bangers tracking-widest py-2 rounded-xl border-[3px] border-stroke-strong shadow-brutal-sm"
                    >
                      GUARDAR
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
          
          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="font-bangers text-2xl text-on-base flex items-center gap-2 mb-4">
                <Store className="text-secondary" /> 2. Elige un Restaurante
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {restaurants.map(r => {
                  const id = r._id || r.id;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedRestaurant(id)}
                      className={`text-left p-4 rounded-2xl border-[3px] flex items-center gap-3 ${
                        selectedRestaurantId === id 
                          ? 'border-stroke-strong bg-secondary/10 shadow-brutal-sm' 
                          : 'border-stroke-soft bg-surface-3 hover:border-stroke-strong'
                      }`}
                    >
                      <img src={r.image || r.photo} alt="" className="w-12 h-12 rounded-xl object-cover border-2 border-stroke-strong bg-surface-1" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bangers tracking-wider text-xl text-on-base truncate">{r.name}</div>
                        <div className="text-xs text-on-base-muted truncate">{r.address}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="animate-fade-in">
              <h3 className="font-bangers text-2xl text-on-base flex items-center gap-2 mb-4">
                <Utensils className="text-secondary" /> 3. Agrega Platos
              </h3>
              {dishes.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {dishes.map(d => {
                    const id = d._id || d.id;
                    const inCart = cartItems.find(c => c.dishId === id);
                    return (
                      <div key={id} className="p-3 rounded-2xl border-[3px] border-stroke-strong bg-surface-3 flex items-center gap-4">
                        <DishImage src={d.photo} className="w-16 h-16 rounded-xl border-2 border-stroke-strong shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-on-base truncate">{d.name}</div>
                          <div className="text-sm font-bangers text-secondary">${Number(d.price).toFixed(2)}</div>
                        </div>
                        <button
                          onClick={() => addItem(d)}
                          className="shrink-0 h-10 px-4 rounded-xl font-bangers tracking-widest border-[3px] border-stroke-strong bg-primary text-on-primary shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px]"
                        >
                          {inCart ? `+${inCart.qty}` : 'AGREGAR'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center p-6 bg-surface-3 border-[3px] border-stroke-strong rounded-2xl">
                  Este restaurante aún no tiene platos. Puedes elegir otro.
                </div>
              )}
            </div>
          )}
          
          {step === 4 && (
            <div className="animate-fade-in">
              <h3 className="font-bangers text-2xl text-on-base flex items-center gap-2 mb-4">
                <Tag className="text-secondary" /> 4. ¿Aplicar Promo? (Opcional)
              </h3>
              {validPromotions.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {validPromotions.map(p => {
                    const id = p._id || p.id;
                    return (
                      <div key={id} className="p-4 rounded-2xl border-[3px] border-stroke-strong bg-surface-3 flex items-center justify-between gap-4">
                        <div>
                          <div className="font-bangers tracking-wider text-xl text-on-base">{p.name}</div>
                          <div className="text-sm text-on-base-muted">{p.description}</div>
                        </div>
                        <button
                          onClick={() => {
                            setPromotionId(id);
                            if (p.code) setPromoCode(p.code);
                          }}
                          className="shrink-0 h-10 px-4 rounded-xl font-bangers tracking-widest border-[3px] border-stroke-strong bg-secondary text-on-secondary shadow-brutal-sm"
                        >
                          APLICAR
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center p-6 bg-surface-3 border-[3px] border-stroke-strong rounded-2xl text-on-base-muted">
                  No hay promociones activas para este restaurante.
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-dashed border-stroke-soft">
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-4 py-2 text-sm font-bangers tracking-widest text-on-base-muted hover:text-on-base transition-colors"
            >
              VOLVER
            </button>
          ) : <div />}
          
          {step < 4 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={
                (step === 1 && !addressId && addresses.length > 0) || 
                (step === 2 && !selectedRestaurantId) ||
                (step === 3 && cartItems.length === 0 && dishes.length > 0)
              }
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border-[3px] border-stroke-strong bg-primary text-on-primary font-bangers tracking-widest text-lg shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0"
            >
              SIGUIENTE <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-3 rounded-2xl border-[3px] border-stroke-strong bg-secondary text-on-secondary font-bangers tracking-widest text-lg shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              ¡FINALIZAR Y VER CARRITO!
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
};
