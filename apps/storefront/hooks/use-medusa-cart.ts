"use client";

import { useCallback, useEffect, useState } from "react";
import { medusa } from "@/lib/medusa";
import { useCartStore } from "@/lib/store";

const CART_ID_KEY = "medusa_cart_id";

/**
 * Read the latest cart ID from localStorage.
 * React state may be stale (e.g. after syncLocalCartToMedusa creates a fresh cart),
 * so this is the single source of truth during the checkout flow.
 */
function getActiveCartId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CART_ID_KEY);
}

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

  const addItem = useCallback(async (
    variantId: string,
    quantity: number,
    metadata?: Record<string, any>
  ) => {
    if (!cartId) return;
    try {
      setIsLoading(true);
      await medusa.store.cart.createLineItem(cartId, {
        variant_id: variantId,
        quantity,
        metadata,
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

  /**
   * Sync local cart items to Medusa cart with metadata.
   * Always creates a FRESH cart to avoid stale state from previous checkout attempts.
   */
  const syncLocalCartToMedusa = useCallback(async (localCartItems: any[]) => {
    if (localCartItems.length === 0) return;

    try {
      setIsLoading(true);

      // Always create a fresh cart for checkout to avoid stale payment collections,
      // locked carts, or leftover items from previous attempts.
      const { cart: freshCart } = await medusa.store.cart.create({});
      const activeCartId = freshCart.id;
      localStorage.setItem(CART_ID_KEY, activeCartId);
      setCartId(activeCartId);
      setMedusaCart(freshCart);

      // Don't pass region_id here — we only need to match products, not filter by region.
      const listParams: Record<string, any> = { limit: 100 };

      // Fetch products once (not per-item)
      const { products } = await medusa.store.product.list(listParams);

      // Add each local cart item to Medusa cart with metadata
      for (const localItem of localCartItems) {
        try {
          // Find product by Medusa ID, original_id metadata, or handle
          const medusaProduct = products.find(
            (p: any) => p.id === localItem.productId || p.metadata?.original_id === localItem.productId || p.handle === localItem.productId
          );

          if (!medusaProduct || !medusaProduct.variants?.[0]) {
            console.warn(`Could not find Medusa variant for product: ${localItem.productId}`);
            continue;
          }

          const variantId = medusaProduct.variants[0].id;

          // Build metadata with cut dimensions
          const metadata: Record<string, any> = {
            local_cart_id: localItem.id,
            original_product_id: localItem.productId,
            custom_title: localItem.title,
          };

          if (localItem.dimensions) {
            metadata.cut_width_ft = localItem.dimensions.widthFeet;
            metadata.cut_length_ft = localItem.dimensions.lengthFeet;
            metadata.cut_square_feet = localItem.dimensions.squareFeet;
            metadata.cut_label = `${localItem.dimensions.widthFeet}' × ${localItem.dimensions.lengthFeet}'`;
          }

          await medusa.store.cart.createLineItem(activeCartId, {
            variant_id: variantId,
            quantity: localItem.quantity,
            metadata,
          });
        } catch (itemErr) {
          console.error(`Failed to add item ${localItem.id} to Medusa cart:`, itemErr);
        }
      }

      // Refresh cart to get updated state
      await refreshCart(activeCartId);
    } catch (err) {
      console.error("Failed to sync local cart to Medusa:", err);
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshCart, setCartId]);

  const completeCheckout = useCallback(async () => {
    const activeCartId = getActiveCartId() || cartId;
    if (!activeCartId) throw new Error("No cart ID for checkout completion");

    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
    const pubKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

    try {
      setIsLoading(true);

      // Use direct fetch to avoid stale JWT tokens from the SDK
      const res = await fetch(`${baseUrl}/store/carts/${activeCartId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": pubKey,
        },
      });

      const responseText = await res.text();

      if (!res.ok) {
        throw new Error(`Cart complete failed (${res.status}): ${responseText}`);
      }

      const response = JSON.parse(responseText);

      if (response.type === "order" && response.order) {
        localStorage.removeItem(CART_ID_KEY);
        setCartId(null as any);
        setMedusaCart(null);
        return response.order;
      }

      // Cart returned but not as an order — something is missing
      throw new Error(`Cart not completed. Response type: ${response.type}. Details: ${responseText.slice(0, 500)}`);
    } catch (err) {
      console.error("Failed to complete checkout:", err);
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cartId, setCartId]);

  const updateShippingAddress = useCallback(async (
    address: {
      first_name: string;
      last_name: string;
      address_1: string;
      address_2?: string;
      city: string;
      province: string;
      postal_code: string;
      country_code: string;
      phone?: string;
    },
    email?: string,
  ) => {
    const activeCartId = getActiveCartId() || cartId;
    if (!activeCartId) return;
    try {
      setIsLoading(true);
      const updateData: Record<string, any> = {
        shipping_address: address,
        billing_address: address,
      };
      if (email) updateData.email = email;
      await medusa.store.cart.update(activeCartId, updateData);
      await refreshCart(activeCartId);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cartId, refreshCart]);

  const createPaymentSession = useCallback(async () => {
    const activeCartId = getActiveCartId() || cartId;
    if (!activeCartId) throw new Error("No cart ID available");

    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
    const pubKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-publishable-api-key": pubKey,
    };

    try {
      setIsLoading(true);

      // Step A: Create payment collection for this cart
      const collRes = await fetch(`${baseUrl}/store/payment-collections`, {
        method: "POST",
        headers,
        body: JSON.stringify({ cart_id: activeCartId }),
      });

      if (!collRes.ok) {
        const errBody = await collRes.text();
        throw new Error(`Create payment collection failed (${collRes.status}): ${errBody}`);
      }

      const { payment_collection } = await collRes.json();

      // Step B: Create Stripe payment session within the collection
      const sessRes = await fetch(
        `${baseUrl}/store/payment-collections/${payment_collection.id}/payment-sessions`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ provider_id: "pp_stripe_stripe" }),
        }
      );

      if (!sessRes.ok) {
        const errBody = await sessRes.text();
        throw new Error(`Create payment session failed (${sessRes.status}): ${errBody}`);
      }

      const sessData = await sessRes.json();
      const stripeSession = sessData.payment_collection?.payment_sessions?.find(
        (s: any) => s.provider_id === "pp_stripe_stripe"
      );

      if (stripeSession?.data?.client_secret) {
        return stripeSession.data.client_secret as string;
      }

      throw new Error("No client_secret in response: " + JSON.stringify(sessData).slice(0, 500));
    } catch (err: any) {
      setError(err as Error);
      console.error("Failed to create payment session:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cartId]);

  // Add a Medusa shipping method to the cart (REQUIRED before payment/completion)
  const addShippingMethod = useCallback(async () => {
    const activeCartId = getActiveCartId() || cartId;
    if (!activeCartId) throw new Error("No cart ID for shipping method");

    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
    const pubKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

    try {
      setIsLoading(true);

      // Use direct fetch to avoid stale JWT issues
      const optionsRes = await fetch(
        `${baseUrl}/store/shipping-options?cart_id=${activeCartId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": pubKey,
          },
        }
      );

      if (!optionsRes.ok) {
        const errBody = await optionsRes.text();
        throw new Error(`Failed to list shipping options (${optionsRes.status}): ${errBody}`);
      }

      const { shipping_options } = await optionsRes.json();

      // Filter to only options that have a calculated price (amount is set)
      const optionsWithPrices = (shipping_options || []).filter(
        (opt: any) => opt.amount !== undefined && opt.amount !== null
      );

      console.log(`Shipping options: ${shipping_options?.length || 0} total, ${optionsWithPrices.length} with prices`);

      if (optionsWithPrices.length === 0) {
        throw new Error(
          `No shipping options with prices available. Found ${shipping_options?.length || 0} options without prices.`
        );
      }

      // Add one shipping method per shipping profile to cover all cart items.
      // Cart items may belong to different shipping profiles, and each profile
      // needs a corresponding shipping method or cart completion will fail.
      const byProfile = new Map<string, any>();
      for (const opt of optionsWithPrices) {
        const profileId = opt.shipping_profile_id || "unknown";
        if (!byProfile.has(profileId)) {
          byProfile.set(profileId, opt);
        }
      }

      console.log(`Adding shipping methods for ${byProfile.size} shipping profile(s)`);

      for (const [profileId, opt] of byProfile) {
        const addRes = await fetch(
          `${baseUrl}/store/carts/${activeCartId}/shipping-methods`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-publishable-api-key": pubKey,
            },
            body: JSON.stringify({ option_id: opt.id }),
          }
        );

        if (!addRes.ok) {
          const errBody = await addRes.text();
          throw new Error(`Failed to add shipping method for profile ${profileId} (${addRes.status}): ${errBody}`);
        }
      }

      await refreshCart(activeCartId);
    } catch (err) {
      console.error("Failed to add shipping method:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cartId, refreshCart]);

  return {
    cart: medusaCart,
    isLoading,
    error,
    addItem,
    updateItem,
    removeItem,
    syncLocalCartToMedusa,
    completeCheckout,
    refreshCart,
    updateShippingAddress,
    createPaymentSession,
    addShippingMethod,
  };
}
