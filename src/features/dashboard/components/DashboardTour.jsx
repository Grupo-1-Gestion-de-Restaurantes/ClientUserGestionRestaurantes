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
              description: 'Aquí puedes moverte entre las diferentes secciones: explorar restaurantes, ver tus pedidos, gestionar tu perfil, reservas y eventos.',
              side: "right",
              align: 'start'
            }
          },
          {
            element: '#tour-restaurants',
            popover: {
              title: 'Explorar Sabores',
              description: 'Aquí verás todos los restaurantes disponibles. Selecciona uno para ver su menú y promociones activas.',
              side: "bottom",
              align: 'start'
            }
          },
          {
            element: '#tour-cart',
            popover: {
              title: 'Tu Carrito',
              description: 'Aquí se agregan los platos que selecciones. Primero agrega los platos que quieras, luego ve a Promociones para aplicar un cupón de descuento.',
              side: "left",
              align: 'start'
            }
          },
          {
            element: '#tour-promotions',
            popover: {
              title: 'Cupones y Descuentos',
              description: 'Primero haz tu pedido agregando platos al carrito, luego aquí puedes aplicar una promoción para obtener el descuento. Si la promoción aplica solo a ciertos platos, lo verás indicado.',
              side: "bottom",
              align: 'start'
            }
          },
          {
            element: '#tour-reservations',
            popover: {
              title: 'Mis Reservas',
              description: 'Consulta y gestiona tus reservas de mesas. Puedes filtrar por estado: todas, confirmadas, pendientes o canceladas.',
              side: "right",
              align: 'start'
            }
          },
          {
            element: '#tour-events',
            popover: {
              title: 'Eventos Exclusivos',
              description: 'Suscríbete a eventos especiales en tus restaurantes favoritos. Si ya estás suscrito, el botón cambiará a "SUSCRITO" y estará desactivado.',
              side: "right",
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
