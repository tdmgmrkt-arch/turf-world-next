import { defineWidget } from "@medusajs/admin-sdk";

/**
 * Turf Specifications Widget
 *
 * Displays turf-specific attributes on the product detail page
 * in the admin dashboard. Makes it easy for staff to see pile height,
 * weight, backing type, etc. at a glance.
 *
 * This widget appears on the product details page below the main product info.
 */

// The widget component
const TurfSpecificationsWidget = ({ data }: { data: any }) => {
  const product = data?.product;
  const turfAttributes = product?.metadata?.turf_attributes;

  if (!turfAttributes) {
    return null; // Only show for turf products
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🌿 Turf Specifications
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Physical specs */}
        <div>
          <p className="text-sm text-gray-500">Pile Height</p>
          <p className="text-base font-medium text-gray-900">
            {turfAttributes.pile_height}"
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Face Weight</p>
          <p className="text-base font-medium text-gray-900">
            {turfAttributes.face_weight} oz
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Backing Type</p>
          <p className="text-base font-medium text-gray-900 capitalize">
            {turfAttributes.backing_type}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Warranty</p>
          <p className="text-base font-medium text-gray-900">
            {turfAttributes.warranty_years} Years
          </p>
        </div>

        {/* Feature flags */}
        <div>
          <p className="text-sm text-gray-500">Features</p>
          <div className="flex gap-2 mt-1">
            {turfAttributes.pet_friendly && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-medium">
                🐕 Pet Friendly
              </span>
            )}
            {turfAttributes.golf_optimized && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-800 text-xs font-medium">
                ⛳ Golf Optimized
              </span>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <p className="text-sm text-gray-500">Certifications</p>
          <div className="flex gap-2 mt-1">
            {turfAttributes.pfas_free && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-800 text-xs font-medium">
                ✓ PFAS Free
              </span>
            )}
            {turfAttributes.lead_free && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-800 text-xs font-medium">
                ✓ Lead Free
              </span>
            )}
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-100 text-red-800 text-xs font-medium">
              🔥 {turfAttributes.fire_rating}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Register the widget to appear on product detail pages
export default defineWidget({
  // Show this widget on the product details page, after the main product info
  zone: "product.details.after",

  // The component to render
  Component: TurfSpecificationsWidget,
});
