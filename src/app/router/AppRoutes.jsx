import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../../features/home/pages/HomePage';
import { PartnersPage } from '../../features/partners/pages/PartnersPage';
import { DashboardLayout } from '../../features/dashboard/layout/DashboardLayout';
import { DashboardHomePage } from '../../features/dashboard/pages/DashboardHomePage';
import { RestaurantsPage } from '../../features/dashboard/pages/RestaurantsPage';
import { RestaurantDetailPage } from '../../features/dashboard/pages/RestaurantDetailPage';
import { PromotionsPage } from '../../features/dashboard/pages/PromotionsPage';
import { ProfilePage } from '../../features/dashboard/pages/ProfilePage';
import { OrderHistoryPage } from '../../features/dashboard/pages/OrderHistoryPage';
import { ReservationsPage } from '../../features/dashboard/pages/ReservationsPage';
import { EventsPage } from '../../features/dashboard/pages/EventsPage';
import { MyReviewsPage } from '../../features/dashboard/pages/MyReviewsPage';
import { AuthPage } from '../../features/auth/pages/AuthPage';
import { VerifyEmailPage } from '../../features/auth/pages/VerifyEmailPage';
import { ResetPasswordPage } from '../../features/auth/pages/ResetPasswordPage';
import { UnauthorizedPage } from '../../features/auth/pages/UnauthorizedPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/partners" element={<PartnersPage />} />

      <Route path="/auth" element={<AuthPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHomePage />} />
        <Route path="restaurants" element={<RestaurantsPage />} />
        <Route path="restaurants/:id" element={<RestaurantDetailPage />} />
        <Route path="promotions" element={<PromotionsPage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="history" element={<OrderHistoryPage />} />
        <Route path="reviews" element={<MyReviewsPage />} />
      </Route>

      <Route
        path="*"
        element={
          <div className="flex flex-col items-center justify-center h-screen bg-surface-1 text-on-base font-bold text-2xl">
            <h1 className="text-secondary font-bangers text-7xl md:text-8xl mb-4 tracking-wider">
              404
            </h1>
            <p className="font-bangers tracking-wider">Estación Espacial No Encontrada</p>
            <a
              href="/"
              className="mt-8 px-6 py-2 border-[3px] border-stroke-strong bg-secondary text-on-secondary rounded-lg shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] transition-all font-bangers tracking-wide"
            >
              Volver a la Base
            </a>
          </div>
        }
      />
    </Routes>
  );
};
