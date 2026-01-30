import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartState {
  cartId: string | null;
  items: CartItem[];
  isOpen: boolean;

  // Actions
  setCartId: (id: string) => void;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed (implemented as getters in component)
  getSubtotal: () => number;
  getItemCount: () => number;
}

/**
 * Cart Store
 *
 * Client-side cart state with localStorage persistence.
 * Syncs with Medusa cart API for checkout.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      items: [],
      isOpen: false,

      setCartId: (id) => set({ cartId: id }),

      addItem: (item) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.variantId === item.variantId
          );

          if (existingIndex > -1) {
            // Update quantity if variant already in cart
            const newItems = [...state.items];
            newItems[existingIndex].quantity += item.quantity;
            return { items: newItems, isOpen: true };
          }

          return { items: [...state.items, item], isOpen: true };
        }),

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        })),

      updateQuantity: (itemId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.id !== itemId) };
          }
          return {
            items: state.items.map((i) =>
              i.id === itemId ? { ...i, quantity } : i
            ),
          };
        }),

      clearCart: () => set({ items: [], cartId: null }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "turf-world-cart",
      partialize: (state) => ({
        cartId: state.cartId,
        items: state.items,
      }),
    }
  )
);
