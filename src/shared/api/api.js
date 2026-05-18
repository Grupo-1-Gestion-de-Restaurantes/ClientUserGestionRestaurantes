import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:5233/api/v1';
const GESTION_URL =
  import.meta.env.VITE_GESTION_URL || 'http://localhost:3007/gestionDeRestaurantes/v1';

export const axiosAuth = axios.create({
  baseURL: AUTH_URL,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

export const axiosGestion = axios.create({
  baseURL: GESTION_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

function attachToken(config) {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

axiosAuth.interceptors.request.use(attachToken);
axiosGestion.interceptors.request.use((config) => {
  config._axiosClient = 'gestion';
  return attachToken(config);
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
  failedQueue = [];
}

// El handler intercepta 401 (TokenExpired) y 403 con code TOKEN_EXPIRED, encola
// peticiones concurrentes mientras se refresca, y reintenta con el cliente axios
// que originó el fallo.
async function handleRefreshToken(error) {
  const original = error.config;
  if (!original || original._retry) {
    return Promise.reject(error);
  }

  const status = error.response?.status;
  const errorCode = error.response?.data?.error;
  const requestUrl = original.url || '';
  const isRefreshEndpoint = requestUrl.includes('/auth/refresh');
  const shouldRefresh =
    !isRefreshEndpoint &&
    (status === 401 || (status === 403 && errorCode === 'TOKEN_EXPIRED'));

  if (!shouldRefresh) {
    return Promise.reject(error);
  }

  const retryClient = original._axiosClient === 'gestion' ? axiosGestion : axiosAuth;

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return retryClient(original);
      })
      .catch((err) => Promise.reject(err));
  }

  original._retry = true;
  isRefreshing = true;
  const refreshToken = useAuthStore.getState().refreshToken;

  if (!refreshToken) {
    isRefreshing = false;
    useAuthStore.getState().logout();
    return Promise.reject(error);
  }

  try {
    const response = await axiosAuth.post('/auth/refresh', { refreshToken });
    const {
      accessToken,
      refreshToken: newRefreshToken,
      expiresAt,
      userDetails,
    } = response.data;

    useAuthStore.setState({
      token: accessToken,
      refreshToken: newRefreshToken,
      expiresAt,
      user: userDetails || useAuthStore.getState().user,
      isAuthenticated: true,
    });

    processQueue(null, accessToken);
    original.headers.Authorization = `Bearer ${accessToken}`;
    return retryClient(original);
  } catch (refreshError) {
    processQueue(refreshError, null);
    useAuthStore.getState().logout();
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
}

axiosAuth.interceptors.response.use((res) => res, handleRefreshToken);
axiosGestion.interceptors.response.use((res) => res, handleRefreshToken);
