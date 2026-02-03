"use client";

import { useCallback, useEffect, useState } from "react";
import { medusa } from "@/lib/medusa";
import { useCartStore } from "@/lib/store";

const CART_ID_KEY = "medusa_cart_id";

export function useMedusaCart() {
  const [medusaCart, setMedusaCart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { cartId, setCartId } = useCartStore();

  // Helper function to refresh cart state from the server
  const refreshCart = useCallback(async (id: string) => {
    try {
      const { cart } = await medusa.store.cart.retrieve(id);
      setMedusaCart(cart);
      return cart;
    } catch (err) {
      console.error("Failed to refresh cart:", err);
      return null;
    }
  }, []);

  // Initialize or retrieve cart
  useEffect(() => {
    async function initCart() {
      try {
        setIsLoading(true);
        const storedCartId = localStorage.getItem(CART_ID_KEY) || cartId;

        if (storedCartId) {
          const cart = await refreshCart(storedCartId);
          // Only use the cart if it hasn't been completed
          if (cart && !cart.completed_at) {
            setCartId(storedCartId);
            setIsLoading(false);
            return;
          } else {
            localStorage.removeItem(CART_ID_KEY);
          }
        }

        // Create new cart if none exists or old one is completed
        const { cart: newCart } = await medusa.store.cart.create({});
        localStorage.setItem(CART_ID_KEY, newCart.id);
        setCartId(newCart.id);
        setMedusaCart(newCart);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    initCart();
  }, [cartId, setCartId, refreshCart]);

  const addItem = useCallback(async (variantId: string, quantity: number) => {
    if (!cartId) return;
    try {
      setIsLoading(true);
      await medusa.store.cart.createLineItem(cartId, {
        variant_id: variantId,
        quantity,
      });
      await refreshCart(cartId); // Refetch after mutation
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [cartId, refreshCart]);

  const updateItem = useCallback(async (lineItemId: string, quantity: number) => {
    if (!cartId) return;
    try {
      setIsLoading(true);
      await medusa.store.cart.updateLineItem(cartId, lineItemId, { quantity });
      await refreshCart(cartId); // Refetch after mutation
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [cartId, refreshCart]);

  const removeItem = useCallback(async (lineItemId: string) => {
    if (!cartId) return;
    try {
      setIsLoading(true);
      // In v2, deleteLineItem doesn't return the updated cart
      await medusa.store.cart.deleteLineItem(cartId, lineItemId);
      await refreshCart(cartId); // Refetch after mutation
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [cartId, refreshCart]);

  const completeCheckout = useCallback(async () => {
    if (!cartId) return null;
    try {
      setIsLoading(true);
      const response = await medusa.store.cart.complete(cartId);

      // Handle v2 response structure which might differ based on success type
      if (response.type === "order" && response.order) {
        localStorage.removeItem(CART_ID_KEY);
        setCartId(null as any);
        setMedusaCart(null);
        return response.order;
      }
      return null;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [cartId, setCartId]);

  const updateShippingAddress = useCallback(async (address: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    province: string;
    postal_code: string;
    country_code: string;
    phone?: string;
  }) => {
    if (!cartId) return;
    try {
      setIsLoading(true);
      await medusa.store.cart.update(cartId, {
        shipping_address: address,
        billing_address: address,
      });
      await refreshCart(cartId);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cartId, refreshCart]);

  const createPaymentSession = useCallback(async () => {
    if (!cartId) return null;
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

    try {
      setIsLoading(true);

      // Step 1: Create payment collection for the cart
      const collectionRes = await fetch(`${baseUrl}/store/carts/${cartId}/payment-collections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!collectionRes.ok) {
        throw new Error("Failed to create payment collection");
      }

      const { cart } = await collectionRes.json();
      const paymentCollectionId = cart?.payment_collection?.id;

      if (!paymentCollectionId) {
        throw new Error("No payment collection ID returned");
      }

      // Step 2: Initialize payment session with Stripe provider
      const sessionRes = await fetch(`${baseUrl}/store/payment-collections/${paymentCollectionId}/payment-sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider_id: "pp_stripe_stripe",
        }),
      });

      if (!sessionRes.ok) {
        throw new Error("Failed to create payment session");
      }

      const { payment_collection } = await sessionRes.json();

      // Find the Stripe payment session and return client secret
      const stripeSession = payment_collection?.payment_sessions?.find(
        (session: any) => session.provider_id === "pp_stripe_stripe"
      );

      if (stripeSession?.data?.client_secret) {
        return stripeSession.data.client_secret as string;
      }

      return null;
    } catch (err) {
      setError(err as Error);
      console.error("Failed to create payment session:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [cartId]);

  return {
    cart: medusaCart,
    isLoading,
    error,
    addItem,
    updateItem,
    removeItem,
    completeCheckout,
    refreshCart,
    updateShippingAddress,
    createPaymentSession,
  };
}