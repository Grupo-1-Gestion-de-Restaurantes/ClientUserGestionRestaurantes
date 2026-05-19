import { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useClientStore } from '../store/useClientStore';
import { useOrderStore } from '../store/useOrderStore';
import { MapPin, Plus, Check, ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useUIStore } from '../../../shared/store/useUIStore';

export const OrderWizard = () => {
  const user = useAuthStore((s) => s.user);
  const [isOpen, setIsOpen] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  
  const fetchMyInfo = useClientStore((s) => s.fetchMyInfo);
  const addAddress = useClientStore((s) => s.addAddress);
  const info = useClientStore((s) => s.info);
  const loadingInfo = useClientStore((s) => s.loading);

  const isForcedOpen = useUIStore((s) => s.isOrderWizardOpen);
  const closeOrderWizard = useUIStore((s) => s.closeOrderWizard);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const setAddressId = useOrderStore((s) => s.setAddressId);
  const addressId = useOrderStore((s) => s.addressId);
  
  const addresses = info?.addresses || (info?.address ? [info.address] : []);
  
  const isSetupComplete = useMemo(() => {
    return addresses.length > 0 && (!!addressId || addresses.some(a => a.isDefault));
  }, [addresses, addressId]);

  useEffect(() => {
    if (!user?._id && !user?.id) return;
    const userId = user._id || user.id;
    const key = `clientuser:orderWizardDone:${userId}`;
    const hasRun = localStorage.getItem(key);
    
    if (!hasRun || !isSetupComplete) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        fetchMyInfo();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, isSetupComplete, fetchMyInfo]);

  useEffect(() => {
    if (!isForcedOpen) return;
    setIsOpen(true);
    fetchMyInfo();
  }, [isForcedOpen, fetchMyInfo]);
  
  const onAddAddress = async (data) => {
    const res = await addAddress(data.address);
    if (res.success) {
      reset();
      setAddingAddress(false);
      await fetchMyInfo();
    }
  };

  const handleFinish = () => {
    const userId = user?._id || user?.id;
    if (userId) {
      localStorage.setItem(`clientuser:orderWizardDone:${userId}`, 'true');
    }
    setIsOpen(false);
    closeOrderWizard();
    // Dispatch custom event to notify tour
    window.dispatchEvent(new Event('orderWizardFinished'));
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface-1/90 backdrop-blur-sm" />
      
      <div className="relative w-full max-w-lg bg-surface-2 border-[3px] border-stroke-strong rounded-3xl shadow-brutal p-6 md:p-8 flex flex-col">
        
        <div className="mb-6">
          <div className="text-xs text-on-base-muted font-black tracking-widest uppercase mb-1">
            Configuración Inicial
          </div>
          <h2 className="font-bangers text-3xl md:text-4xl text-on-base">
            ¡Ya casi estamos <span className="text-primary">listos</span>!
          </h2>
          <p className="text-sm text-on-base-muted mt-2">
            Necesitamos estos datos para que tus pedidos lleguen sin problemas.
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto mb-6 pr-2 max-h-[50vh] space-y-8">
          {/* SECCIÓN DIRECCIONES */}
          <div className="animate-fade-in">
            <h3 className="font-bangers text-2xl text-on-base flex items-center gap-2 mb-4">
              <MapPin className="text-secondary" /> Direcciones de Entrega
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
                          className={`w-full text-left p-4 rounded-2xl border-[3px] flex items-center justify-between transition-all ${
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
                  <div className="p-6 bg-surface-3 border-[3px] border-dashed border-stroke-strong rounded-2xl text-center mb-4">
                    <p className="text-sm text-on-base-muted mb-4">No tienes direcciones guardadas aún.</p>
                    <button
                      onClick={() => setAddingAddress(true)}
                      className="bg-primary text-on-primary px-6 py-2 rounded-xl font-bangers tracking-widest border-[3px] border-stroke-strong shadow-brutal-sm"
                    >
                      AGREGAR MI PRIMERA DIRECCIÓN
                    </button>
                  </div>
                )}
                
                {addresses.length > 0 && (
                  <button
                    onClick={() => setAddingAddress(true)}
                    className="mt-4 flex items-center gap-2 text-sm font-bangers tracking-widest text-on-base bg-surface-3 px-4 py-2 rounded-xl border-[3px] border-stroke-strong hover:bg-surface-4 transition-colors"
                  >
                    <Plus size={16} /> AGREGAR OTRA DIRECCIÓN
                  </button>
                )}
              </>
            ) : (
              <form onSubmit={handleSubmit(onAddAddress)} className="flex flex-col gap-3 bg-surface-3 p-5 rounded-2xl border-[3px] border-stroke-strong shadow-brutal-sm">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-on-base-muted uppercase tracking-widest ml-1">Calle / Avenida</label>
                  <input
                    type="text"
                    placeholder="Ej. Av. Reforma"
                    disabled={loadingInfo}
                    {...register('address.addressLine', { required: true })}
                    className="w-full bg-surface-1 text-on-base border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-on-base-muted uppercase tracking-widest ml-1">Número de Casa / Apto</label>
                  <input
                    type="text"
                    placeholder="Ej. 12-45"
                    disabled={loadingInfo}
                    {...register('address.houseNumber', { required: true })}
                    className="w-full bg-surface-1 text-on-base border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-on-base-muted uppercase tracking-widest ml-1">Alias (Ejem: Casa, Trabajo)</label>
                  <select
                    disabled={loadingInfo}
                    {...register('address.alias')}
                    className="w-full bg-surface-1 text-on-base border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary"
                  >
                    <option value="Casa">Casa</option>
                    <option value="Trabajo">Trabajo</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setAddingAddress(false)}
                    className="flex-1 bg-surface-2 text-on-base font-bangers tracking-widest py-3 rounded-xl border-[3px] border-stroke-strong"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="submit"
                    disabled={loadingInfo}
                    className="flex-1 bg-primary text-on-primary font-bangers tracking-widest py-3 rounded-xl border-[3px] border-stroke-strong shadow-brutal-sm active:translate-y-1"
                  >
                    GUARDAR
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-dashed border-stroke-soft">
          <button
            onClick={handleFinish}
            className="text-[10px] font-black text-on-base-muted hover:text-primary transition-colors underline underline-offset-4 decoration-2 uppercase tracking-widest"
          >
            Hacerlo más tarde
          </button>
          <button
            onClick={handleFinish}
            disabled={!addressId && !addresses.some(a => a.isDefault)}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl border-[3px] border-stroke-strong bg-secondary text-on-secondary font-bangers tracking-widest text-xl shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 transition-all"
          >
            FINALIZAR <ChevronRight size={20} />
          </button>
        </div>
        
      </div>
    </div>
  );
};
