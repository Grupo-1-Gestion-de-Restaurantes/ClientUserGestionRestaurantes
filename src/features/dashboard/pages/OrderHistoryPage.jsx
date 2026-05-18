import { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  FileText,
  Receipt,
  ShoppingBag,
  X,
  XCircle,
} from 'lucide-react';
import { useOrdersStore } from '../store/useOrdersStore';
import { useInvoicesStore } from '../store/useInvoicesStore';
import { showError, showSuccess } from '../../../shared/utils/toast';

const STATUS_LABEL = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  EN_PREPARACION: 'En preparación',
  LISTO: 'Listo',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
};

const STATUS_COLOR = {
  PENDIENTE: 'bg-secondary text-on-secondary',
  CONFIRMADO: 'bg-secondary text-on-secondary',
  EN_PREPARACION: 'bg-primary text-on-primary',
  LISTO: 'bg-primary text-on-primary',
  ENTREGADO: 'bg-surface-3 text-on-base',
  CANCELADO: 'bg-surface-3 text-on-base-muted',
};

const formatDate = (iso) => {
  try {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

const shortId = (id) => String(id || '').slice(-6).toUpperCase();

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const OrderRow = ({ order, onCancel }) => {
  const [open, setOpen] = useState(false);
  const status = order.status || 'PENDIENTE';
  const canCancel = status === 'PENDIENTE';
  const items = Array.isArray(order.items) ? order.items : [];
  const total = Number(order.total) || 0;

  return (
    <article className="rounded-3xl bg-surface-2 border-[3px] border-stroke-strong overflow-hidden shadow-brutal-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-surface-3/60 transition-colors"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="h-12 w-12 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong flex items-center justify-center shrink-0">
            <Receipt size={18} />
          </div>
          <div className="min-w-0 text-left">
            <div className="text-on-base font-bangers tracking-wide text-lg truncate">
              ORDEN #{shortId(order._id || order.id)}
            </div>
            <div className="text-xs text-on-base-muted">
              {formatDate(order.createdAt)} ·{' '}
              {items.length} ítem{items.length === 1 ? '' : 's'}
              {order.restaurant?.name ? ` · ${order.restaurant.name}` : ''}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`text-[10px] font-bangers tracking-widest uppercase px-2 py-1 rounded-full border-[3px] border-stroke-strong ${STATUS_COLOR[status] || 'bg-surface-3 text-on-base'}`}
          >
            {STATUS_LABEL[status] || status}
          </span>
          <span className="text-on-base font-bangers text-lg">${total.toFixed(2)}</span>
          {open ? (
            <ChevronUp size={18} className="text-on-base-muted" />
          ) : (
            <ChevronDown size={18} className="text-on-base-muted" />
          )}
        </div>
      </button>

      {open ? (
        <div className="border-t-[3px] border-stroke-strong px-5 py-4 space-y-3">
          {items.length ? (
            <ul className="space-y-2">
              {items.map((it, i) => (
                <li
                  key={`${order._id || order.id}-${i}`}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="text-on-base font-semibold truncate">
                    {it.quantity || it.qty || 1}× {it.name || it.dish?.name || 'Plato'}
                  </div>
                  <div className="text-on-base-muted font-semibold">
                    ${Number((it.price || 0) * (it.quantity || it.qty || 1)).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          {canCancel ? (
            <button
              type="button"
              onClick={async () => {
                const res = await onCancel(order._id || order.id);
                if (res?.success) {
                  showSuccess('Pedido cancelado');
                } else if (res?.error) {
                  showError(res.error);
                }
              }}
              className="mt-3 flex items-center justify-center gap-2 w-full bg-primary text-on-primary py-2 rounded-xl border-[3px] border-stroke-strong shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] transition-all font-bangers tracking-widest"
            >
              <XCircle size={16} />
              CANCELAR PEDIDO
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
};

export const OrderHistoryPage = () => {
  const [tab, setTab] = useState('orders');

  const orders = useOrdersStore((s) => s.orders);
  const loading = useOrdersStore((s) => s.loading);
  const error = useOrdersStore((s) => s.error);
  const fetchMyOrders = useOrdersStore((s) => s.fetchMyOrders);
  const cancelOrder = useOrdersStore((s) => s.cancelOrder);

  const invoices = useInvoicesStore((s) => s.invoices);
  const invoicesLoading = useInvoicesStore((s) => s.loading);
  const invoicesError = useInvoicesStore((s) => s.error);
  const invoiceDetail = useInvoicesStore((s) => s.detail);
  const fetchMyInvoices = useInvoicesStore((s) => s.fetchMyInvoices);
  const fetchInvoice = useInvoicesStore((s) => s.fetchInvoice);
  const downloadInvoicePdf = useInvoicesStore((s) => s.downloadInvoicePdf);
  const clearDetail = useInvoicesStore((s) => s.clearDetail);

  const [invoiceOpen, setInvoiceOpen] = useState(false);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  useEffect(() => {
    if (tab !== 'invoices') return;
    if (invoices.length) return;
    fetchMyInvoices();
  }, [tab, invoices.length, fetchMyInvoices]);

  const handleCancel = async (id) => {
    const res = await cancelOrder(id);
    if (res.success) fetchMyOrders();
    return res;
  };

  const invoiceItems = useMemo(() => {
    if (!invoiceDetail) return [];
    const inv = invoiceDetail.invoice || invoiceDetail;
    return Array.isArray(inv?.items) ? inv.items : [];
  }, [invoiceDetail]);

  const invoiceMeta = useMemo(() => {
    if (!invoiceDetail) return null;
    const inv = invoiceDetail.invoice || invoiceDetail;
    return {
      id: inv?._id || inv?.id,
      invoiceNumber: inv?.invoiceNumber,
      issuedAt: inv?.issuedAt,
      restaurantName: inv?.restaurant?.name || inv?.restaurantName,
      paymentMethod: inv?.paymentMethod,
      total: Number(inv?.total) || 0,
      orderStatus: inv?.order?.status,
    };
  }, [invoiceDetail]);

  const handleOpenInvoice = async (inv) => {
    const id = inv?._id || inv?.id;
    if (!id) return;
    await fetchInvoice(id);
    setInvoiceOpen(true);
  };

  const handleDownloadInvoice = async (inv) => {
    const id = inv?._id || inv?.id;
    if (!id) return;

    const res = await downloadInvoicePdf(id);
    if (!res.success) {
      if (res.error) showError(res.error);
      return;
    }
    const invoiceNumber = inv?.invoiceNumber || `INV-${shortId(id)}`;
    const safe = String(invoiceNumber).replace(/[^a-zA-Z0-9_-]/g, '_');
    downloadBlob(res.data, `${safe}.pdf`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-8">
        <p className="text-xs text-on-base-muted tracking-widest uppercase">Tu actividad</p>
        <h1 className="mt-1 font-bangers tracking-wider text-4xl md:text-5xl text-on-base">
          Historial de <span className="text-secondary">pedidos</span>
        </h1>
        <p className="mt-2 text-sm text-on-base-muted">
          Aquí aparecen todos los pedidos asociados a tu cuenta.
        </p>
      </header>

      <div className="mb-6 flex items-center gap-2 rounded-2xl bg-surface-2 border-[3px] border-stroke-strong p-1 shadow-brutal-sm">
        <button
          type="button"
          onClick={() => setTab('orders')}
          className={`flex-1 rounded-xl px-4 py-2 text-xs font-bangers tracking-widest uppercase transition-all ${
            tab === 'orders'
              ? 'bg-secondary text-on-secondary shadow-brutal-sm'
              : 'text-on-base-muted hover:text-on-base'
          }`}
        >
          PEDIDOS
        </button>
        <button
          type="button"
          onClick={() => setTab('invoices')}
          className={`flex-1 rounded-xl px-4 py-2 text-xs font-bangers tracking-widest uppercase transition-all ${
            tab === 'invoices'
              ? 'bg-secondary text-on-secondary shadow-brutal-sm'
              : 'text-on-base-muted hover:text-on-base'
          }`}
        >
          RECIBOS
        </button>
      </div>

      {tab === 'orders' ? (
        <>
          {error ? (
            <div className="rounded-2xl border-[3px] border-stroke-strong bg-primary/10 px-4 py-3 text-sm text-primary font-bold mb-4">
              {error}
            </div>
          ) : null}

          {loading && !orders.length ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-3xl bg-surface-2 border-[3px] border-stroke-strong h-20 animate-pulse"
                />
              ))}
            </div>
          ) : null}

          {orders.length ? (
            <div className="space-y-3">
              {orders.map((o) => (
                <OrderRow key={o._id || o.id} order={o} onCancel={handleCancel} />
              ))}
            </div>
          ) : !loading && !error ? (
            <div className="rounded-3xl bg-surface-2 border-[3px] border-stroke-strong p-10 text-center shadow-brutal-sm">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-surface-3 border-[3px] border-stroke-strong flex items-center justify-center">
                <ShoppingBag size={22} className="text-on-base-muted" />
              </div>
              <div className="mt-4 text-on-base font-bangers tracking-wider text-2xl">
                AÚN NO TIENES PEDIDOS
              </div>
              <p className="mt-1 text-sm text-on-base-muted">
                Agrega platos al carrito y confirma tu primera orden.
              </p>
            </div>
          ) : null}
        </>
      ) : (
        <>
          {invoicesError ? (
            <div className="rounded-2xl border-[3px] border-stroke-strong bg-primary/10 px-4 py-3 text-sm text-primary font-bold mb-4">
              {invoicesError}
            </div>
          ) : null}

          {invoicesLoading && !invoices.length ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-3xl bg-surface-2 border-[3px] border-stroke-strong h-20 animate-pulse"
                />
              ))}
            </div>
          ) : null}

          {invoices.length ? (
            <div className="space-y-3">
              {invoices.map((inv) => (
                <article
                  key={inv._id || inv.invoiceNumber}
                  className="rounded-3xl bg-surface-2 border-[3px] border-stroke-strong p-5 shadow-brutal-sm flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-12 w-12 rounded-2xl bg-secondary text-on-secondary border-[3px] border-stroke-strong flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-on-base font-bangers tracking-wide text-lg truncate">
                        {inv.invoiceNumber || `Factura #${shortId(inv._id)}`}
                      </div>
                      <div className="text-xs text-on-base-muted truncate">
                        {formatDate(inv.issuedAt || inv.createdAt)}
                        {inv.restaurant?.name ? ` · ${inv.restaurant.name}` : ''}
                        {inv.paymentMethod ? ` · ${inv.paymentMethod}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right mr-1">
                      <div className="text-xs text-on-base-muted">Total</div>
                      <div className="text-on-base font-bangers text-xl">
                        ${(Number(inv.total) || 0).toFixed(2)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenInvoice(inv)}
                      className="h-10 w-10 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong flex items-center justify-center"
                      aria-label="Ver recibo"
                      title="Ver"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadInvoice(inv)}
                      className="h-10 w-10 rounded-2xl bg-primary text-on-primary border-[3px] border-stroke-strong flex items-center justify-center"
                      aria-label="Descargar PDF"
                      title="Descargar PDF"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : !invoicesLoading && !invoicesError ? (
            <div className="rounded-3xl bg-surface-2 border-[3px] border-stroke-strong p-10 text-center shadow-brutal-sm">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-surface-3 border-[3px] border-stroke-strong flex items-center justify-center">
                <Receipt size={22} className="text-on-base-muted" />
              </div>
              <div className="mt-4 text-on-base font-bangers tracking-wider text-2xl">
                SIN RECIBOS AÚN
              </div>
              <p className="mt-1 text-sm text-on-base-muted">
                Cuando hagas un pedido se generará tu primer recibo.
              </p>
            </div>
          ) : null}
        </>
      )}

      {invoiceOpen && invoiceMeta ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              setInvoiceOpen(false);
              clearDetail();
            }}
            aria-hidden
          />
          <div className="relative w-full max-w-xl rounded-3xl bg-surface-2 border-[3px] border-stroke-strong shadow-brutal p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs text-on-base-muted tracking-widest uppercase">
                  Recibo
                </div>
                <div className="font-bangers tracking-wider text-3xl text-on-base truncate">
                  {invoiceMeta.invoiceNumber || `Factura #${shortId(invoiceMeta.id)}`}
                </div>
                <div className="text-sm text-on-base-muted mt-1 truncate">
                  {invoiceMeta.restaurantName || '—'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setInvoiceOpen(false);
                  clearDetail();
                }}
                className="h-10 w-10 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong flex items-center justify-center"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-surface-3 border-[3px] border-stroke-strong px-4 py-3">
                <div className="text-[11px] tracking-widest uppercase text-on-base-muted">Fecha</div>
                <div className="font-semibold text-on-base">{formatDate(invoiceMeta.issuedAt)}</div>
              </div>
              <div className="rounded-2xl bg-surface-3 border-[3px] border-stroke-strong px-4 py-3">
                <div className="text-[11px] tracking-widest uppercase text-on-base-muted">Pago</div>
                <div className="font-semibold text-on-base">{invoiceMeta.paymentMethod || '—'}</div>
              </div>
              {invoiceMeta.orderStatus ? (
                <div className="rounded-2xl bg-surface-3 border-[3px] border-stroke-strong px-4 py-3 sm:col-span-2">
                  <div className="text-[11px] tracking-widest uppercase text-on-base-muted">Estado</div>
                  <div className="font-semibold text-on-base">{invoiceMeta.orderStatus}</div>
                </div>
              ) : null}
            </div>

            <div className="mt-5 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong p-4">
              <div className="text-[11px] tracking-widest uppercase text-on-base-muted">Detalle</div>
              {invoiceItems.length ? (
                <ul className="mt-2 space-y-2">
                  {invoiceItems.map((it, idx) => (
                    <li key={`${invoiceMeta.id}-${idx}`} className="flex items-center justify-between text-sm">
                      <div className="min-w-0 flex-1 truncate text-on-base font-semibold">
                        {it.quantity || 1}× {it.name || 'Producto'}
                      </div>
                      <div className="shrink-0 text-on-base-muted font-semibold ml-3">
                        ${(Number(it.subtotal) || 0).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-2 text-sm text-on-base-muted">Sin detalle.</div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="font-bangers tracking-widest text-xl text-on-base">TOTAL</div>
              <div className="font-bangers text-3xl text-secondary">${invoiceMeta.total.toFixed(2)}</div>
            </div>

            <button
              type="button"
              onClick={() => handleDownloadInvoice({ _id: invoiceMeta.id, invoiceNumber: invoiceMeta.invoiceNumber })}
              className="mt-5 w-full bg-primary text-on-primary font-bangers tracking-widest text-lg py-3 rounded-2xl border-[3px] border-stroke-strong shadow-brutal-sm"
            >
              DESCARGAR PDF
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
