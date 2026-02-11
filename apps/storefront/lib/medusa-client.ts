/**
 * Medusa API Client
 *
 * Simple HTTP client for Medusa v2 Store API endpoints.
 * Uses fetch to make API calls to the Medusa backend.
 */

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID || "";

/**
 * Simple Medusa API client using fetch
 */
export const medusa = {
  products: {
    /**
     * List products from Medusa store API
     */
    list: async (params?: { handle?: string; limit?: number }, options?: { headers?: Record<string, string> }) => {
      const url = new URL(`${MEDUSA_BACKEND_URL}/store/products`);

      // Add query parameters
      if (params?.handle) {
        url.searchParams.append('handle', params.handle);
      }
      if (params?.limit) {
        url.searchParams.append('limit', params.limit.toString());
      }

      // Add region ID for pricing
      if (REGION_ID) {
        url.searchParams.append('region_id', REGION_ID);
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': PUBLISHABLE_API_KEY,
          ...(options?.headers || {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      return response.json();
    },

    /**
     * List products with full metadata (including turf specifications)
     * Uses custom /store/products-extended endpoint
     */
    listExtended: async (params?: {
      handle?: string;
      collection_id?: string;
      limit?: number;
      offset?: number;
    }) => {
      const url = new URL(`${MEDUSA_BACKEND_URL}/store/products-extended`);

      // Add query parameters
      if (params?.handle) {
        url.searchParams.append('handle', params.handle);
      }
      if (params?.collection_id) {
        url.searchParams.append('collection_id', params.collection_id);
      }
      if (params?.limit) {
        url.searchParams.append('limit', params.limit.toString());
      }
      if (params?.offset) {
        url.searchParams.append('offset', params.offset.toString());
      }

      // Add region ID for pricing
      if (REGION_ID) {
        url.searchParams.append('region_id', REGION_ID);
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': PUBLISHABLE_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch extended products: ${response.statusText}`);
      }

      return response.json();
    },
  },
};

// Export publishable API key
export { PUBLISHABLE_API_KEY };

// Feature flag to enable/disable API mode
export const USE_MEDUSA_API = process.env.NEXT_PUBLIC_USE_MEDUSA_API === "true";
