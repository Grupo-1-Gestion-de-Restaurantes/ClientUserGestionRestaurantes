import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/useAuthStore';
import { showError, showSuccess } from '../../../shared/utils/toast';

export const ForgotPasswordForm = ({ onSwitch }) => {
  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset);
  const loading = useAuthStore((s) => s.loading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const res = await requestPasswordReset(data.email);
    if (res.success) {
      showSuccess('Instrucciones enviadas a tu correo');
      onSwitch('login');
    } else if (res.error) {
      showError(res.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      <p className="text-sm text-gray-400 mb-2">
        Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
      </p>

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
          className={`bg-transparent border ${
            errors.email ? 'border-red-500' : 'border-white/20'
          } rounded-xl p-3 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-gray-500 disabled:opacity-50`}
        />
        {errors.email && <span className="text-red-500 text-xs ml-1">{errors.email.message}</span>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="relative flex items-center justify-center bg-primary text-white font-bold p-3 rounded-xl mt-2 hover:bg-[#991f23] transition-all active:scale-[0.98] overflow-hidden disabled:opacity-80"
      >
        {loading ? (
          <svg
            className="w-5 h-5 animate-spin-slow text-white"
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
          'Enviar Instrucciones'
        )}
      </button>

      <button
        type="button"
        onClick={() => onSwitch('login')}
        className="text-sm border border-white/20 rounded-xl p-3 w-full hover:bg-white/5 hover:border-primary hover:text-white transition-colors"
      >
        Volver a <span className="font-bold ml-1 text-primary">Iniciar Sesión</span>
      </button>
    </form>
  );
};
