import { create } from 'zustand';
import * as ordersApi from '../../../shared/api/orders';

function round2(n) {
  return Math.round(n * 100) / 100;
}

function calcSubtotal(items) {
  return round2(items.reduce((sum, it) => sum + it.price * it.qty, 0));
}

function calcDiscount(subtotal, code) {
  const normalized = String(code || '').trim().toUpperCase();
  if (!normalized) return 0;
  if (normalized === 'TRYNEW') return round2(subtotal * 0.1);
  if (normalized === 'EXPRESS5') return Math.min(5, subtotal);
  return 0;
}

export const useOrderStore = create((set, get) => ({
  orderType: 'delivery',
  address: '',
  addressId: null,
  promoCode: '',
  promotionId: null,
  paymentMethod: 'TARJETA',
  cartItems: [],
  history: [],
  submitting: false,
  lastError: null,

  setOrderType: (orderType) => set({ orderType }),
  setAddress: (address) => set({ address }),
  setAddressId: (addressId) => set({ addressId }),
  setPromoCode: (promoCode) => set({ promoCode }),
  setPromotionId: (promotionId) => set({ promotionId }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

  addItem: (dish) => {
    if (!dish) return;
    const id = dish.dishId || dish._id || dish.id;
    const { cartItems } = get();
    const idx = cartItems.findIndex((x) => x.dishId === id);
    if (idx >= 0) {
      const next = cartItems.map((x) =>
        x.dishId === id ? { ...x, qty: x.qty + 1 } : x,
      );
      set({ cartItems: next });
      return;
    }
    set({
      cartItems: [
        ...cartItems,
        {
          dishId: id,
          name: dish.name,
          photo: dish.photo || null,
          subtitle: dish.subtitle || dish.description || '',
          price: Number(dish.price) || 0,
          qty: 1,
        },
      ],
    });
  },

  incQty: (dishId) => {
    const { cartItems } = get();
    set({
      cartItems: cartItems.map((x) =>
        x.dishId === dishId ? { ...x, qty: x.qty + 1 } : x,
      ),
    });
  },

  decQty: (dishId) => {
    const { cartItems } = get();
    const next = cartItems
      .map((x) => (x.dishId === dishId ? { ...x, qty: x.qty - 1 } : x))
      .filter((x) => x.qty > 0);
    set({ cartItems: next });
  },

  removeItem: (dishId) => {
    const { cartItems } = get();
    set({ cartItems: cartItems.filter((x) => x.dishId !== dishId) });
  },

  clearCart: () => set({ cartItems: [], promoCode: '', promotionId: null }),

  getTotals: () => {
    const { cartItems, promoCode, orderType } = get();
    const subtotal = calcSubtotal(cartItems);
    const discount = calcDiscount(subtotal, promoCode);
    const deliveryCharge = orderType === 'delivery' && subtotal > 0 ? 10 : 0;
    const total = round2(Math.max(0, subtotal - discount + deliveryCharge));
    return { subtotal, discount, deliveryCharge, total };
  },

  confirmOrder: async ({ restaurantId } = {}) => {
    const state = get();
    if (!state.cartItems.length) {
      return { success: false, error: 'Tu carrito está vacío.' };
    }
    if (!restaurantId) {
      return { success: false, error: 'Selecciona un restaurante.' };
    }
    if (!state.paymentMethod) {
      return { success: false, error: 'Elige un método de pago.' };
    }

    const payload = {
      restaurantId,
      items: state.cartItems.map((x) => ({ dishId: x.dishId, quantity: x.qty })),
      paymentMethod: state.paymentMethod,
    };
    if (state.addressId) payload.addressId = state.addressId;
    if (state.promotionId) payload.promotion = state.promotionId;

    try {
      set({ submitting: true, lastError: null });
      const { data } = await ordersApi.createOrder(payload);
      const totals = state.getTotals();
      const localOrder = {
        id: data?.order?._id || `order_${Date.now()}`,
        invoiceNumber: data?.invoice?.invoiceNumber,
        createdAt: new Date().toISOString(),
        orderType: state.orderType,
        address: state.address,
        promoCode: state.promoCode,
        items: state.cartItems.map((x) => ({ ...x })),
        ...totals,
        status: data?.order?.status || 'PENDIENTE',
      };
      set((prev) => ({
        history: [localOrder, ...prev.history],
        cartItems: [],
        promoCode: '',
        promotionId: null,
        submitting: false,
      }));
      return { success: true, data, order: localOrder };
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudo crear el pedido';
      set({ submitting: false, lastError: message });
      return { success: false, error: message };
    }
  },
}));
