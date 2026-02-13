import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Customer } from "@/types";

interface AuthState {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setCustomer: (customer: Customer | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  clearAuth: () => void;
}

/**
 * Auth Store
 *
 * Client-side auth state with localStorage persistence.
 * Tracks logged-in customer and authentication status.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      customer: null,
      isAuthenticated: false,
      isLoading: true,

      setCustomer: (customer) => set({ customer }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setLoading: (value) => set({ isLoading: value }),
      clearAuth: () => set({ customer: null, isAuthenticated: false, isLoading: false }),
    }),
    {
      name: "turf-world-auth",
      partialize: (state) => ({
        customer: state.customer,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
