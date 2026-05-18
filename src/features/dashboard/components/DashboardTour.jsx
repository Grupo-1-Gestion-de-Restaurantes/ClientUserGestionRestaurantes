import { useEffect, useMemo, useState } from 'react';
import { STATUS, Joyride } from 'react-joyride';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useRestaurantsStore } from '../store/useRestaurantsStore';
import { useClientStore } from '../store/useClientStore';
import { useOrderStore } from '../store/useOrderStore';
import { useUIStore } from '../../../shared/store/useUIStore';

export const DashboardTour = () => {
  const user = useAuthStore((s) => s.user);
  const [run, setRun] = useState(false);

  const selectedRestaurantId = useRestaurantsStore((s) => s.selectedRestaurantId);
  const clientInfo = useClientStore((s) => s.info);
  const fetchMyInfo = useClientStore((s) => s.fetchMyInfo);
  const orderType = useOrderStore((s) => s.orderType);
  const addressId = useOrderStore((s) => s.addressId);
  const requestId = useUIStore((s) => s.dashboardTourRequestId);

  const addresses = clientInfo?.addresses || (clientInfo?.address ? [clientInfo.address] : []);

  const isSetupComplete = useMemo(() => {
    const hasRestaurant = !!selectedRestaurantId;
    const hasAddress = addresses.length > 0;
    const hasSelectedAddress = !!addressId || addresses.some((a) => a.isDefault);

    if (!hasRestaurant) return false;
    if (orderType === 'delivery') return hasAddress && hasSelectedAddress;
    return true;
  }, [selectedRestaurantId, addresses, addressId, orderType]);

  useEffect(() => {
    if (!user?._id && !user?.id) return;
    if (!clientInfo) fetchMyInfo();
  }, [user, clientInfo, fetchMyInfo]);

  useEffect(() => {
    if (!user?._id && !user?.id) return;
    const userId = user._id || user.id;
    const key = `clientuser:onboarding:${userId}`;
    const state = localStorage.getItem(key);

    const shouldAutoRun = !state || (state === 'later' && !isSetupComplete);
    if (!shouldAutoRun) return;

    const timer = setTimeout(() => {
      setRun(true);
    }, 800);
    return () => clearTimeout(timer);
  }, [user, isSetupComplete]);

  useEffect(() => {
    if (!user?._id && !user?.id) return;
    if (!requestId) return;
    const timer = setTimeout(() => setRun(true), 250);
    return () => clearTimeout(timer);
  }, [user, requestId]);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      const userId = user?._id || user?.id;
      if (userId) {
        localStorage.setItem(
          `clientuser:onboarding:${userId}`,
          isSetupComplete ? 'done' : 'later',
        );
      }
    }
  };

  const steps = [
    {
      target: '#tour-sidebar',
      content: 'Aquí puedes navegar entre tus restaurantes, perfil e historial.',
      disableBeacon: true,
    },
    {
      target: '#tour-restaurants',
      content: 'Explora y selecciona tus restaurantes favoritos para ver sus platos.',
    },
    {
      target: '#tour-cart',
      content: 'Este es tu ticket. Aquí aparecerán los platos que agregues a tu pedido.',
    },
    {
      target: '#tour-history',
      content: 'Revisa tus pedidos anteriores y descarga tus facturas.',
    },
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      disableOverlayClose
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#5B5CF6',
          zIndex: 10000,
          backgroundColor: '#ffffff',
          textColor: '#0f172a',
        },
        buttonNext: {
          backgroundColor: '#22c55e',
          borderRadius: '8px',
          fontWeight: 'bold',
        },
        buttonBack: {
          color: '#64748b',
        },
      }}
      locale={{
        back: 'Atrás',
        close: 'Cerrar',
        last: 'Finalizar',
        next: 'Siguiente',
        open: 'Abrir diálogo',
        skip: 'Configurar después',
      }}
    />
  );
};
