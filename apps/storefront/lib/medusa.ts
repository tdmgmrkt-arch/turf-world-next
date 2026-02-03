import Medusa from "@medusajs/js-sdk";

/**
 * Medusa JS SDK Client
 *
 * Used for server-side data fetching in Server Components
 * and client-side mutations (cart, checkout)
 */
export const medusa = new Medusa({
  baseUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
  debug: process.env.NODE_ENV === "development",
});

/**
 * Fetch all products (Server Component)
 */
export async function getProducts() {
  const { products } = await medusa.store.product.list({
    limit: 100,
  });
  return products;
}

/**
 * Fetch single product by handle (Server Component)
 */
export async function getProductByHandle(handle: string) {
  const { products } = await medusa.store.product.list({
    handle,
    limit: 1,
  });
  return products[0] || null;
}

/**
 * Fetch products by category handle (Server Component)
 */
export async function getProductsByCategory(categoryHandle: string) {
  const { products } = await medusa.store.product.list({
    category_id: [categoryHandle],
    limit: 50,
  });
  return products;
}

/**
 * Create a new cart (Client-side)
 */
export async function createCart(regionId?: string) {
  const { cart } = await medusa.store.cart.create({
    region_id: regionId,
  });
  return cart;
}

/**
 * Get cart by ID (Client-side)
 */
export async function getCart(cartId: string) {
  const { cart } = await medusa.store.cart.retrieve(cartId);
  return cart;
}

/**
 * Add item to cart (Client-side)
 */
export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number
) {
  const { cart } = await medusa.store.cart.createLineItem(cartId, {
    variant_id: variantId,
    quantity,
  });
  return cart;
}

/**
 * Update cart item quantity (Client-side)
 */
export async function updateCartItem(
  cartId: string,
  lineItemId: string,
  quantity: number
) {
  const { cart } = await medusa.store.cart.updateLineItem(cartId, lineItemId, {
    quantity,
  });
  return cart;
}

/**
 * Remove item from cart (Client-side)
 */
export async function removeFromCart(cartId: string, lineItemId: string) {
  await medusa.store.cart.deleteLineItem(cartId, lineItemId);
  // In Medusa v2, deleteLineItem doesn't return the cart, so we refetch it
  const { cart } = await medusa.store.cart.retrieve(cartId);
  return cart;
}
