"use client";

import { useCallback, useEffect, useState } from "react";
import { medusa } from "@/lib/medusa";
import { useAuthStore } from "@/lib/auth-store";
import type { Customer } from "@/types";

/**
 * Auth Hook
 *
 * Wraps Medusa v2 customer auth API. Follows the same pattern
 * as use-medusa-cart.ts (useState + useCallback + useEffect).
 */
export function useAuth() {
  const {
    customer,
    isAuthenticated,
    isLoading,
    setCustomer,
    setAuthenticated,
    setLoading,
    clearAuth,
  } = useAuthStore();

  const [error, setError] = useState<string | null>(null);

  // Check auth on mount — try to retrieve current customer from stored token
  useEffect(() => {
    async function checkAuthOnMount() {
      // If we think we're authenticated, verify with the server
      if (isAuthenticated) {
        try {
          const { customer: serverCustomer } = await medusa.store.customer.retrieve() as any;
          setCustomer(serverCustomer as Customer);
          setAuthenticated(true);
        } catch {
          // Token expired or invalid — clear auth
          clearAuth();
        }
      }
      setLoading(false);
    }

    checkAuthOnMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const token = await medusa.auth.login("customer", "emailpass", {
        email,
        password,
      });

      if (typeof token !== "string") {
        throw new Error("Unexpected auth response");
      }

      // SDK auto-stores token; now fetch customer profile
      const { customer: profile } = await medusa.store.customer.retrieve() as any;
      setCustomer(profile as Customer);
      setAuthenticated(true);
      return true;
    } catch (err: any) {
      const message = err?.message || "Invalid email or password";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setCustomer, setAuthenticated, setLoading]);

  const register = useCallback(async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => {
    setError(null);
    setLoading(true);
    try {
      // Step 1: Register auth identity
      await medusa.auth.register("customer", "emailpass", {
        email: data.email,
        password: data.password,
      });

      // Step 2: Create customer profile (SDK auto-attaches registration token)
      const { customer: profile } = await medusa.store.customer.create({
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
      }) as any;

      // Step 3: Login to get a proper session token
      await medusa.auth.login("customer", "emailpass", {
        email: data.email,
        password: data.password,
      });

      setCustomer(profile as Customer);
      setAuthenticated(true);
      return true;
    } catch (err: any) {
      const message = err?.message || "Registration failed. Please try again.";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setCustomer, setAuthenticated, setLoading]);

  const logout = useCallback(async () => {
    try {
      await medusa.auth.logout();
    } catch {
      // Ignore logout errors
    }
    clearAuth();
  }, [clearAuth]);

  return {
    customer,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };
}
