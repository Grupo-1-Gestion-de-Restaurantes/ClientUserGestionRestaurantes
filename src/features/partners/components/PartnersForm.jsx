import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { usePartnersForm } from '../hooks/usePartnersForm';
import { usePartnersStore } from '../store/usePartnersStore';

const CUISINE_OPTIONS = [
  'Comida rápida',
  'Cafetería',
  'Peruana',
  'Mexicana',
  'Italiana',
  'Asiática',
  'Otra',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d\s\-()]{7,20}$/;

const fieldBase =
  'w-full bg-surface-1 text-on-base placeholder:text-on-base-faint border-[3px] border-stroke-strong rounded-lg px-4 py-3 font-medium focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30 transition-colors';

const Label = ({ htmlFor, children, required }) => (
  <label htmlFor={htmlFor} className="font-bangers text-sm tracking-widest uppercase text-on-base mb-1.5 block">
    {children} {required && <span className="text-primary">*</span>}
  </label>
);

const ErrorText = ({ children }) =>
  children ? <p className="text-primary text-xs font-bold mt-1.5">{children}</p> : null;

export const PartnersForm = () => {
  const { form, onSubmit } = usePartnersForm();
  const { register, formState: { errors } } = form;
  const status = usePartnersStore((s) => s.status);
  const errorMessage = usePartnersStore((s) => s.errorMessage);
  const leadId = usePartnersStore((s) => s.leadId);
  const reset = usePartnersStore((s) => s.reset);

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <section
      id="partners-form"
      className="relative w-full bg-transparent py-24 px-8 md:px-20 overflow-hidden border-t border-stroke-soft"
    >
      <div className="absolute inset-0 bg-grid-faint pointer-events-none" aria-hidden />
      <div className="absolute -top-32 right-[-10%] w-[420px] h-[420px] bg-radial-secondary opacity-30 pointer-events-none" aria-hidden />

      <div className="relative max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-secondary font-bangers tracking-[0.3em] text-sm md:text-base uppercase mb-3">
            Únete a la red
          </p>
          <h2 className="font-bangers text-5xl md:text-6xl text-on-base tracking-wider">
            Registra tu <span className="text-primary">restaurante</span>
          </h2>
          <p className="text-on-base-muted text-base md:text-lg mt-4 max-w-xl mx-auto">
            Completa el formulario y un partner manager te contactará en menos de 24 horas.
          </p>
        </div>

        {/* Success state */}
        {isSuccess ? (
          <div className="bg-surface-2 border-[3px] border-secondary shadow-brutal rounded-2xl p-10 text-center animate-fade-in-up">
            <CheckCircle2 className="text-secondary mx-auto" size={56} strokeWidth={2.5} />
            <h3 className="font-bangers text-3xl md:text-4xl text-on-base mt-5 tracking-wider">
              ¡SOLICITUD <span className="text-secondary">ENVIADA</span>!
            </h3>
            <p className="text-on-base-muted mt-3 max-w-md mx-auto">
              Recibimos tu información. Un partner manager te contactará en menos de 24 horas.
            </p>
            {leadId && (
              <p className="text-on-base-faint text-xs mt-4 font-bangers tracking-widest uppercase">
                ID de seguimiento: {leadId}
              </p>
            )}
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 mt-8 bg-secondary text-on-secondary font-bangers text-base uppercase tracking-wide px-5 py-2.5 rounded-lg border-[3px] border-stroke-strong shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] transition-all"
            >
              Enviar otra solicitud <ArrowRight size={16} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="bg-surface-2 border-[3px] border-stroke-strong shadow-brutal rounded-2xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* Restaurant name */}
            <div className="md:col-span-2">
              <Label htmlFor="restaurantName" required>Nombre del restaurante</Label>
              <input
                id="restaurantName"
                type="text"
                placeholder="Ej. Pizzería Estelar"
                className={fieldBase}
                aria-invalid={!!errors.restaurantName}
                {...register('restaurantName', {
                  required: 'Este campo es obligatorio',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                })}
              />
              <ErrorText>{errors.restaurantName?.message}</ErrorText>
            </div>

            {/* Contact name */}
            <div>
              <Label htmlFor="contactName" required>Nombre de contacto</Label>
              <input
                id="contactName"
                type="text"
                placeholder="Tu nombre"
                className={fieldBase}
                aria-invalid={!!errors.contactName}
                {...register('contactName', {
                  required: 'Este campo es obligatorio',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                })}
              />
              <ErrorText>{errors.contactName?.message}</ErrorText>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" required>Email</Label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className={fieldBase}
                aria-invalid={!!errors.email}
                {...register('email', {
                  required: 'Este campo es obligatorio',
                  pattern: { value: EMAIL_REGEX, message: 'Email inválido' },
                })}
              />
              <ErrorText>{errors.email?.message}</ErrorText>
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" required>Teléfono</Label>
              <input
                id="phone"
                type="tel"
                placeholder="+502 0000 0000"
                className={fieldBase}
                aria-invalid={!!errors.phone}
                {...register('phone', {
                  required: 'Este campo es obligatorio',
                  pattern: { value: PHONE_REGEX, message: 'Teléfono inválido' },
                })}
              />
              <ErrorText>{errors.phone?.message}</ErrorText>
            </div>

            {/* City / Address */}
            <div>
              <Label htmlFor="cityAddress" required>Ciudad / Dirección</Label>
              <input
                id="cityAddress"
                type="text"
                placeholder="Ciudad de Guatemala"
                className={fieldBase}
                aria-invalid={!!errors.cityAddress}
                {...register('cityAddress', {
                  required: 'Este campo es obligatorio',
                })}
              />
              <ErrorText>{errors.cityAddress?.message}</ErrorText>
            </div>

            {/* Branches */}
            <div>
              <Label htmlFor="branches" required>Número de sucursales</Label>
              <input
                id="branches"
                type="number"
                min={1}
                max={999}
                className={fieldBase}
                aria-invalid={!!errors.branches}
                {...register('branches', {
                  required: 'Este campo es obligatorio',
                  min: { value: 1, message: 'Debe ser al menos 1' },
                  max: { value: 999, message: 'Máximo 999' },
                  valueAsNumber: true,
                })}
              />
              <ErrorText>{errors.branches?.message}</ErrorText>
            </div>

            {/* Cuisine */}
            <div>
              <Label htmlFor="cuisine" required>Tipo de cocina</Label>
              <select
                id="cuisine"
                className={fieldBase}
                aria-invalid={!!errors.cuisine}
                defaultValue=""
                {...register('cuisine', {
                  required: 'Selecciona una opción',
                })}
              >
                <option value="" disabled>Selecciona…</option>
                {CUISINE_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ErrorText>{errors.cuisine?.message}</ErrorText>
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <Label htmlFor="message">Mensaje (opcional)</Label>
              <textarea
                id="message"
                rows={4}
                placeholder="Cuéntanos sobre tu restaurante…"
                className={`${fieldBase} resize-none`}
                aria-invalid={!!errors.message}
                {...register('message', {
                  maxLength: { value: 500, message: 'Máximo 500 caracteres' },
                })}
              />
              <ErrorText>{errors.message?.message}</ErrorText>
            </div>

            {/* Terms */}
            <div className="md:col-span-2 flex items-start gap-3">
              <input
                id="acceptTerms"
                type="checkbox"
                className="mt-1 w-5 h-5 accent-secondary cursor-pointer"
                aria-invalid={!!errors.acceptTerms}
                {...register('acceptTerms', { required: 'Debes aceptar los términos' })}
              />
              <label htmlFor="acceptTerms" className="text-on-base-muted text-sm">
                Acepto que un partner manager me contacte y la{' '}
                <a href="#" className="text-secondary underline hover:text-secondary/80">política de privacidad</a>.
                {errors.acceptTerms && (
                  <span className="block text-primary text-xs font-bold mt-1">
                    {errors.acceptTerms.message}
                  </span>
                )}
              </label>
            </div>

            {/* Error banner */}
            {isError && (
              <div className="md:col-span-2 flex items-start gap-3 bg-primary-soft border-[3px] border-primary rounded-lg px-4 py-3 animate-fade-in-up">
                <AlertCircle className="text-primary flex-shrink-0 mt-0.5" size={20} strokeWidth={2.5} />
                <div className="flex-1">
                  <p className="font-bangers tracking-wide text-on-base">No pudimos enviar tu solicitud</p>
                  <p className="text-on-base-muted text-sm mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="md:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-2">
              <p className="text-on-base-faint text-xs">
                Los campos marcados con <span className="text-primary font-bold">*</span> son obligatorios.
              </p>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 bg-secondary text-on-secondary font-bangers text-lg md:text-xl tracking-wide uppercase px-7 py-3 rounded-xl border-[3px] border-stroke-strong shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} strokeWidth={3} />
                    Enviando…
                  </>
                ) : (
                  <>
                    Enviar solicitud
                    <ArrowRight size={20} strokeWidth={3} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
