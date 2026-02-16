/**
 * Turf World Type Definitions
 */

// ================================================
// TURF ATTRIBUTES (mirrors backend model)
// ================================================
export interface TurfAttributes {
  id: string;
  pile_height: number | null;
  face_weight: number | null;
  roll_width: number;
  yarn_type: "C4" | "C8" | "Nylon" | "Polypropylene" | null;
  drainage_rate: number | null;
  backing_type: "solid" | "perforated" | "permeable";
  antimicrobial: boolean;
  odor_control_compatible: boolean;
  fire_rating: "Class_A" | "Class_B" | "Class_C" | "Unrated" | null;
  pfas_free: boolean;
  lead_free: boolean;
  warranty_years: number;
  uv_stability_hours: number | null;
  primary_use: "landscape" | "pet" | "playground" | "sports" | "putting" | "rooftop";
  pet_friendly: boolean;
  golf_optimized: boolean;
  stimp_speed: number | null;
  color_family: "olive" | "bermuda" | "natural" | "winter" | "field_green" | null;
  has_thatch: boolean;
  blade_shape: "flat" | "c_shape" | "w_shape" | "diamond" | "s_shape";
}

// ================================================
// PRODUCT (extends Medusa Product)
// ================================================
export interface Product {
  id: string;
  title: string;
  handle: string;
  subtitle: string | null;
  description: string | null;
  thumbnail: string | null;
  status: "draft" | "published";
  variants: ProductVariant[];
  options: ProductOption[];
  tags: { value: string }[];
  metadata: {
    turf_attributes?: TurfAttributes;
  } | null;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string | null;
  prices: Price[];
  inventory_quantity: number;
  options: Record<string, string>;
}

export interface ProductOption {
  title: string;
  values: string[];
}

export interface Price {
  amount: number;
  currency_code: string;
}

// ================================================
// CART
// ================================================
export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  thumbnail: string | null;
  quantity: number;
  unitPrice: number; // in cents
  // For turf: dimensions used in calculation
  dimensions?: {
    widthFeet: number;
    lengthFeet: number;
    squareFeet: number;
  };
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  taxTotal: number;
  shippingTotal: number;
  total: number;
}

// ================================================
// CALCULATOR
// ================================================
export interface ProjectEstimate {
  projectSquareFeet: number;
  turf: {
    rollsNeeded: number;
    linearFeetTotal: number;
    wastePercentage: number;
  };
  seaming: {
    seamCount: number;
    seamTapeFeet: number;
  };
  infill: {
    poundsNeeded: number;
    bagsNeeded: number;
  } | null;
  notes: string[];
}

// ================================================
// CUSTOMER
// ================================================
export interface Customer {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  has_account: boolean;
  created_at: string;
}

export interface CustomerAddress {
  id: string;
  first_name: string;
  last_name: string;
  company: string | null;
  address_1: string;
  address_2: string | null;
  city: string;
  province: string;
  postal_code: string;
  country_code: string;
  phone: string | null;
  is_default_shipping: boolean;
  metadata?: { name?: string } & Record<string, unknown>;
}

// ================================================
// NAVIGATION
// ================================================
export interface NavCategory {
  name: string;
  href: string;
  description: string;
  featured?: {
    name: string;
    href: string;
    imageSrc: string;
  }[];
}
