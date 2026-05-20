import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isIntroLocked: true,
  isCartCollapsed: false,
  isOrderWizardOpen: false,
  dashboardTourRequestId: 0,

  unlockIntro: () => set({ isIntroLocked: false }),
  lockIntro: () => set({ isIntroLocked: true }),

  setCartCollapsed: (isCartCollapsed) => set({ isCartCollapsed }),
  toggleCart: () => set((state) => ({ isCartCollapsed: !state.isCartCollapsed })),

  openOrderWizard: () => set({ isOrderWizardOpen: true }),
  closeOrderWizard: () => set({ isOrderWizardOpen: false }),

  requestDashboardTour: () =>
    set((s) => ({ dashboardTourRequestId: (s.dashboardTourRequestId || 0) + 1 })),
}));
