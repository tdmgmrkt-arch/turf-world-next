import { model } from "@medusajs/framework/utils";

/**
 * Turf Attributes Model
 *
 * Extends Product with turf-specific specifications that appear as
 * form fields in the Medusa admin UI.
 *
 * These fields are stored in a separate table and linked to products
 * via a one-to-one relationship.
 */
export const TurfAttributes = model.define("turf_attributes", {
  id: model.id().primaryKey(),

  // Link to product (one-to-one)
  product_id: model.text(),

  // Physical specifications
  pile_height: model.number(), // inches (e.g., 1.25, 1.5, 1.75)
  face_weight: model.number(), // ounces per square yard (e.g., 63, 80, 90)
  roll_width: model.number().default(15), // feet (almost always 15')

  // Backing type
  backing_type: model.enum([
    "permeable",
    "perforated",
    "solid",
  ]),

  // Warranty
  warranty_years: model.number().default(15), // years

  // Primary use case
  primary_use: model.enum([
    "landscape",
    "pet",
    "putting",
  ]),

  // Feature flags
  pet_friendly: model.boolean().default(false),
  golf_optimized: model.boolean().default(false),
  has_thatch: model.boolean().default(false),

  // Compliance certifications
  pfas_free: model.boolean().default(true),
  lead_free: model.boolean().default(true),
  fire_rating: model.enum([
    "Class_A",
    "Class_B",
    "Class_C",
  ]).default("Class_A"),
});
