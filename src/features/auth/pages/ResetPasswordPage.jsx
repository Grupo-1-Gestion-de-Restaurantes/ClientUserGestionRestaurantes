import { useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/useAuthStore';
import { showError, showSuccess } from '../../../shared/utils/toast';

export const ResetPasswordPage = () => {
  const { token: tokenParam } = useParams();
  const [search] = useSearchParams();
  const token = tokenParam || search.get('token') || '';
  const email = search.get('email') || '';

  const navigate = useNavigate();
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const loading = useAuthStore((s) => s.loading);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    document.title = 'Restablecer contraseña · Express';
  }, []);

  const onSubmit = async (data) => {
    if (!email || !token) {
      showError('El enlace de restablecimiento es inválido.');
      return;
    }
    const res = await resetPassword(email, token, data.password);
    if (res.success) {
      showSuccess('Contraseña actualizada');
      navigate('/auth');
    } else if (res.error) {
      showError(res.error);
    }
  };

  const password = watch('password');

  const inputClass = (hasError) =>
    `w-full bg-surface-3 text-on-base placeholder:text-on-base-faint border-[3px] ${
      hasError ? 'border-primary' : 'border-stroke-strong'
    } rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary transition-colors disabled:opacity-60`;

  return (
    <main className="relative min-h-screen w-full font-sans text-on-base flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-surface-2 border-[3px] border-stroke-strong rounded-3xl p-8 shadow-brutal">
        <h1 className="font-bangers tracking-wider text-3xl text-on-base">NUEVA CONTRASEÑA</h1>
        <p className="text-sm text-on-base-muted mt-1 mb-6">
          Elige una nueva clave segura y no la olvides esta vez.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-secondary font-bangers tracking-widest uppercase">
              Nueva contraseña
            </label>
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
              <span className="text-primary text-xs font-bold">{errors.password.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-secondary font-bangers tracking-widest uppercase">
              Confirmar contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              disabled={loading}
              {...register('confirmPassword', {
                required: 'Confirma la contraseña',
                validate: (value) => value === password || 'Las contraseñas no coinciden',
              })}
              className={inputClass(errors.confirmPassword)}
            />
            {errors.confirmPassword && (
              <span className="text-primary text-xs font-bold">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-primary text-on-primary font-bangers tracking-widest text-xl py-3 rounded-xl border-[3px] border-stroke-strong shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {loading ? 'GUARDANDO…' : 'GUARDAR CONTRASEÑA'}
          </button>

          <Link
            to="/auth"
            className="text-center text-sm font-bold border-[3px] border-stroke-strong rounded-xl py-3 bg-surface-3 hover:bg-surface-4 transition-colors"
          >
            ← Volver al <span className="text-primary font-bangers tracking-wider ml-1">LOGIN</span>
          </Link>
        </form>
      </div>
    </main>
  );
};
