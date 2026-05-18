import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Hash, LogOut, Mail, MapPin, Phone, Plus, User } from 'lucide-react';
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
  const addAddress = useClientStore((s) => s.addAddress);

  const [adding, setAdding] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchMyInfo();
  }, [fetchMyInfo]);

  const onAddAddress = async (data) => {
    const res = await addAddress(data.address);
    if (res.success) {
      showSuccess('Dirección agregada');
      reset();
      setAdding(false);
    } else if (res.error) {
      showError(res.error);
    }
  };

  const addresses = info?.addresses || info?.address ? [].concat(info?.addresses || info?.address) : [];

  return (
    <div className="max-w-3xl mx-auto">
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
              {(user?.username || user?.name || 'U').slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-on-base font-bangers tracking-wide text-2xl truncate">
              {user?.username || user?.name || 'Cliente'}
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="ml-auto flex items-center gap-2 bg-primary text-on-primary px-3 py-2 rounded-xl border-[3px] border-stroke-strong shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] transition-all font-bangers tracking-widest text-sm"
          >
            <LogOut size={14} />
            SALIR
          </button>
        </div>

        <div className="mt-6 space-y-3">
          <Row icon={User} label="Nombre" value={user?.username || user?.name} />
          <Row icon={Mail} label="Email" value={info?.email || user?.email} />
          <Row icon={Phone} label="Teléfono" value={info?.phone} />
        </div>

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
          <form onSubmit={handleSubmit(onAddAddress)} className="flex flex-col gap-3 mb-4">
            <input
              type="text"
              placeholder="Ej. Av. Siempre Viva"
              disabled={loading}
              {...register('address.addressLine', { required: 'Ingresa una calle o avenida' })}
              className="w-full bg-surface-3 text-on-base placeholder:text-on-base-faint border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary"
            />
            {errors.address?.addressLine && (
              <span className="text-primary text-xs font-bold">{errors.address.addressLine.message}</span>
            )}
            
            <input
              type="text"
              placeholder="Número (ej. 742)"
              disabled={loading}
              {...register('address.houseNumber', { required: 'Ingresa un número' })}
              className="w-full bg-surface-3 text-on-base placeholder:text-on-base-faint border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary"
            />
            {errors.address?.houseNumber && (
              <span className="text-primary text-xs font-bold">{errors.address.houseNumber.message}</span>
            )}
            
            <select
              disabled={loading}
              {...register('address.alias')}
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
