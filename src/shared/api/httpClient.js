import axios from 'axios';

/**
 * httpClient — instancia compartida de axios.
 * baseURL se toma de VITE_API_URL (puede ser undefined; los consumidores
 * implementan fallback mock cuando corresponda).
 */
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const hasApiBaseUrl = () => Boolean(import.meta.env.VITE_API_URL);
