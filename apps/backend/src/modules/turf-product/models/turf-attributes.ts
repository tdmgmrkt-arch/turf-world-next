import { model } from "@medusajs/framework/utils";

/**
 * TurfAttributes Model
 *
 * Extends Medusa Products with artificial turf specifications.
 * Powers: product filtering, calculator logic, trust badges.
 *
 * Linked to Product via src/links/product-turf-attributes.ts
 */
export const TurfAttributes = model.define("turf_attributes", {
  id: model.id().primaryKey(),

  // ================================================
  // PHYSICAL SPECS
  // ================================================

  /** Pile height in inches (1.5 - 2.5 typical) */
  pile_height: model.float().nullable(),

  /** Face weight oz/sq yd (59, 80, 108 etc.) - durability indicator */
  face_weight: model.float().nullable(),

  /** Roll width in feet - ALWAYS 15 for standard turf */
  roll_width: model.float().default(15),

  /** Yarn type: C4 (budget), C8 (premium), Nylon (putting greens) */
  yarn_type: model.enum(["C4", "C8", "Nylon", "Polypropylene"]).nullable(),

  // ================================================
  // PET-SPECIFIC (K9 Series)
  // ================================================

  /** Drainage gal/min/sqft - critical for pet turf (30 standard, 100+ premium) */
  drainage_rate: model.float().nullable(),

  /** Backing: solid, perforated, permeable (100% flow-through for pets) */
  backing_type: model.enum(["solid", "perforated", "permeable"]).default("perforated"),

  /** Antimicrobial treatment - prevents bacteria/odor */
  antimicrobial: model.boolean().default(false),

  /** Compatible with ZeoFill or similar odor-control infill */
  odor_control_compatible: model.boolean().default(true),

  // ================================================
  // SAFETY & COMPLIANCE
  // ================================================

  /** Fire rating: Class_A required for commercial in CA */
  fire_rating: model.enum(["Class_A", "Class_B", "Class_C", "Unrated"]).nullable(),

  /** PFAS-free certification */
  pfas_free: model.boolean().default(true),

  /** Lead-free (required for residential/playground) */
  lead_free: model.boolean().default(true),

  // ================================================
  // WARRANTY
  // ================================================

  /** Warranty years (typically 15) */
  warranty_years: model.number().default(15),

  /** UV stability hours tested */
  uv_stability_hours: model.number().nullable(),

  // ================================================
  // USE CASE CLASSIFICATION
  // ================================================

  /** Primary use for filtering */
  primary_use: model
    .enum(["landscape", "pet", "playground", "sports", "putting", "rooftop"])
    .default("landscape"),

  pet_friendly: model.boolean().default(true),
  golf_optimized: model.boolean().default(false),

  /** Stimp speed 6-14 for putting greens */
  stimp_speed: model.float().nullable(),

  // ================================================
  // APPEARANCE
  // ================================================

  color_family: model.enum(["olive", "bermuda", "natural", "winter", "field_green"]).nullable(),
  has_thatch: model.boolean().default(true),
  blade_shape: model.enum(["flat", "c_shape", "w_shape", "diamond", "s_shape"]).default("c_shape"),

});
