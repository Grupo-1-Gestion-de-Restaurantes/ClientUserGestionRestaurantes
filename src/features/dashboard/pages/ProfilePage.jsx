import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Hash, LogOut, Mail, MapPin, Phone, Plus, User } from 'lucide-react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useClientStore } from '../store/useClientStore';
import { showError, showSuccess } from '../../../shared/utils/toast';

const Row = ({ icon: Icon, label, value, mono = false }) => (
  <div className="flex items-center gap-3 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong px-4 py-3">
    <Icon size={16} className="text-on-base-muted shrink-0" />
    <div className="min-w-0 flex-1">
      <div className="text-[11px] tracking-widest uppercase text-on-base-muted">{label}</div>
      <div
        className={`text-sm text-on-base font-semibold truncate ${
          mono ? 'font-mono tracking-tight' : ''
        }`}
      >
        {value || '—'}
      </div>
    </div>
  </div>
);

export const ProfilePage = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const info = useClientStore((s) => s.info);
  const loading = useClientStore((s) => s.loading);
  const error = useClientStore((s) => s.error);
  const fetchMyInfo = useClientStore((s) => s.fetchMyInfo);
  const updateMyInfo = useClientStore((s) => s.updateMyInfo);
  const addAddress = useClientStore((s) => s.addAddress);

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);

  const {
    register: regAddress,
    handleSubmit: handleAddress,
    reset: resetAddress,
    formState: { errors: errorsAddress },
  } = useForm();

  const {
    register: regProfile,
    handleSubmit: handleProfile,
    reset: resetProfile,
    formState: { errors: errorsProfile },
  } = useForm();

  useEffect(() => {
    fetchMyInfo();
  }, [fetchMyInfo]);

  useEffect(() => {
    if (info) {
      let formattedDate = "";
      if (info.birthdate) {
        const dateObj = new Date(info.birthdate);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString().split("T")[0];
        }
      }
      resetProfile({
        name: info.name || user?.name || '',
        phone: info.phone || '',
        birthdate: formattedDate,
        gender: info.gender || 'Masculino',
      });
    }
  }, [info, user, resetProfile]);

  const onAddAddress = async (data) => {
    const res = await addAddress(data.address);
    if (res.success) {
      showSuccess('Dirección agregada');
      resetAddress();
      setAdding(false);
      await fetchMyInfo();
    } else if (res.error) {
      showError(res.error);
    }
  };

  const onUpdateProfile = async (data) => {
    console.log('Updating profile with data:', data);
    const res = await updateMyInfo(data);
    if (res.success) {
      showSuccess('Perfil actualizado');
      setEditing(false);
      await fetchMyInfo();
    } else if (res.error) {
      showError(res.error);
    }
  };

  const addresses = info?.addresses || (info?.address ? [info.address] : []);

  return (
    <div id="tour-history" className="max-w-3xl mx-auto pb-12">
      <header className="mb-8">
        <p className="text-xs text-on-base-muted tracking-widest uppercase">Cuenta</p>
        <h1 className="mt-1 font-bangers tracking-wider text-4xl md:text-5xl text-on-base">
          Mi <span className="text-secondary">perfil</span>
        </h1>
      </header>

      <section className="rounded-3xl bg-surface-2 border-[3px] border-stroke-strong p-6 shadow-brutal-sm">
        <div className="flex items-center gap-4">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt=""
              className="h-16 w-16 rounded-2xl object-cover border-[3px] border-stroke-strong"
            />
          ) : (
            <div className="h-16 w-16 rounded-2xl bg-primary glow-primary-sm flex items-center justify-center text-on-primary font-bangers text-3xl border-[3px] border-stroke-strong">
              {(info?.name || user?.username || user?.name || 'U').slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-on-base font-bangers tracking-wide text-2xl truncate">
              {info?.name || user?.username || user?.name || 'Cliente'}
            </div>
          </div>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="flex items-center gap-2 bg-surface-3 text-on-base px-3 py-2 rounded-xl border-[3px] border-stroke-strong shadow-brutal-sm font-bangers tracking-widest text-sm"
            >
              {editing ? 'CANCELAR' : 'EDITAR'}
            </button>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 bg-primary text-on-primary px-3 py-2 rounded-xl border-[3px] border-stroke-strong shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] transition-all font-bangers tracking-widest text-sm"
            >
              <LogOut size={14} />
              SALIR
            </button>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleProfile(onUpdateProfile)} className="mt-6 space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-secondary font-bangers tracking-widest uppercase">Nombre</label>
              <input
                type="text"
                disabled={loading}
                {...regProfile('name', { required: 'El nombre es obligatorio' })}
                className="w-full bg-surface-3 text-on-base border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary"
              />
              {errorsProfile.name && (
                <span className="text-primary text-xs font-bold">{errorsProfile.name.message}</span>
              )}
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-secondary font-bangers tracking-widest uppercase">Teléfono</label>
              <input
                type="text"
                disabled={loading}
                {...regProfile('phone', { 
                  required: 'El teléfono es obligatorio',
                  pattern: { value: /^[0-9]{0,15}$/, message: 'Teléfono inválido (0-15 dígitos)' }
                })}
                className="w-full bg-surface-3 text-on-base border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary"
              />
              {errorsProfile.phone && (
                <span className="text-primary text-xs font-bold">{errorsProfile.phone.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-secondary font-bangers tracking-widest uppercase">Fecha de Nacimiento</label>
              <input
                type="date"
                disabled={loading}
                {...regProfile('birthdate')}
                className="w-full bg-surface-3 text-on-base border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-secondary font-bangers tracking-widest uppercase">Género</label>
              <select
                disabled={loading}
                {...regProfile('gender')}
                className="w-full bg-surface-3 text-on-base border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary"
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-on-secondary font-bangers tracking-widest py-3 rounded-xl border-[3px] border-stroke-strong shadow-brutal-sm"
            >
              {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </button>
          </form>
        ) : (
          <div className="mt-6 space-y-3">
            <Row icon={User} label="Nombre" value={info?.name || user?.username || user?.name} />
            <Row icon={Mail} label="Email" value={info?.email || user?.email} />
            <Row icon={Phone} label="Teléfono" value={info?.phone} />
            <Row icon={Hash} label="Género" value={info?.gender} />
            <Row icon={Calendar} label="Fecha de Nacimiento" value={info?.birthdate ? new Date(info.birthdate).toLocaleDateString('es-ES') : null} />
          </div>
        )}

        {error ? (
          <div className="mt-4 rounded-2xl border-[3px] border-stroke-strong bg-primary/10 px-4 py-3 text-sm text-primary font-bold">
            {error}
          </div>
        ) : null}
      </section>

      <section className="mt-6 rounded-3xl bg-surface-2 border-[3px] border-stroke-strong p-6 shadow-brutal-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-on-base font-bangers tracking-wider text-xl">DIRECCIONES</div>
            <div className="text-xs text-on-base-muted">
              Las usaremos para tus pedidos delivery
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            className="flex items-center gap-2 bg-secondary text-on-secondary px-3 py-2 rounded-xl border-[3px] border-stroke-strong shadow-brutal-sm font-bangers tracking-widest text-sm"
          >
            <Plus size={14} />
            {adding ? 'CANCELAR' : 'AGREGAR'}
          </button>
        </div>

        {adding ? (
          <form onSubmit={handleAddress(onAddAddress)} className="flex flex-col gap-3 mb-4">
            <input
              type="text"
              placeholder="Ej. Av. Siempre Viva"
              disabled={loading}
              {...regAddress('address.addressLine', { required: 'Ingresa una calle o avenida' })}
              className="w-full bg-surface-3 text-on-base placeholder:text-on-base-faint border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary"
            />
            {errorsAddress.address?.addressLine && (
              <span className="text-primary text-xs font-bold">{errorsAddress.address.addressLine.message}</span>
            )}
            
            <input
              type="text"
              placeholder="Número (ej. 742)"
              disabled={loading}
              {...regAddress('address.houseNumber', { required: 'Ingresa un número' })}
              className="w-full bg-surface-3 text-on-base placeholder:text-on-base-faint border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary"
            />
            {errorsAddress.address?.houseNumber && (
              <span className="text-primary text-xs font-bold">{errorsAddress.address.houseNumber.message}</span>
            )}
            
            <select
              disabled={loading}
              {...regAddress('address.alias')}
              className="w-full bg-surface-3 text-on-base border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary"
            >
              <option value="Casa">Casa</option>
              <option value="Trabajo">Trabajo</option>
              <option value="Otro">Otro</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-primary text-on-primary font-bangers tracking-widest py-2 rounded-xl border-[3px] border-stroke-strong shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] transition-all"
            >
              GUARDAR
            </button>
          </form>
        ) : null}

        {addresses.length ? (
          <ul className="space-y-2">
            {addresses.map((addr, i) => (
              <li
                key={`${addr?._id || i}`}
                className="flex items-center gap-3 bg-surface-3 border-[3px] border-stroke-strong rounded-2xl px-4 py-3 text-sm font-semibold"
              >
                <MapPin size={14} className="text-secondary shrink-0" />
                <span className="truncate flex-1">
                  {addr?.addressLine} {addr?.houseNumber}
                </span>
                {addr?.alias ? (
                  <span className="shrink-0 text-[10px] font-bangers uppercase tracking-widest bg-surface-2 border-2 border-stroke-strong px-2 py-0.5 rounded-full">
                    {addr.alias}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-on-base-muted">No has registrado direcciones aún.</div>
        )}
      </section>
    </div>
  );
};
