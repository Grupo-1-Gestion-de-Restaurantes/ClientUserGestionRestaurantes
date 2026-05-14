import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './router/AppRoutes';

export const App = () => {
  return (
    <BrowserRouter>
      {/* Aquí podrías tener tus ToastProviders, ThemeProviders, etc. */}
      <AppRoutes />
    </BrowserRouter>
  );
};