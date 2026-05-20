import { useEffect } from 'react';
import { FileText, Receipt } from 'lucide-react';
import { useInvoicesStore } from '../store/useInvoicesStore';

const formatDate = (iso) => {
  try {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

export const InvoicesPage = () => {
  const invoices = useInvoicesStore((s) => s.invoices);
  const loading = useInvoicesStore((s) => s.loading);
  const error = useInvoicesStore((s) => s.error);
  const fetchMyInvoices = useInvoicesStore((s) => s.fetchMyInvoices);

  useEffect(() => {
    fetchMyInvoices();
  }, [fetchMyInvoices]);

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-8">
        <p className="text-xs text-on-base-muted tracking-widest uppercase">Comprobantes</p>
        <h1 className="mt-1 font-bangers tracking-wider text-4xl md:text-5xl text-on-base">
          Mis <span className="text-secondary">facturas</span>
        </h1>
        <p className="mt-2 text-sm text-on-base-muted">
          Aquí encontrarás todos los comprobantes generados por tus pedidos.
        </p>
      </header>

      {error ? (
        <div className="rounded-2xl border-[3px] border-stroke-strong bg-primary/10 px-4 py-3 text-sm text-primary font-bold mb-4">
          {error}
        </div>
      ) : null}

      {loading && !invoices.length ? (
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
                    {inv.invoiceNumber || `Factura #${String(inv._id || '').slice(-6).toUpperCase()}`}
                  </div>
                  <div className="text-xs text-on-base-muted">
                    {formatDate(inv.issuedAt || inv.createdAt)}
                    {inv.restaurant?.name ? ` · ${inv.restaurant.name}` : ''}
                    {inv.paymentMethod ? ` · ${inv.paymentMethod}` : ''}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-on-base-muted">Total</div>
                <div className="text-on-base font-bangers text-xl">
                  Q{(Number(inv.total) || 0).toFixed(2)}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : !loading && !error ? (
        <div className="rounded-3xl bg-surface-2 border-[3px] border-stroke-strong p-10 text-center shadow-brutal-sm">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-surface-3 border-[3px] border-stroke-strong flex items-center justify-center">
            <Receipt size={22} className="text-on-base-muted" />
          </div>
          <div className="mt-4 text-on-base font-bangers tracking-wider text-2xl">
            SIN FACTURAS AÚN
          </div>
          <p className="mt-1 text-sm text-on-base-muted">
            Cuando hagas un pedido se generará tu primera factura.
          </p>
        </div>
      ) : null}
    </div>
  );
};
