import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle2, Mail } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { showError } from '../../../shared/utils/toast';

export const RegisterForm = ({ onSwitch }) => {
  const registerUser = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);

  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [pickedFile, setPickedFile] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const payload = { ...data };
    if (pickedFile) payload.profilePicture = pickedFile;
    const res = await registerUser(payload);
    if (res.success) {
      setRegisteredEmail(String(data.email || '').trim());
      setShowSuccessModal(true);
    } else if (res.error) {
      showError(res.error);
    }
  };

  const handleSuccessOk = () => {
    setShowSuccessModal(false);
    setRegisteredEmail('');
    onSwitch('login');
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setPickedFile(file || null);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const inputClass = (hasError) =>
    `bg-transparent border ${hasError ? 'border-red-500' : 'border-white/20'} rounded-xl p-2.5 text-sm focus:outline-none focus:border-secondary transition-colors placeholder:text-gray-500 disabled:opacity-50 text-white w-full box-border`;

  return (
    <>
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 w-full max-h-[55vh] sm:max-h-[65vh] overflow-y-auto pr-1 overflow-x-hidden pb-2"
      style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-secondary ml-1 font-medium">Nombre</label>
          <input
            type="text"
            placeholder="John"
            disabled={loading}
            {...register('name', { required: 'Obligatorio' })}
            className={inputClass(errors.name)}
          />
          {errors.name && <span className="text-red-500 text-xs ml-1">{errors.name.message}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-secondary ml-1 font-medium">Apellido</label>
          <input
            type="text"
            placeholder="Doe"
            disabled={loading}
            {...register('surname', { required: 'Obligatorio' })}
            className={inputClass(errors.surname)}
          />
          {errors.surname && (
            <span className="text-red-500 text-xs ml-1">{errors.surname.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-secondary ml-1 font-medium">Usuario</label>
          <input
            type="text"
            placeholder="johndoe123"
            disabled={loading}
            {...register('username', { required: 'Obligatorio' })}
            className={inputClass(errors.username)}
          />
          {errors.username && (
            <span className="text-red-500 text-xs ml-1">{errors.username.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-secondary ml-1 font-medium">Teléfono</label>
          <input
            type="tel"
            placeholder="00000000"
            disabled={loading}
            {...register('phone', {
              pattern: { value: /^\d{8,15}$/, message: 'Solo dígitos (8 a 15)' },
            })}
            className={inputClass(errors.phone)}
          />
          {errors.phone && (
            <span className="text-red-500 text-xs ml-1">{errors.phone.message}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-secondary ml-1 font-medium">Email</label>
        <input
          type="email"
          placeholder="Tu correo"
          disabled={loading}
          {...register('email', {
            required: 'El correo es obligatorio',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' },
          })}
          className={inputClass(errors.email)}
        />
        {errors.email && <span className="text-red-500 text-xs ml-1">{errors.email.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-secondary ml-1 font-medium">Contraseña</label>
        <input
          type="password"
          placeholder="••••••••"
          disabled={loading}
          {...register('password', {
            required: 'La contraseña es obligatoria',
            minLength: { value: 8, message: 'Mínimo 8 caracteres' },
          })}
          className={inputClass(errors.password)}
        />
        {errors.password && (
          <span className="text-red-500 text-xs ml-1">{errors.password.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-secondary ml-1 font-medium">Foto de perfil (Opcional)</label>
        <div className="flex items-center gap-3 mt-1">
          <div className="h-12 w-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              className="hidden"
            />
            <button
              type="button"
              disabled={loading}
              onClick={() => fileRef.current?.click()}
              className="bg-transparent border border-white/20 rounded-xl p-2.5 text-sm w-full text-center text-gray-400 hover:text-white hover:border-secondary transition-colors focus:outline-none flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Subir imagen
            </button>
          </div>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm text-center mt-1">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="relative flex items-center justify-center bg-secondary text-background-base font-bold p-2.5 rounded-xl mt-1 hover:bg-[#d6ba00] transition-all active:scale-[0.98] overflow-hidden disabled:opacity-80 shrink-0"
      >
        {loading ? (
          <svg
            className="w-5 h-5 animate-spin-slow text-background-base"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v2m0 12v2m8-8h-2M6 12H4m13.657-5.657l-1.414 1.414M7.757 17.657l-1.414 1.414m12.728 0l-1.414-1.414M7.757 6.343L6.343 4.929"
            />
          </svg>
        ) : (
          'Crear Cuenta'
        )}
      </button>

      <button
        type="button"
        onClick={() => onSwitch('login')}
        className="text-sm text-gray-400 hover:text-white transition-colors w-full text-center p-1"
      >
        ¿Ya tienes cuenta? <span className="font-bold ml-1 text-secondary">Inicia Sesión</span>
      </button>
    </form>

    {showSuccessModal && (
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-success-title"
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
        <div className="relative w-full max-w-md bg-background-base/95 border border-white/15 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 sm:p-8 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full bg-secondary/15 border border-secondary/40 flex items-center justify-center mb-4">
            <CheckCircle2 className="text-secondary" size={36} strokeWidth={2.25} />
          </div>

          <h2
            id="register-success-title"
            className="text-2xl sm:text-3xl font-bold text-white leading-tight"
          >
            ¡Gracias por <span className="text-secondary">registrarte</span>!
          </h2>

          <p className="mt-3 text-sm sm:text-base text-white/80 leading-relaxed">
            Tu cuenta se creó correctamente. Antes de iniciar sesión debes
            <span className="text-white font-semibold"> verificar tu correo electrónico</span>.
          </p>

          <div className="mt-5 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 flex items-start gap-3 text-left">
            <Mail className="text-primary shrink-0 mt-0.5" size={20} />
            <div className="min-w-0">
              <p className="text-sm text-white/90 leading-snug">
                Revisa tu bandeja de entrada{registeredEmail ? (
                  <>
                    {' '}
                    (<span className="font-semibold text-secondary break-all">{registeredEmail}</span>)
                  </>
                ) : null}{' '}
                y abre el enlace de verificación.
              </p>
              <p className="mt-2 text-xs text-white/55 leading-snug">
                Si no lo ves, revisa spam o correo no deseado. Cuando verifiques, ya podrás iniciar sesión.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSuccessOk}
            className="mt-6 w-full bg-secondary text-background-base font-bold p-3 rounded-xl hover:bg-[#d6ba00] transition-all active:scale-[0.98]"
          >
            Entendido, ir a iniciar sesión
          </button>
        </div>
      </div>
    )}
    </>
  );
};
