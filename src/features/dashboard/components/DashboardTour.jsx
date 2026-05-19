import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useUIStore } from '../../../shared/store/useUIStore';

export const DashboardTour = () => {
  const user = useAuthStore((s) => s.user);
  const requestId = useUIStore((s) => s.dashboardTourRequestId);

  useEffect(() => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    const tourKey = `clientuser:onboarding:${userId}`;
    const wizardKey = `clientuser:orderWizardDone:${userId}`;

    const startTour = () => {
      const driverObj = driver({
        showProgress: true,
        allowClose: true,
        overlayColor: '#000000aa',
        nextBtnText: 'Siguiente',
        prevBtnText: 'Atrás',
        doneBtnText: 'Finalizar',
        steps: [
          {
            element: '#tour-sidebar',
            popover: {
              title: 'Panel de Navegación',
              description: 'Aquí puedes moverte entre las diferentes secciones: explorar restaurantes, ver tus pedidos anteriores, gestionar tu perfil o revisar tus eventos.',
              side: "right",
              align: 'start'
            }
          },
          {
            element: '#tour-restaurants',
            popover: {
              title: 'Explorar Sabores',
              description: 'Aquí verás todos los restaurantes disponibles. Selecciona uno para ver su menú y promociones.',
              side: "bottom",
              align: 'start'
            }
          },
          {
            element: '#tour-cart',
            popover: {
              title: 'Tu Carrito',
              description: 'Aquí se irán agregando los platos que selecciones. Podrás ver el total, aplicar promociones y finalizar tu pedido.',
              side: "left",
              align: 'start'
            }
          },
          {
            element: '#tour-history',
            popover: {
              title: 'Historial y Facturas',
              description: 'Consulta tus órdenes pasadas y descarga tus facturas cuando lo necesites.',
              side: "right",
              align: 'start'
            }
          }
        ],
        onDismisssed: () => {
          localStorage.setItem(tourKey, 'done');
        },
        onDestroyStarted: () => {
          localStorage.setItem(tourKey, 'done');
          driverObj.destroy();
        }
      });

      driverObj.drive();
    };

    // Listen for manual requests (Repetir Recorrido)
    if (requestId > 0) {
      startTour();
    }

    return () => {
      // No cleanup needed for manual requests
    };
  }, [user, requestId]);

  return null;
};
