import { defineConfig, loadEnv } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000,http://localhost:3008,https://turf-world-next-storefront.vercel.app",
      adminCors: process.env.ADMIN_CORS || "http://localhost:7001,https://turf-world-next-storefront.vercel.app",
      authCors: process.env.AUTH_CORS || "http://localhost:3000,http://localhost:3008,http://localhost:7001,https://turf-world-next-storefront.vercel.app",
      jwtSecret: process.env.JWT_SECRET || "supersecret-jwt-change-in-production",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret-cookie-change-in-production",
    },
  },

  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
    disable: process.env.DISABLE_ADMIN === "true",
  },

  modules: [
    // ========================================
    // PAYMENT (Stripe) - Only load if API key is configured
    // ========================================
    ...(process.env.STRIPE_API_KEY && process.env.STRIPE_API_KEY !== "sk_test_INSERT_YOUR_SECRET_KEY_HERE"
      ? [
          {
            resolve: "@medusajs/medusa/payment",
            options: {
              providers: [
                {
                  resolve: "@medusajs/medusa/payment-stripe",
                  id: "stripe",
                  options: {
                    apiKey: process.env.STRIPE_API_KEY,
                    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
                    capture: true,
                  },
                },
              ],
            },
          },
        ]
      : []),

    // ========================================
    // TAX (Stripe Tax) - Destination-based tax via Stripe Tax API
    // ========================================
    ...(process.env.STRIPE_API_KEY && process.env.STRIPE_API_KEY !== "sk_test_INSERT_YOUR_SECRET_KEY_HERE"
      ? [
          {
            resolve: "@medusajs/medusa/tax",
            options: {
              providers: [
                {
                  resolve: "./src/modules/stripe-tax-provider",
                  id: "stripe-tax",
                  options: {
                    apiKey: process.env.STRIPE_API_KEY,
                  },
                },
              ],
            },
          },
        ]
      : []),

    // ========================================
    // FILE STORAGE - Using local for now (S3 can be added later)
    // ========================================

    // ========================================
    // CUSTOM: TURF PRODUCT MODULE (DISABLED FOR NOW)
    // TODO: Fix module linkable configuration
    // ========================================
    // {
    //   resolve: "./src/modules/turf-product",
    // },

    // ========================================
    // CUSTOM: TURF ATTRIBUTES MODULE
    // Extends products with turf-specific fields
    // ========================================
    {
      resolve: "./src/modules/turf-attributes",
    },
  ],
});
