# Technical Debt: Turf World Backend

## 1. Custom Turf-Product Module (DISABLED)

**Status:** Disabled as of January 2026
**Priority:** Low (storefront works without it)
**Files Affected:**
- `medusa-config.ts` - Module commented out (lines 48-50)
- `src/links/product-turf-attributes.ts` - Exports `undefined` instead of link
- `src/modules/turf-product/models/turf-attributes.ts` - Timestamp fields removed

### What Happened

The custom `turf-product` module was created to add turf-specific attributes (pile height, face weight, backing type, drainage rate, etc.) to Medusa products. During migration setup, it failed with:

```
Error: Key undefined is not linkable
Error: Service turfProduct was not found
```

The module wasn't properly configured for Medusa v2's linkable module system.

### Current Workaround

1. Module disabled in `medusa-config.ts`:
   ```typescript
   // {
   //   resolve: "./src/modules/turf-product",
   // },
   ```

2. Links file exports undefined:
   ```typescript
   // src/links/product-turf-attributes.ts
   export default undefined;
   ```

3. Timestamp fields removed from model (caused TypeScript errors):
   - Removed: `created_at: model.dateTime().default(() => new Date())`
   - Removed: `updated_at: model.dateTime().default(() => new Date())`

### What Still Works

- Storefront uses hardcoded product data from `apps/storefront/lib/products.ts`
- All turf attributes are defined in that file
- Cart, checkout, and product browsing work normally
- Medusa core modules (cart, order, payment, etc.) work fine

### What Doesn't Work

- Cannot manage turf products through Medusa Admin
- Turf attributes not stored in PostgreSQL database
- No dynamic product management (must edit code to change products)

### To Re-enable (Future Work)

1. **Fix the module's linkable configuration:**
   ```typescript
   // src/modules/turf-product/index.ts
   import { Module } from "@medusajs/framework/utils"
   import TurfProductModuleService from "./service"

   export const TURF_PRODUCT_MODULE = "turfProduct"

   export default Module(TURF_PRODUCT_MODULE, {
     service: TurfProductModuleService,
   })
   ```

2. **Update the model with proper Medusa v2 patterns** - Check Medusa v2 docs for correct `model.define()` usage with timestamps

3. **Fix the link definition:**
   ```typescript
   // src/links/product-turf-attributes.ts
   import { defineLink } from "@medusajs/framework/utils"
   import ProductModule from "@medusajs/product"
   import { TURF_PRODUCT_MODULE } from "../modules/turf-product"

   export default defineLink(
     ProductModule.linkable.product,
     {
       linkable: /* proper linkable config */,
       isList: false,
     }
   )
   ```

4. **Re-enable in medusa-config.ts:**
   ```typescript
   {
     resolve: "./src/modules/turf-product",
   },
   ```

5. **Run migrations:**
   ```bash
   cd apps/backend
   npm run db:migrate
   ```

### Resources

- [Medusa v2 Custom Modules](https://docs.medusajs.com/learn/fundamentals/modules)
- [Medusa v2 Module Links](https://docs.medusajs.com/learn/fundamentals/module-links)
- [Medusa v2 Data Models](https://docs.medusajs.com/learn/fundamentals/data-models)

---

## Quick Reference for Claude

When resuming work on this project, you can say:

> "Check TECHNICAL_DEBT.md in the backend folder for context on disabled features"

Or specifically:

> "I want to re-enable the turf-product module - see TECHNICAL_DEBT.md for what was disabled and why"
