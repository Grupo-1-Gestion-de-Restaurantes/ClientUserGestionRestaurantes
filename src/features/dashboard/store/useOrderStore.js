import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as ordersApi from '../../../shared/api/orders';
import { useClientStore } from './useClientStore';

function round2(n) {
  return Math.round(n * 100) / 100;
}

function calcSubtotal(items) {
  return round2(items.reduce((sum, it) => sum + it.price * it.qty, 0));
}

function calcDiscount(subtotal, promo, cartItems) {
  if (!promo) return 0;
  
  // Si la promoción aplica a platos específicos
  if (promo.dishesApplicables && promo.dishesApplicables.length > 0) {
    let discount = 0;
    cartItems.forEach(item => {
      const isApplicable = promo.dishesApplicables.some(id => String(id) === String(item.dishId));
      if (isApplicable) {
        discount += (item.price * item.qty) * (promo.discountPercentage / 100);
      }
    });
    return round2(discount);
  }
  
  // Si es una promoción general
  return round2(subtotal * (promo.discountPercentage / 100));
}

export const useOrderStore = create(
  persist(
    (set, get) => ({
  orderType: 'DOMICILIO',
  address: '',
  addressId: null,
  promoCode: '',
  promotionId: null,
  activePromotion: null,
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
  setActivePromotion: (activePromotion) => set({ activePromotion }),
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

  clearCart: () => set({ cartItems: [], promoCode: '', promotionId: null, activePromotion: null }),

  getTotals: () => {
    const { cartItems, activePromotion, orderType } = get();
    const subtotal = calcSubtotal(cartItems);
    const discount = calcDiscount(subtotal, activePromotion, cartItems);
    const deliveryCharge = orderType === 'DOMICILIO' && subtotal > 0 ? 10 : 0;
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

    let finalAddress = undefined;
    if (state.orderType === 'DOMICILIO') {
        const clientInfo = useClientStore.getState().info;
        const addresses = clientInfo?.addresses || [];
        const selectedAddressObj = addresses.find((a) => (a._id || a.id) === state.addressId) || addresses.find((a) => a.isDefault) || addresses[0];
        
        if (selectedAddressObj) {
            finalAddress = {
                alias: selectedAddressObj.alias,
                addressLine: selectedAddressObj.addressLine,
                houseNumber: selectedAddressObj.houseNumber,
                securityInfo: selectedAddressObj.securityInfo,
                reference: selectedAddressObj.reference
            };
        }
    }

    const payload = {
      restaurantId,
      items: state.cartItems.map((x) => ({ dishId: x.dishId, quantity: x.qty })),
      paymentMethod: state.paymentMethod,
      deliveryType: state.orderType
    };
    if (finalAddress) payload.deliveryAddress = finalAddress;
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
        address: finalAddress?.addressLine || 'Recoger en tienda',
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
        activePromotion: null,
        submitting: false,
      }));
      return { success: true, data, order: localOrder };
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudo crear el pedido';
      set({ submitting: false, lastError: message });
      return { success: false, error: message };
    }
  },
}),
    {
      name: 'clientuser-order',
      partialize: (state) => ({
        cartItems: state.cartItems,
        promoCode: state.promoCode,
        promotionId: state.promotionId,
        activePromotion: state.activePromotion,
        orderType: state.orderType,
        addressId: state.addressId,
        paymentMethod: state.paymentMethod,
      }),
    }
  )
);
