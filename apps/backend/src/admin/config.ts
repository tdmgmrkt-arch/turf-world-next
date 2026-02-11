import { defineConfig } from "@medusajs/admin-sdk";

/**
 * Turf World Admin Dashboard Customization
 *
 * Customize the Medusa admin dashboard with your brand colors,
 * logo, and custom functionality.
 */
export default defineConfig({
  // Custom branding
  settings: {
    // App title (appears in browser tab)
    title: "Turf World Admin",

    // Favicon (you can add your own later)
    // favicon: "/admin/favicon.ico",

    // Logo (you can add your own later)
    // logo: "/admin/logo.svg",
  },

  // Custom theme colors
  theme: {
    colors: {
      // Primary brand color (Turf World green)
      primary: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',  // Main brand color
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
      },
    },
  },
});
