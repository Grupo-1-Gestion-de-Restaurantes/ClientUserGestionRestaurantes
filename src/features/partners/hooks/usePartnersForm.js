import { useForm } from 'react-hook-form';
import { submitPartnerLead } from '../../../shared/api/partnersApi';
import { usePartnersStore } from '../store/usePartnersStore';

export const DEFAULT_VALUES = {
  restaurantName: '',
  contactName: '',
  email: '',
  phone: '',
  cityAddress: '',
  city: 'Guatemala',
  categories: '',
  openingTime: '',
  closingTime: '',
  capacity: 1,
  message: '',
  acceptTerms: false,
};

export const usePartnersForm = () => {
  const setLoading = usePartnersStore((s) => s.setLoading);
  const setSuccess = usePartnersStore((s) => s.setSuccess);
  const setError = usePartnersStore((s) => s.setError);

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    mode: 'onBlur',
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading();
    try {
      const res = await submitPartnerLead({
        ...values,
        capacity: Number(values.capacity),
      });
      setSuccess(res?.id ?? null);
      form.reset(DEFAULT_VALUES);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'No se pudo enviar la solicitud. Inténtalo nuevamente.';
      setError(msg);
    }
  });

  return { form, onSubmit };
};
