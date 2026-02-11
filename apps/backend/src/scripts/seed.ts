import { ExecArgs } from "@medusajs/framework/types";
import {
  createProductsWorkflow,
  createShippingProfilesWorkflow,
  createRegionsWorkflow,
  createTaxRegionsWorkflow,
} from "@medusajs/medusa/core-flows";

/**
 * Seed Script for Turf World
 *
 * Run: pnpm seed (or: medusa exec ./src/scripts/seed.ts)
 *
 * Creates:
 * - Regions (West Coast, National)
 * - Shipping Profiles (LTL Freight, Standard Parcel)
 * - Pet Turf product with TurfAttributes
 */
export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve("logger");

  logger.info("Starting Turf World seed...");

  // ================================================
  // 1. REGIONS
  // ================================================
  logger.info("Creating regions...");

  await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "West Coast",
          currency_code: "usd",
          countries: ["us"],
          metadata: {
            states: ["CA", "OR", "WA", "NV", "AZ"],
            description: "West Coast states with CA tax handling",
          },
        },
        {
          name: "National",
          currency_code: "usd",
          countries: ["us"],
          metadata: {
            description: "All other US states",
          },
        },
      ],
    },
  });

  // ================================================
  // 2. TAX REGIONS (California specific)
  // ================================================
  logger.info("Creating tax regions...");

  await createTaxRegionsWorkflow(container).run({
    input: {
      tax_regions: [
        {
          country_code: "us",
          province_code: "CA",
          default_tax_rate: {
            name: "California Sales Tax",
            rate: 7.25, // Base CA rate, localities add more
          },
        },
      ],
    },
  });

  // ================================================
  // 3. SHIPPING PROFILES
  // ================================================
  logger.info("Creating shipping profiles...");

  await createShippingProfilesWorkflow(container).run({
    input: {
      shipping_profiles: [
        {
          name: "LTL Freight",
          type: "custom",
          metadata: {
            description: "For turf rolls - heavy freight shipping",
            carrier_type: "freight",
            weight_threshold_lbs: 150,
          },
        },
        {
          name: "Standard Parcel",
          type: "default",
          metadata: {
            description: "For samples, seam tape, small items",
            carrier_type: "parcel",
          },
        },
      ],
    },
  });

  // ================================================
  // 4. PRODUCTS - Pet Turf (K9 Series)
  // ================================================
  logger.info("Creating Pet Turf product...");

  const { result: products } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "K9 Pro Pet Turf",
          handle: "k9-pro-pet-turf",
          subtitle: "Professional-Grade Pet-Friendly Artificial Grass",
          description: `
            The K9 Pro is our top-selling pet turf, engineered specifically for dog owners.
            Features 100% permeable backing for instant drainage of pet urine, antimicrobial
            treatment to prevent odor and bacteria, and a durable 80oz Total Weight that
            stands up to heavy pet traffic.

            **Key Features:**
            - 100% permeable polyurethane backing
            - Antimicrobial yarn treatment
            - 100+ gal/min/sqft drainage rate
            - Class A fire rated
            - 16-Year Warranty
            - PFAS-free and lead-free

            **Ideal For:** Backyards, dog runs, pet facilities, kennels
          `.trim(),
          status: "published",
          is_giftcard: false,
          discountable: true,
          tags: [
            { value: "pet-friendly" },
            { value: "high-drainage" },
            { value: "antimicrobial" },
            { value: "k9-series" },
          ],
          categories: [{ name: "Pet Turf", handle: "pet-turf" }],
          options: [
            {
              title: "Length",
              values: ["Per Linear Foot", "25ft Roll", "50ft Roll", "100ft Roll"],
            },
          ],
          variants: [
            {
              title: "K9 Pro - Per Linear Foot",
              sku: "K9PRO-LF",
              prices: [
                { amount: 299, currency_code: "usd" }, // $2.99/sqft * 15ft width = ~$44.85/linear ft, showing per sqft
              ],
              options: { Length: "Per Linear Foot" },
              manage_inventory: true,
              inventory_quantity: 10000,
            },
            {
              title: "K9 Pro - 25ft Roll",
              sku: "K9PRO-25",
              prices: [{ amount: 112125, currency_code: "usd" }], // $2.99 * 15 * 25 = $1121.25
              options: { Length: "25ft Roll" },
              manage_inventory: true,
              inventory_quantity: 50,
            },
            {
              title: "K9 Pro - 50ft Roll",
              sku: "K9PRO-50",
              prices: [{ amount: 224250, currency_code: "usd" }], // $2.99 * 15 * 50
              options: { Length: "50ft Roll" },
              manage_inventory: true,
              inventory_quantity: 30,
            },
            {
              title: "K9 Pro - 100ft Roll",
              sku: "K9PRO-100",
              prices: [{ amount: 448500, currency_code: "usd" }], // $2.99 * 15 * 100
              options: { Length: "100ft Roll" },
              manage_inventory: true,
              inventory_quantity: 20,
            },
          ],
          metadata: {
            // Store turf attributes in metadata for now
            // Will be migrated to TurfAttributes table after link setup
            turf_attributes: {
              pile_height: 1.75,
              face_weight: 80,
              roll_width: 15,
              yarn_type: "C8",
              drainage_rate: 100,
              backing_type: "permeable",
              antimicrobial: true,
              odor_control_compatible: true,
              fire_rating: "Class_A",
              pfas_free: true,
              lead_free: true,
              warranty_years: 15,
              uv_stability_hours: 3000,
              primary_use: "pet",
              pet_friendly: true,
              golf_optimized: false,
              color_family: "natural",
              has_thatch: true,
              blade_shape: "w_shape",
            },
          },
        },

        // ================================================
        // PRODUCT 2: ProPutt Putting Green
        // ================================================
        {
          title: "ProPutt Tournament Green",
          handle: "proputt-tournament-green",
          subtitle: "Professional Nylon Putting Surface",
          description: `
            Tournament-quality nylon putting green with consistent ball roll and
            realistic speed. Stimp rated 10-12 for true professional feel.

            **Key Features:**
            - Texturized nylon yarn
            - Stimp speed 10-12
            - UV stabilized
            - 16-Year Warranty
          `.trim(),
          status: "published",
          tags: [
            { value: "golf" },
            { value: "putting-green" },
            { value: "nylon" },
          ],
          categories: [{ name: "Putting Greens", handle: "putting-greens" }],
          options: [
            {
              title: "Length",
              values: ["Per Linear Foot", "15ft Roll"],
            },
          ],
          variants: [
            {
              title: "ProPutt - Per Linear Foot",
              sku: "PROPUTT-LF",
              prices: [{ amount: 449, currency_code: "usd" }], // $4.49/sqft
              options: { Length: "Per Linear Foot" },
              manage_inventory: true,
              inventory_quantity: 5000,
            },
            {
              title: "ProPutt - 15ft Roll",
              sku: "PROPUTT-15",
              prices: [{ amount: 101025, currency_code: "usd" }], // $4.49 * 15 * 15
              options: { Length: "15ft Roll" },
              manage_inventory: true,
              inventory_quantity: 25,
            },
          ],
          metadata: {
            turf_attributes: {
              pile_height: 0.5,
              face_weight: 56,
              roll_width: 15,
              yarn_type: "Nylon",
              drainage_rate: 30,
              backing_type: "perforated",
              antimicrobial: false,
              fire_rating: "Class_A",
              pfas_free: true,
              lead_free: true,
              warranty_years: 15,
              primary_use: "putting",
              pet_friendly: false,
              golf_optimized: true,
              stimp_speed: 11,
              color_family: "field_green",
              has_thatch: false,
              blade_shape: "flat",
            },
          },
        },

        // ================================================
        // PRODUCT 3: EcoLush Premium Landscape
        // ================================================
        {
          title: "EcoLush Premium 108",
          handle: "ecolush-premium-108",
          subtitle: "Luxury Landscape Turf with Recycled Backing",
          description: `
            Our most realistic landscape turf. 108oz Total Weight for ultra-lush
            appearance. Recycled backing for eco-conscious buyers.

            **Key Features:**
            - 108oz Total Weight (premium density)
            - Recycled polyurethane backing
            - W-blade for natural movement
            - Brown/green thatch layer
            - 16-Year Warranty
          `.trim(),
          status: "published",
          tags: [
            { value: "landscape" },
            { value: "premium" },
            { value: "eco-friendly" },
            { value: "recycled" },
          ],
          categories: [{ name: "Landscape Turf", handle: "landscape-turf" }],
          options: [
            {
              title: "Length",
              values: ["Per Linear Foot", "50ft Roll", "100ft Roll"],
            },
          ],
          variants: [
            {
              title: "EcoLush 108 - Per Linear Foot",
              sku: "ECOLUSH108-LF",
              prices: [{ amount: 325, currency_code: "usd" }], // $3.25/sqft
              options: { Length: "Per Linear Foot" },
              manage_inventory: true,
              inventory_quantity: 8000,
            },
            {
              title: "EcoLush 108 - 50ft Roll",
              sku: "ECOLUSH108-50",
              prices: [{ amount: 243750, currency_code: "usd" }], // $3.25 * 15 * 50
              options: { Length: "50ft Roll" },
              manage_inventory: true,
              inventory_quantity: 20,
            },
            {
              title: "EcoLush 108 - 100ft Roll",
              sku: "ECOLUSH108-100",
              prices: [{ amount: 487500, currency_code: "usd" }], // $3.25 * 15 * 100
              options: { Length: "100ft Roll" },
              manage_inventory: true,
              inventory_quantity: 15,
            },
          ],
          metadata: {
            turf_attributes: {
              pile_height: 1.875,
              face_weight: 108,
              roll_width: 15,
              yarn_type: "C8",
              drainage_rate: 40,
              backing_type: "perforated",
              antimicrobial: false,
              fire_rating: "Class_A",
              pfas_free: true,
              lead_free: true,
              warranty_years: 15,
              uv_stability_hours: 5000,
              primary_use: "landscape",
              pet_friendly: true,
              golf_optimized: false,
              color_family: "natural",
              has_thatch: true,
              blade_shape: "w_shape",
            },
          },
        },
      ],
    },
  });

  logger.info(`Created ${products.length} products`);

  // ================================================
  // 5. SUPPLIES (Infill, Seam Tape, etc.)
  // ================================================
  logger.info("Creating supplies...");

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "ZeoFill Organic Infill",
          handle: "zeofill-organic-infill",
          subtitle: "Natural Zeolite Pet Odor Control Infill",
          description: "50lb bag of ZeoFill organic infill. Neutralizes pet odors naturally.",
          status: "published",
          tags: [{ value: "infill" }, { value: "pet" }, { value: "supplies" }],
          categories: [{ name: "Supplies", handle: "supplies" }],
          variants: [
            {
              title: "ZeoFill 50lb Bag",
              sku: "ZEOFILL-50",
              prices: [{ amount: 3995, currency_code: "usd" }], // $39.95
              manage_inventory: true,
              inventory_quantity: 500,
            },
          ],
        },
        {
          title: "Seam Tape - 6 inch",
          handle: "seam-tape-6inch",
          subtitle: "Professional Grade Seaming Tape",
          description: "6-inch wide seam tape for joining turf rolls. 50ft roll.",
          status: "published",
          tags: [{ value: "seaming" }, { value: "supplies" }],
          categories: [{ name: "Supplies", handle: "supplies" }],
          variants: [
            {
              title: "Seam Tape 50ft Roll",
              sku: "SEAMTAPE-50",
              prices: [{ amount: 2495, currency_code: "usd" }], // $24.95
              manage_inventory: true,
              inventory_quantity: 200,
            },
          ],
        },
        {
          title: "Turf Adhesive - 5 Gallon",
          handle: "turf-adhesive-5gal",
          subtitle: "Professional Seaming Adhesive",
          description: "5-gallon bucket of professional turf adhesive. Covers ~100 linear feet.",
          status: "published",
          tags: [{ value: "adhesive" }, { value: "supplies" }],
          categories: [{ name: "Supplies", handle: "supplies" }],
          variants: [
            {
              title: "Turf Adhesive 5 Gallon",
              sku: "ADHESIVE-5GAL",
              prices: [{ amount: 8995, currency_code: "usd" }], // $89.95
              manage_inventory: true,
              inventory_quantity: 100,
            },
          ],
        },
      ],
    },
  });

  logger.info("Seed completed successfully!");
}
