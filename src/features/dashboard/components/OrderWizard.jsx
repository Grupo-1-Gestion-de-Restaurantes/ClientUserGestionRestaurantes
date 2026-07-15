import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useClientStore } from '../store/useClientStore';
import { useOrderStore } from '../store/useOrderStore';
import { AlertCircle, Loader2, MapPin, Plus, Check, ChevronRight, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useUIStore } from '../../../shared/store/useUIStore';
import { showError, showSuccess } from '../../../shared/utils/toast';

const hasPhone = (source) => {
  const p = String(source?.phone || '').trim().replace(/\D/g, '');
  return p.length >= 8;
};

const getAddresses = (info) => {
  if (!info) return [];
  if (Array.isArray(info.addresses) && info.addresses.length > 0) {
    return info.addresses;
  }
  if (info.address && typeof info.address === 'object') {
    return [info.address];
  }
  return [];
};

/** Claves estables para el flag de “ya terminé el wizard” (id y email por si cambian entre mounts). */
const wizardDoneKeys = (user) => {
  const keys = [];
  const id = user?._id || user?.id;
  const email = user?.email;
  if (id) keys.push(`clientuser:orderWizardDone:${id}`);
  if (email) keys.push(`clientuser:orderWizardDone:email:${String(email).toLowerCase()}`);
  return keys;
};

const markWizardDone = (user) => {
  wizardDoneKeys(user).forEach((key) => localStorage.setItem(key, 'true'));
};

const isWizardMarkedDone = (user) =>
  wizardDoneKeys(user).some((key) => localStorage.getItem(key) === 'true');

export const OrderWizard = () => {
  const user = useAuthStore((s) => s.user);
  const userId = user?._id || user?.id;

  const [isOpen, setIsOpen] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const openedOnceRef = useRef(false);
  const phoneSyncedRef = useRef(false);
  const decidedRef = useRef(false);

  const fetchMyInfo = useClientStore((s) => s.fetchMyInfo);
  const addAddress = useClientStore((s) => s.addAddress);
  const updatePhone = useClientStore((s) => s.updatePhone);
  const info = useClientStore((s) => s.info);

  const isForcedOpen = useUIStore((s) => s.isOrderWizardOpen);
  const closeOrderWizard = useUIStore((s) => s.closeOrderWizard);

  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      address: {
        addressLine: '',
        houseNumber: '',
        alias: 'Casa',
        securityInfo: '',
        reference: ''
      }
    },
  });

  const setAddressId = useOrderStore((s) => s.setAddressId);
  const addressId = useOrderStore((s) => s.addressId);

  const addresses = useMemo(() => getAddresses(info), [info]);

  /** Teléfono efectivo: perfil cliente o el del registro/auth */
  const effectivePhone = useMemo(() => {
    const clientPhone = String(info?.phone || '').trim();
    const clientDigits = clientPhone.replace(/\D/g, '');
    if (clientDigits.length >= 8) return clientPhone;
    const authPhone = String(user?.phone || '').trim();
    const authDigits = authPhone.replace(/\D/g, '');
    if (authDigits.length >= 8) return authPhone;
    return clientPhone || authPhone || '';
  }, [info?.phone, user?.phone]);

  const phoneOk = hasPhone({ phone: effectivePhone });
  const setupComplete = phoneOk && addresses.length > 0;

  useEffect(() => {
    if (!userId) return;
    // Cargar perfil de inmediato (sin demora innecesaria)
    fetchMyInfo();
  }, [userId, fetchMyInfo]);

  // Si el cliente no tiene teléfono pero el usuario de auth sí (registro), lo persistimos una vez
  useEffect(() => {
    if (!userId || !info || phoneSyncedRef.current) return;
    if (hasPhone(info)) {
      phoneSyncedRef.current = true;
      return;
    }
    const authPhone = String(user?.phone || '').trim().replace(/\D/g, '');
    if (!/^\d{8,15}$/.test(authPhone)) return;

    phoneSyncedRef.current = true;
    (async () => {
      const res = await updatePhone(authPhone);
      if (res.success) {
        await fetchMyInfo();
      } else {
        phoneSyncedRef.current = false;
      }
    })();
  }, [userId, info, user?.phone, updatePhone, fetchMyInfo]);

  // Auto-seleccionar dirección por defecto / primera si falta addressId válido
  useEffect(() => {
    if (!addresses.length) return;
    const ids = addresses.map((a) => String(a._id || a.id || '')).filter(Boolean);
    if (addressId && ids.includes(String(addressId))) return;
    const preferred =
      addresses.find((a) => a.isDefault) || addresses[0];
    const id = preferred?._id || preferred?.id;
    if (id) setAddressId(id);
  }, [addresses, addressId, setAddressId]);

  /**
   * Auto-apertura del wizard:
   * - Forzado desde carrito → siempre abrir
   * - Perfil completo (tel + dirección) → NUNCA auto-abrir
   * - Flag "ya finalicé" en localStorage → NUNCA auto-abrir (aunque falle alguna detección)
   * - Solo abrir si falta algo y el usuario no ha finalizado antes
   */
  useEffect(() => {
    if (!userId) return;

    if (isForcedOpen) {
      setIsOpen(true);
      openedOnceRef.current = true;
      decidedRef.current = true;
      fetchMyInfo();
      return;
    }

    // Esperar a tener el perfil del cliente (no decidir con info=null)
    if (!info) return;

    // Ya tiene teléfono + dirección → marcar done y no molestar
    if (setupComplete) {
      markWizardDone(user);
      setIsOpen(false);
      decidedRef.current = true;
      return;
    }

    // El usuario ya dio FINALIZAR (o "más tarde") en una visita anterior → no reabrir
    if (isWizardMarkedDone(user)) {
      setIsOpen(false);
      decidedRef.current = true;
      return;
    }

    // Ya se abrió / se decidió en este montaje; no reabrir si el usuario lo cerró
    if (openedOnceRef.current || decidedRef.current) return;

    // Falta teléfono o dirección y nunca finalizó → mostrar
    openedOnceRef.current = true;
    decidedRef.current = true;
    setPhoneInput(effectivePhone);
    setEditingPhone(!phoneOk);
    setIsOpen(true);
  }, [
    userId,
    user,
    isForcedOpen,
    info,
    setupComplete,
    phoneOk,
    effectivePhone,
    fetchMyInfo,
  ]);

  useEffect(() => {
    if (!isOpen) return;
    if (addingAddress) return;
    reset({
      address: {
        addressLine: '',
        houseNumber: '',
        alias: 'Casa',
        securityInfo: '',
        reference: ''
      }
    });
  }, [addingAddress, isOpen, reset]);

  const handleSavePhone = async () => {
    const trimmed = phoneInput.trim();
    if (!trimmed || !/^\d{8,15}$/.test(trimmed)) {
      showError('Ingresa un número de teléfono válido (8 a 15 dígitos)');
      return;
    }
    const res = await updatePhone(trimmed);
    if (res.success) {
      showSuccess('Teléfono guardado');
      setEditingPhone(false);
      fetchMyInfo();
    } else {
      showError(res.error || 'No se pudo guardar el teléfono');
    }
  };

  const onAddAddress = async (data) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const payload = {
        addressLine: String(data?.address?.addressLine || '').trim(),
        houseNumber: String(data?.address?.houseNumber || '').trim(),
        alias: String(data?.address?.alias || 'Casa'),
        securityInfo: String(data?.address?.securityInfo || '').trim(),
        reference: String(data?.address?.reference || '').trim(),
      };
      const res = await addAddress(payload);
      if (res?.success) {
        const latestAddresses = useClientStore.getState().info?.addresses || [];
        const newest = latestAddresses[latestAddresses.length - 1];
        if (newest?._id) setAddressId(newest._id);
        setAddingAddress(false);
        reset({
          address: {
            addressLine: '',
            houseNumber: '',
            alias: 'Casa',
            securityInfo: '',
            reference: ''
          }
        });
      } else {
        const msg = res?.error || 'No se pudo guardar la dirección';
        setSubmitError(msg);
        showError(msg);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Error inesperado al guardar';
      setSubmitError(msg);
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const dismissWizard = () => {
    // Persistir "ya terminé / lo pospuse" para que no reaparezca al recargar o reentrar
    markWizardDone(user);
    decidedRef.current = true;
    openedOnceRef.current = true;
    setIsOpen(false);
    closeOrderWizard();
    window.dispatchEvent(new Event('orderWizardFinished'));
  };

  const handleFinish = () => {
    if (!phoneOk) {
      showError('Por favor ingresa y guarda tu número de teléfono.');
      return;
    }
    if (addresses.length === 0) {
      showError('Por favor agrega al menos una dirección de entrega.');
      return;
    }
    dismissWizard();
  };

  if (!isOpen) return null;

  const canFinish = phoneOk && addresses.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

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

        <div className="flex-1 overflow-y-auto mb-6 pr-2 max-h-[50vh] space-y-6">
          {/* Phone Number Section */}
          <div className="bg-surface-3 p-4 rounded-2xl border-[3px] border-stroke-strong">
            <h3 className="font-bangers text-xl text-on-base flex items-center gap-2 mb-2">
              <Phone className="text-secondary" /> Teléfono de Contacto
            </h3>
            {!phoneOk || editingPhone ? (
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="Ej. 55554444"
                    className="w-full bg-surface-1 text-on-base border-[3px] border-stroke-strong rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:border-secondary"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSavePhone}
                  className="bg-secondary text-on-secondary px-4 rounded-xl border-[3px] border-stroke-strong font-bangers tracking-widest text-[10px] uppercase shadow-brutal-sm"
                >
                  GUARDAR
                </button>
                {phoneOk && (
                  <button
                    type="button"
                    onClick={() => setEditingPhone(false)}
                    className="bg-surface-2 text-on-base px-3 rounded-xl border-[3px] border-stroke-strong text-xs font-semibold"
                  >
                    X
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between bg-surface-1 border-[3px] border-stroke-strong rounded-xl p-3">
                <span className="font-semibold text-on-base text-sm">{effectivePhone}</span>
                <button
                  type="button"
                  onClick={() => { setPhoneInput(effectivePhone); setEditingPhone(true); }}
                  className="text-xs text-secondary font-bangers tracking-widest hover:underline"
                >
                  CAMBIAR
                </button>
              </div>
            )}
          </div>

          <div className="animate-fade-in">
            <h3 className="font-bangers text-2xl text-on-base flex items-center gap-2 mb-4">
              <MapPin className="text-secondary" /> Direcciones de Entrega
            </h3>

            {addresses.length > 0 ? (
              <>
                <div className="space-y-3">
                  {addresses.map((addr) => {
                    const id = addr._id || addr.id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setAddressId(id)}
                        className={`w-full text-left p-4 rounded-2xl border-[3px] flex items-center justify-between transition-all ${
                          addressId === id
                            ? 'border-stroke-strong bg-secondary/10 shadow-brutal-sm'
                            : 'border-stroke-soft bg-surface-3 hover:border-stroke-strong'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-on-base truncate">
                            {addr.addressLine} {addr.houseNumber}
                          </div>
                          <div className="text-xs text-on-base-muted">
                            {addr.alias || 'Dirección'}
                            {addr.reference && ` — Ref: ${addr.reference}`}
                          </div>
                        </div>
                        {addressId === id && <Check className="text-secondary shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setAddingAddress(true)}
                  className="mt-4 flex items-center gap-2 text-sm font-bangers tracking-widest text-on-base bg-surface-3 px-4 py-2 rounded-xl border-[3px] border-stroke-strong hover:bg-surface-4 transition-colors"
                >
                  <Plus size={16} /> AGREGAR OTRA DIRECCIÓN
                </button>
              </>
            ) : addingAddress ? null : (
              <div className="p-6 bg-surface-3 border-[3px] border-dashed border-stroke-strong rounded-2xl text-center">
                <p className="text-sm text-on-base-muted mb-4">No tienes direcciones guardadas aún.</p>
                <button
                  type="button"
                  onClick={() => setAddingAddress(true)}
                  className="bg-primary text-on-primary px-6 py-2 rounded-xl font-bangers tracking-widest border-[3px] border-stroke-strong shadow-brutal-sm"
                >
                  AGREGAR MI PRIMERA DIRECCIÓN
                </button>
              </div>
            )}

            {addingAddress && (
              <form
                key="address-form"
                onSubmit={handleSubmit(onAddAddress)}
                noValidate
                className="flex flex-col gap-3 bg-surface-3 p-5 rounded-2xl border-[3px] border-stroke-strong shadow-brutal-sm"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-on-base-muted uppercase tracking-widest ml-1">Calle / Avenida</label>
                  <input
                    type="text"
                    placeholder="Ej. Av. Reforma"
                    disabled={submitting}
                    {...register('address.addressLine', { required: 'Ingresa la calle' })}
                    className="w-full bg-surface-1 text-on-base border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary disabled:opacity-60"
                  />
                  {errors.address?.addressLine && (
                    <span className="text-[10px] text-primary font-bold">{errors.address.addressLine.message}</span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-on-base-muted uppercase tracking-widest ml-1">Número de Casa / Apto</label>
                  <input
                    type="text"
                    placeholder="Ej. 12-45"
                    disabled={submitting}
                    {...register('address.houseNumber', { required: 'Ingresa el número' })}
                    className="w-full bg-surface-1 text-on-base border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary disabled:opacity-60"
                  />
                  {errors.address?.houseNumber && (
                    <span className="text-[10px] text-primary font-bold">{errors.address.houseNumber.message}</span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-on-base-muted uppercase tracking-widest ml-1">Alias</label>
                  <select
                    disabled={submitting}
                    {...register('address.alias')}
                    className="w-full bg-surface-1 text-on-base border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary disabled:opacity-60"
                  >
                    <option value="Casa">Casa</option>
                    <option value="Trabajo">Trabajo</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-on-base-muted uppercase tracking-widest ml-1">Información de Seguridad (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej. Garita de seguridad, tocar timbre 2B"
                    disabled={submitting}
                    {...register('address.securityInfo')}
                    className="w-full bg-surface-1 text-on-base border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary disabled:opacity-60"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-on-base-muted uppercase tracking-widest ml-1">Referencia (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej. Frente a parque central"
                    disabled={submitting}
                    {...register('address.reference')}
                    className="w-full bg-surface-1 text-on-base border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary disabled:opacity-60"
                  />
                </div>

                {submitError && (
                  <div className="flex items-start gap-2 rounded-xl bg-error/10 border-[2px] border-error px-3 py-2">
                    <AlertCircle size={14} className="text-error shrink-0 mt-0.5" />
                    <div className="text-[11px] font-bold text-error leading-snug">
                      {submitError}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => { setAddingAddress(false); setSubmitError(null); }}
                    disabled={submitting}
                    className="flex-1 bg-surface-2 text-on-base font-bangers tracking-widest py-3 rounded-xl border-[3px] border-stroke-strong disabled:opacity-60"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-primary text-on-primary font-bangers tracking-widest py-3 rounded-xl border-[3px] border-stroke-strong shadow-brutal-sm active:translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        GUARDANDO…
                      </>
                    ) : (
                      'GUARDAR'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-dashed border-stroke-soft">
          <button
            type="button"
            onClick={dismissWizard}
            className="text-[10px] font-black text-on-base-muted hover:text-primary transition-colors underline underline-offset-4 decoration-2 uppercase tracking-widest"
          >
            Hacerlo más tarde
          </button>
          <button
            type="button"
            onClick={handleFinish}
            disabled={!canFinish}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl border-[3px] border-stroke-strong bg-secondary text-on-secondary font-bangers tracking-widest text-xl shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 transition-all"
          >
            FINALIZAR <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
