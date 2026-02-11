# Turf World Admin Dashboard Customization

This directory contains customizations for the Medusa admin dashboard.

## What You Can Customize

### 1. **Branding** ✅ Easy
- App title & favicon
- Logo (header and login page)
- Brand colors
- Custom CSS

### 2. **Theme Colors** ✅ Easy
- Primary color (buttons, links, highlights)
- Background colors
- Text colors
- Border colors

### 3. **Custom Widgets** ⚙️ Intermediate
- Add custom info panels to product pages
- Display turf specifications
- Show custom metrics
- Add quick actions

### 4. **Custom Routes** ⚙️ Advanced
- Create completely custom admin pages
- Build custom reports
- Add custom management tools

### 5. **Custom CSS** ✅ Easy
- Override any admin styling
- Add custom fonts
- Adjust layouts

## Quick Start

### Step 1: Add Your Logo

1. Add your logo to `apps/backend/public/admin/`
   - `logo.svg` - Main logo (for header)
   - `logo-dark.svg` - Dark mode logo (optional)
   - `favicon.ico` - Browser icon

2. Uncomment logo lines in `config.ts`:
   ```typescript
   logo: "/admin/logo.svg",
   favicon: "/admin/favicon.ico",
   ```

### Step 2: Customize Colors

Edit `config.ts` and update the primary color palette to match your brand.

### Step 3: Add Custom CSS

Create `apps/backend/src/admin/styles.css`:
```css
/* Custom admin styles */
:root {
  --admin-primary: #22c55e;
}

.admin-header {
  background: linear-gradient(to right, #22c55e, #16a34a);
}
```

### Step 4: Create Custom Widgets (Optional)

Example: Show turf specifications on product pages
```typescript
// apps/backend/src/admin/widgets/turf-specs.tsx
import { defineWidget } from "@medusajs/admin-sdk";

export default defineWidget({
  zone: "product.details.after",
  Component: TurfSpecificationsWidget,
});
```

## Examples

### Custom Login Page
Add your branding to the login screen with custom logo and colors.

### Product Dashboard
Show turf-specific metrics like:
- Most popular pile heights
- Best-selling products by category
- Inventory alerts for low stock

### Custom Analytics
Create custom reports for:
- Sales by product category (landscape vs pet vs putting)
- Average order value
- Regional sales data

## Next Steps

1. **Add logo files** to `apps/backend/public/admin/`
2. **Update config.ts** with your logo paths
3. **Customize colors** to match Turf World brand
4. **Add custom widgets** for turf-specific data
5. **Build custom reports** for business insights

## Resources

- [Medusa Admin SDK Docs](https://docs.medusajs.com/admin-sdk)
- [Admin Customization Guide](https://docs.medusajs.com/admin/customization)
- [Widget API Reference](https://docs.medusajs.com/admin/widgets)
