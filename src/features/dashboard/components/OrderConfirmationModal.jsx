import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Store, X } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { useRestaurantsStore } from '../store/useRestaurantsStore';
import { useClientStore } from '../store/useClientStore';
import { showError, showSuccess } from '../../../shared/utils/toast';

const formatMoney = (n) => `$${Number(n || 0).toFixed(2)}`;

export const OrderConfirmationModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  const cartItems = useOrderStore((s) => s.cartItems);
  const paymentMethod = useOrderStore((s) => s.paymentMethod);
  const submitting = useOrderStore((s) => s.submitting);
  const getTotals = useOrderStore((s) => s.getTotals);
  const confirmOrder = useOrderStore((s) => s.confirmOrder);
  const orderType = useOrderStore((s) => s.orderType);
  const addressId = useOrderStore((s) => s.addressId);

  const restaurants = useRestaurantsStore((s) => s.restaurants);
  const selectedRestaurantId = useRestaurantsStore((s) => s.selectedRestaurantId);

  const clientInfo = useClientStore((s) => s.info);
  const fetchMyInfo = useClientStore((s) => s.fetchMyInfo);

  useEffect(() => {
    if (!open) return;
    if (clientInfo) return;
    fetchMyInfo();
  }, [open, clientInfo, fetchMyInfo]);

  const totals = useMemo(() => getTotals(), [getTotals, cartItems, orderType]);

  const selectedRestaurant = useMemo(
    () => restaurants.find((r) => (r._id || r.id) === selectedRestaurantId),
    [restaurants, selectedRestaurantId],
  );

  const addresses = clientInfo?.addresses || (clientInfo?.address ? [clientInfo.address] : []);

  const selectedAddress = useMemo(() => {
    if (!addresses.length) return null;
    if (addressId) return addresses.find((a) => (a._id || a.id) === addressId) || null;
    return addresses.find((a) => a.isDefault) || addresses[0] || null;
  }, [addresses, addressId]);

  const canConfirm =
    !!cartItems.length && !!selectedRestaurantId && !!paymentMethod && !!selectedAddress;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden />

      <div className="relative w-full max-w-2xl rounded-3xl bg-surface-2 border-[3px] border-stroke-strong shadow-brutal p-6 md:p-8 overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs text-on-base-muted tracking-widest uppercase">Confirmación</div>
            <div className="font-bangers tracking-wider text-3xl text-on-base truncate">
              Revisa tu pedido
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong flex items-center justify-center"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-2xl bg-surface-3 border-[3px] border-stroke-strong px-4 py-3">
            <div className="text-[11px] tracking-widest uppercase text-on-base-muted flex items-center gap-2">
              <Store size={14} /> Restaurante
            </div>
            <div className="mt-1 font-semibold text-on-base truncate">
              {selectedRestaurant?.name || '—'}
            </div>
            {selectedRestaurant?.phone ? (
              <div className="mt-1 text-sm text-on-base-muted flex items-center gap-2">
                <Phone size={14} /> {selectedRestaurant.phone}
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl bg-surface-3 border-[3px] border-stroke-strong px-4 py-3">
            <div className="text-[11px] tracking-widest uppercase text-on-base-muted flex items-center gap-2">
              <MapPin size={14} /> Dirección
            </div>
            {selectedAddress ? (
              <div className="mt-1 text-sm text-on-base">
                <div className="font-semibold truncate">
                  {selectedAddress.addressLine} {selectedAddress.houseNumber}
                </div>
                {selectedAddress.alias ? (
                  <div className="text-on-base-muted text-xs truncate">{selectedAddress.alias}</div>
                ) : null}
              </div>
            ) : (
              <div className="mt-1 text-sm text-on-base-muted">
                No tienes una dirección configurada.
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong p-4">
          <div className="text-[11px] tracking-widest uppercase text-on-base-muted">Detalle</div>
          {cartItems.length ? (
            <ul className="mt-2 space-y-2">
              {cartItems.map((it) => (
                <li key={it.dishId} className="flex items-center justify-between text-sm">
                  <div className="min-w-0 flex-1 truncate text-on-base font-semibold">
                    {it.qty}× {it.name}
                  </div>
                  <div className="shrink-0 text-on-base-muted font-semibold ml-3">
                    {formatMoney(it.price * it.qty)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-2 text-sm text-on-base-muted">Tu carrito está vacío.</div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-semibold">
          <div className="rounded-2xl bg-surface-3 border-[3px] border-stroke-strong px-4 py-3 flex items-center justify-between">
            <span className="text-on-base-muted">Sub total</span>
            <span className="text-on-base">{formatMoney(totals.subtotal)}</span>
          </div>
          <div className="rounded-2xl bg-surface-3 border-[3px] border-stroke-strong px-4 py-3 flex items-center justify-between">
            <span className="text-on-base-muted">Delivery</span>
            <span className="text-on-base">{formatMoney(totals.deliveryCharge)}</span>
          </div>
          <div className="rounded-2xl bg-surface-3 border-[3px] border-stroke-strong px-4 py-3 flex items-center justify-between">
            <span className="text-on-base-muted">Descuento</span>
            <span className="text-on-base">-{formatMoney(totals.discount)}</span>
          </div>
          <div className="rounded-2xl bg-primary text-on-primary border-[3px] border-stroke-strong px-4 py-3 flex items-center justify-between shadow-brutal-sm">
            <span className="font-bangers tracking-widest">TOTAL</span>
            <span className="font-bangers text-2xl">{formatMoney(totals.total)}</span>
          </div>
        </div>

        <button
          type="button"
          disabled={!canConfirm || submitting}
          onClick={async () => {
            if (!selectedRestaurantId) {
              showError('Selecciona un restaurante.');
              return;
            }
            if (!selectedAddress) {
              showError('Agrega una dirección para poder continuar.');
              return;
            }
            const res = await confirmOrder({ restaurantId: selectedRestaurantId });
            if (res.success) {
              showSuccess(
                res.data?.invoice?.invoiceNumber
                  ? `Pedido creado · ${res.data.invoice.invoiceNumber}`
                  : 'Pedido creado',
              );
              onClose?.();
              navigate('/dashboard/history');
            } else if (res.error) {
              showError(res.error);
            }
          }}
          className="mt-5 w-full bg-secondary text-on-secondary font-bangers tracking-widest text-xl py-3 rounded-2xl border-[3px] border-stroke-strong shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {submitting ? 'CONFIRMANDO…' : 'CONFIRMAR PEDIDO'}
        </button>

        {!canConfirm ? (
          <div className="mt-3 text-xs text-on-base-muted">
            Completa la configuración (dirección, restaurante y carrito) para confirmar.
          </div>
        ) : null}
      </div>
    </div>
  );
};
