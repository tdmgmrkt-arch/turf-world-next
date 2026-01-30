"use client";

import { useCallback, useEffect, useState } from "react";
import { medusa } from "@/lib/medusa";
import { useCartStore } from "@/lib/store";

const CART_ID_KEY = "medusa_cart_id";

/**
 * useMedusaCart - Syncs local cart state with Medusa backend
 *
 * Handles:
 * - Creating a new cart if none exists
 * - Syncing local items to Medusa cart
 * - Updating cart on item changes
 * - Managing cart ID in localStorage
 *
 * Usage:
 * ```tsx
 * const { cart, isLoading, addItem, updateItem, removeItem } = useMedusaCart();
 * ```
 */
export function useMedusaCart() {
  const [medusaCart, setMedusaCart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { cartId, setCartId, items } = useCartStore();

  // Initialize or retrieve cart
  useEffect(() => {
    async function initCart() {
      try {
        setIsLoading(true);

        // Check for existing cart ID
        const storedCartId = localStorage.getItem(CART_ID_KEY) || cartId;

        if (storedCartId) {
          // Try to retrieve existing cart
          try {
            const { cart } = await medusa.store.cart.retrieve(storedCartId);
            if (cart && cart.completed_at === null) {
              setMedusaCart(cart);
              setCartId(storedCartId);
              setIsLoading(false);
              return;
            }
          } catch {
            // Cart not found or completed, create new one
            localStorage.removeItem(CART_ID_KEY);
          }
        }

        // Create new cart
        const { cart } = await medusa.store.cart.create({});
        localStorage.setItem(CART_ID_KEY, cart.id);
        setCartId(cart.id);
        setMedusaCart(cart);
      } catch (err) {
        setError(err as Error);
        console.error("Failed to initialize cart:", err);
      } finally {
        setIsLoading(false);
      }
    }

    initCart();
  }, [cartId, setCartId]);

  // Add item to Medusa cart
  const addItem = useCallback(
    async (variantId: string, quantity: number) => {
      if (!cartId) return;

      try {
        setIsLoading(true);
        const { cart } = await medusa.store.cart.createLineItem(cartId, {
          variant_id: variantId,
          quantity,
        });
        setMedusaCart(cart);
      } catch (err) {
        setError(err as Error);
        console.error("Failed to add item:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [cartId]
  );

  // Update item quantity
  const updateItem = useCallback(
    async (lineItemId: string, quantity: number) => {
      if (!cartId) return;

      try {
        setIsLoading(true);
        const { cart } = await medusa.store.cart.updateLineItem(
          cartId,
          lineItemId,
          { quantity }
        );
        setMedusaCart(cart);
      } catch (err) {
        setError(err as Error);
        console.error("Failed to update item:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [cartId]
  );

  // Remove item from cart
  const removeItem = useCallback(
    async (lineItemId: string) => {
      if (!cartId) return;

      try {
        setIsLoading(true);
        const { cart } = await medusa.store.cart.deleteLineItem(
          cartId,
          lineItemId
        );
        setMedusaCart(cart);
      } catch (err) {
        setError(err as Error);
        console.error("Failed to remove item:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [cartId]
  );

  // Update shipping address
  const updateShippingAddress = useCallback(
    async (address: {
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
        const { cart } = await medusa.store.cart.update(cartId, {
          shipping_address: address,
        });
        setMedusaCart(cart);
      } catch (err) {
        setError(err as Error);
        console.error("Failed to update shipping address:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [cartId]
  );

  // Set shipping method
  const setShippingMethod = useCallback(
    async (shippingOptionId: string) => {
      if (!cartId) return;

      try {
        setIsLoading(true);
        const { cart } = await medusa.store.cart.addShippingMethod(cartId, {
          option_id: shippingOptionId,
        });
        setMedusaCart(cart);
      } catch (err) {
        setError(err as Error);
        console.error("Failed to set shipping method:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [cartId]
  );

  // Create payment session (Stripe)
  const createPaymentSession = useCallback(async () => {
    if (!cartId) return null;

    try {
      setIsLoading(true);
      // Initialize payment sessions
      const { cart } = await medusa.store.cart.createPaymentSessions(cartId);
      setMedusaCart(cart);

      // Set Stripe as payment provider
      const { cart: updatedCart } = await medusa.store.cart.setPaymentSession(
        cartId,
        { provider_id: "stripe" }
      );
      setMedusaCart(updatedCart);

      // Return client secret for Stripe Elements
      return updatedCart.payment_session?.data?.client_secret as string;
    } catch (err) {
      setError(err as Error);
      console.error("Failed to create payment session:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [cartId]);

  // Complete checkout
  const completeCheckout = useCallback(async () => {
    if (!cartId) return null;

    try {
      setIsLoading(true);
      const { type, cart, order } = await medusa.store.cart.complete(cartId);

      if (type === "order" && order) {
        // Clear cart
        localStorage.removeItem(CART_ID_KEY);
        setCartId(null as any);
        setMedusaCart(null);
        return order;
      }

      return null;
    } catch (err) {
      setError(err as Error);
      console.error("Failed to complete checkout:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [cartId, setCartId]);

  return {
    cart: medusaCart,
    isLoading,
    error,
    addItem,
    updateItem,
    removeItem,
    updateShippingAddress,
    setShippingMethod,
    createPaymentSession,
    completeCheckout,
  };
}

/**
 * Helper to format Medusa cart for display
 */
export function formatMedusaCart(cart: any) {
  if (!cart) return null;

  return {
    id: cart.id,
    items: cart.items?.map((item: any) => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      total: item.total,
      thumbnail: item.thumbnail,
      variant: item.variant,
    })),
    subtotal: cart.subtotal,
    taxTotal: cart.tax_total,
    shippingTotal: cart.shipping_total,
    total: cart.total,
    shippingAddress: cart.shipping_address,
    email: cart.email,
  };
}
