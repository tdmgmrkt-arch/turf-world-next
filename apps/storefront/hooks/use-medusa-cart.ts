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
   * Sync local cart items to Medusa cart with metadata
   * This ensures cut dimensions and other custom data are sent to the backend
   */
  const syncLocalCartToMedusa = useCallback(async (localCartItems: any[]) => {
    if (!cartId || localCartItems.length === 0) return;

    try {
      setIsLoading(true);

      // Clear existing Medusa cart items to avoid duplicates
      if (medusaCart?.items?.length > 0) {
        for (const item of medusaCart.items) {
          await medusa.store.cart.deleteLineItem(cartId, item.id);
        }
      }

      // Get region ID for product queries (optional — omit if not set to avoid API error)
      const regionId = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID;
      const listParams: Record<string, any> = { limit: 100 };
      if (regionId) listParams.region_id = regionId;

      // Add each local cart item to Medusa cart with metadata
      for (const localItem of localCartItems) {
        try {
          // Fetch the Medusa product to get its actual variant ID
          // The productId in local cart is the original product ID (e.g., "hawaii-80")
          const { products } = await medusa.store.product.list(listParams);

          // Find product by Medusa ID, original_id metadata, or handle
          const medusaProduct = products.find(
            (p: any) => p.id === localItem.productId || p.metadata?.original_id === localItem.productId || p.handle === localItem.productId
          );

          if (!medusaProduct || !medusaProduct.variants?.[0]) {
            console.warn(`Could not find Medusa variant for product: ${localItem.productId}`);
            continue;
          }

          // Use the first variant ID from the Medusa product
          const variantId = medusaProduct.variants[0].id;

          // Build metadata with cut dimensions
          const metadata: Record<string, any> = {
            local_cart_id: localItem.id,
            original_product_id: localItem.productId,
            custom_title: localItem.title, // Preserve the custom title like "Hawaii 80 - Cut #1"
          };

          // Add dimension metadata if present (for custom cuts)
          if (localItem.dimensions) {
            metadata.cut_width_ft = localItem.dimensions.widthFeet;
            metadata.cut_length_ft = localItem.dimensions.lengthFeet;
            metadata.cut_square_feet = localItem.dimensions.squareFeet;
            metadata.cut_label = `${localItem.dimensions.widthFeet}' × ${localItem.dimensions.lengthFeet}'`;
          }

          // Create line item in Medusa cart
          await medusa.store.cart.createLineItem(cartId, {
            variant_id: variantId,
            quantity: localItem.quantity,
            metadata,
          });
        } catch (itemErr) {
          console.error(`Failed to add item ${localItem.id} to Medusa cart:`, itemErr);
          // Continue with other items even if one fails
        }
      }

      // Refresh cart to get updated state
      await refreshCart(cartId);
    } catch (err) {
      console.error("Failed to sync local cart to Medusa:", err);
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cartId, medusaCart, refreshCart]);

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

    try {
      setIsLoading(true);

      // Retrieve the full cart object (SDK needs it for payment init)
      const { cart } = await medusa.store.cart.retrieve(cartId);

      // Initialize Stripe payment session via SDK
      // The SDK automatically creates a payment collection if needed
      const { payment_collection } = await (medusa.store.payment as any).initiatePaymentSession(
        cart,
        { provider_id: "pp_stripe_stripe" },
      );

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

  // Add a Medusa shipping method to the cart (required before payment)
  const addShippingMethod = useCallback(async () => {
    if (!cartId) return;
    try {
      setIsLoading(true);
      // Get available shipping options for this cart
      const { shipping_options } = await medusa.store.fulfillment.listCartOptions({
        cart_id: cartId,
      });

      if (shipping_options?.length > 0) {
        await medusa.store.cart.addShippingMethod(cartId, {
          option_id: shipping_options[0].id,
        });
        await refreshCart(cartId);
      }
    } catch (err) {
      console.error("Failed to add shipping method:", err);
      // Non-fatal: payment init will still attempt without it
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