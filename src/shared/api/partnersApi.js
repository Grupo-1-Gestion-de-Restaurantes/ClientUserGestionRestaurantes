import { axiosGestion } from './api';

const hasApiBaseUrl = () => Boolean(import.meta.env.VITE_GESTION_URL);

/**
 * Envía un lead de "Registra tu restaurante" al backend.
 * Si VITE_GESTION_URL no está definida, hace un fallback mock con delay.
 */
export const submitPartnerLead = async (payload) => {
  if (!hasApiBaseUrl()) {
    await new Promise((r) => setTimeout(r, 900));
    console.info('[partnersApi:mock] lead enviado (no hay VITE_GESTION_URL):', payload);
    return { ok: true, id: `mock-${Date.now()}` };
  }

  const { data } = await axiosGestion.post('/partners/leads', payload);
  return data;
};
