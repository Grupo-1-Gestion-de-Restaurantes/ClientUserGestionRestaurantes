import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { ChevronLeft, Menu, ShoppingCart, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { CartPanel } from '../components/CartPanel';
import { DashboardTour } from '../components/DashboardTour';
import { OrderWizard } from '../components/OrderWizard';
import { OrderConfirmationModal } from '../components/OrderConfirmationModal';
import { DashboardHelpFab } from '../components/DashboardHelpFab';
import { useUIStore } from '../../../shared/store/useUIStore';
import { useOrderStore } from '../store/useOrderStore';

export const DashboardLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isCartCollapsed = useUIStore((s) => s.isCartCollapsed);
  const setCartCollapsed = useUIStore((s) => s.setCartCollapsed);
  const cartCount = useOrderStore((s) =>
    s.cartItems.reduce((total, it) => total + it.qty, 0),
  );

  return (
    <main className="relative min-h-screen font-sans text-on-base overflow-hidden">
      <DashboardTour />
      <OrderWizard />
      <OrderConfirmationModal open={confirmOpen} onClose={() => setConfirmOpen(false)} />
      <DashboardHelpFab />

      {/* Content layer */}
      <div className="relative min-h-screen flex flex-col lg:flex-row z-10">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <DashboardSidebar />
        </div>

        {/* Mobile Navigation Button */}
        <button
          type="button"
          onClick={() => setNavOpen(true)}
          className="lg:hidden fixed top-4 left-4 h-12 w-12 rounded-2xl bg-surface-2 border-[3px] border-stroke-strong shadow-brutal flex items-center justify-center z-50 text-on-base hover:text-primary transition-colors"
          aria-label="Abrir menú"
        >
          <Menu size={18} strokeWidth={3} />
        </button>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Page Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-10 pt-16 lg:pt-10">
            <Outlet />
          </div>

          {/* Desktop Cart Panel */}
          <div className="hidden lg:block w-[420px] p-6 lg:p-10 shrink-0">
            <AnimatePresence mode="wait">
              {!isCartCollapsed ? (
                <motion.div
                  key="cart"
                  initial={{ opacity: 0, scaleX: 0.7, scaleY: 0.85, x: 30 }}
                  animate={{ opacity: 1, scaleX: 1, scaleY: 1, x: 0 }}
                  exit={{ opacity: 0, scaleX: 0.2, scaleY: 0.7, x: 120 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  style={{ transformOrigin: '100% 50%' }}
                >
                  <CartPanel onContinue={() => setConfirmOpen(true)} />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* Cart Toggle Button (Desktop) */}
        {isCartCollapsed ? (
          <button
            type="button"
            onClick={() => setCartCollapsed(false)}
            className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all z-40"
            aria-label="Mostrar carrito"
            title="Mostrar carrito"
          >
            <ChevronLeft size={18} />
            {cartCount > 0 ? (
              <span className="absolute -top-2 -right-2 bg-secondary text-black text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none shadow-md">
                {cartCount}
              </span>
            ) : null}
          </button>
        ) : null}

        {/* Mobile Cart FAB */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="lg:hidden fixed bottom-4 right-4 h-14 w-14 rounded-full bg-primary text-white shadow-brutal flex items-center justify-center z-50 hover:-translate-y-1 transition-all"
          aria-label="Abrir carrito"
        >
          <ShoppingCart size={20} strokeWidth={3} />
          {cartCount > 0 ? (
            <span className="absolute -top-2 -right-2 bg-secondary text-black text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none shadow-md">
              {cartCount}
            </span>
          ) : null}
        </button>

        {/* Mobile Cart Drawer */}
        {drawerOpen ? (
          <div className="lg:hidden fixed inset-0 z-[60]">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setDrawerOpen(false)}
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 p-4 max-h-[90vh] overflow-y-auto">
              <CartPanel
                mode="drawer"
                onClose={() => setDrawerOpen(false)}
                onContinue={() => setConfirmOpen(true)}
              />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="mt-3 w-full rounded-2xl bg-surface-2 border-[3px] border-stroke-strong py-3 text-sm font-bangers tracking-widest text-on-base flex items-center justify-center gap-2 hover:text-primary transition-colors"
              >
                <X size={18} />
                CERRAR
              </button>
            </div>
          </div>
        ) : null}

        {/* Mobile Navigation Drawer */}
        {navOpen ? (
          <div className="lg:hidden fixed inset-0 z-[70]">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setNavOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute left-0 top-0 bottom-0 w-[300px] p-4"
            >
              <DashboardSidebar
                variant="drawer"
                onNavigate={() => setNavOpen(false)}
              />
              <button
                type="button"
                onClick={() => setNavOpen(false)}
                className="mt-3 w-full rounded-2xl bg-surface-2 border-[3px] border-stroke-strong py-3 text-sm font-bangers tracking-widest text-on-base flex items-center justify-center gap-2 hover:text-primary transition-colors"
              >
                <X size={18} />
                CERRAR
              </button>
            </motion.div>
          </div>
        ) : null}
      </div>
    </main>
  );
};
