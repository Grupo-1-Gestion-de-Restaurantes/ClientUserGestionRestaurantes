import { httpClient, hasApiBaseUrl } from './httpClient';

/**
 * Envía un lead de "Registra tu restaurante" al backend.
 * Si VITE_API_URL no está definida, hace un fallback mock con delay.
 *
 * @param {{
 *   restaurantName: string,
 *   contactName: string,
 *   email: string,
 *   phone: string,
 *   cityAddress: string,
 *   branches: number,
 *   cuisine: string,
 *   message?: string,
 *   acceptTerms: boolean,
 * }} payload
 * @returns {Promise<{ ok: boolean, id: string }>}
 */
export const submitPartnerLead = async (payload) => {
  if (!hasApiBaseUrl()) {
    await new Promise((r) => setTimeout(r, 900));
    // eslint-disable-next-line no-console
    console.info('[partnersApi:mock] lead enviado (no hay VITE_API_URL):', payload);
    return { ok: true, id: `mock-${Date.now()}` };
  }

  const { data } = await httpClient.post('/partners/leads', payload);
  return data;
};
