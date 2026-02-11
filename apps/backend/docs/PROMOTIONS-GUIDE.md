# Promotions Guide

## Overview

Your Turf World store now supports two types of promotions:

1. **Automatic Promotions** - Visible on product pages with strikethrough pricing
2. **Promo Code Promotions** - Hidden until customer enters code at checkout

Both types are managed through the Medusa admin dashboard.

---

## Automatic Promotions (Visible on Product Pages)

These promotions display on product listings and detail pages with:
- Original price shown with strikethrough
- Sale price highlighted in red
- Discount percentage badge (e.g., "25% OFF")

### How to Create:

1. **Go to Medusa Admin** → `http://localhost:9000/app`

2. **Navigate to Promotions**
   - Click "Promotions" in the sidebar
   - Click "+ Create Promotion"

3. **Configure the Promotion:**

   **Basic Info:**
   - Name: `Spring Sale - 20% Off All Landscape Turf`
   - Code: Leave EMPTY (no code = automatic)
   - Description: `20% off all landscape turf products`
   - Type: `Percentage`
   - Value: `20` (for 20% off)

   **Application:**
   - Application Method: `Automatic` ✅ IMPORTANT
   - Applies To: `Products` or `Collections`
   - Select specific products or entire collections

   **Conditions:**
   - Region: `United States`
   - Start Date: When promotion begins
   - End Date: When promotion ends (optional)

4. **Save & Activate**
   - Make sure status is set to "Active"
   - Promotion will immediately appear on storefront

---

## Promo Code Promotions (Cart-Only)

These promotions are hidden until customer enters the code at checkout.

### How to Create:

1. **Go to Medusa Admin** → `http://localhost:9000/app`

2. **Navigate to Promotions**
   - Click "Promotions" in the sidebar
   - Click "+ Create Promotion"

3. **Configure the Promotion:**

   **Basic Info:**
   - Name: `SUMMER25 - 25% Off First Order`
   - Code: `SUMMER25` ✅ IMPORTANT - Must have a code
   - Description: `25% off for first-time customers`
   - Type: `Percentage`
   - Value: `25` (for 25% off)

   **Application:**
   - Application Method: `Code` (requires customer to enter code)
   - Applies To: `Entire Order` or specific products
   - Usage Limit: Set max uses (optional)

   **Conditions:**
   - Region: `United States`
   - Minimum Order Value: Set minimum if needed (optional)
   - Start Date: When code becomes active
   - End Date: When code expires

4. **Save & Activate**
   - Status: "Active"
   - Code will be available for customers to enter at checkout

---

## Common Promotion Scenarios

### Scenario 1: Site-Wide Sale (All Products)

**Automatic - 15% Off Everything**
```
Name: Holiday Sale - 15% Off
Code: (empty)
Type: Percentage
Value: 15
Applies To: All Products
Application Method: Automatic
Region: United States
```

### Scenario 2: Category-Specific Sale

**Automatic - 20% Off Pet Turf**
```
Name: Pet Turf Sale - 20% Off
Code: (empty)
Type: Percentage
Value: 20
Applies To: Collection → "Pet"
Application Method: Automatic
Region: United States
```

### Scenario 3: New Customer Discount

**Code-Based - $100 Off**
```
Name: New Customer - $100 Off
Code: WELCOME100
Type: Fixed Amount
Value: 10000 (in cents = $100)
Applies To: Entire Order
Application Method: Code
Region: United States
Minimum Order: 50000 (cents = $500 minimum)
Usage Limit: 1 per customer
```

### Scenario 4: Flash Sale

**Automatic - 30% Off Hawaii 80**
```
Name: Flash Sale - Hawaii 80
Code: (empty)
Type: Percentage
Value: 30
Applies To: Product → "Hawaii 80"
Application Method: Automatic
Region: United States
Start: Today 12:00 PM
End: Today 11:59 PM
```

---

## How Promotions Display on Storefront

### Product Cards (/products page)
```
[Image]
┌─────────────────┐
│  $1.65   (was)  │
│  $1.30   25% OFF│  ← Red highlight
└─────────────────┘
```

### Product Detail Page
```
Price Box (highlighted in red):
  $1.65  25% OFF
  $1.30  /sq ft
```

### Cart (Code-Based Promotions)
```
Subtotal: $500.00
Enter Code: [SUMMER25] [Apply]
Discount:  -$125.00  ← Applied after code entered
Total:     $375.00
```

---

## Technical Details

### How It Works:

1. **API Enhancement:**
   - Extended API endpoint (`/store/products-extended`) now calls Medusa's pricing service
   - Pricing service calculates promotional prices based on active promotions
   - Returns both `calculated_price` (sale) and `original_price` (pre-sale)

2. **Adapter Transformation:**
   - `transformMedusaProduct()` maps prices:
     - `priceCents` = final price customer pays
     - `comparePriceCents` = original price (if promotion active)

3. **Frontend Display:**
   - Components check for `comparePriceCents`
   - If present, display strikethrough + discount badge
   - Sale price highlighted in red

### Automatic vs. Code-Based:

| Feature | Automatic | Code-Based |
|---------|-----------|------------|
| Visible on product pages | ✅ Yes | ❌ No |
| Requires code entry | ❌ No | ✅ Yes |
| Shows strikethrough price | ✅ Yes | ❌ No |
| Applied in cart | ✅ Auto | ✅ After code |
| Best for | Sales, clearance | First-time, loyalty |

---

## Best Practices

### Automatic Promotions:
- ✅ Use for limited-time sales
- ✅ Clear, specific names ("20% Off Pet Turf")
- ✅ Set end dates to create urgency
- ✅ Highlight best-sellers

### Code-Based Promotions:
- ✅ Use short, memorable codes (SAVE20, WELCOME)
- ✅ Set usage limits to prevent abuse
- ✅ Add minimum order requirements for larger discounts
- ✅ Share codes via email, social media

### General:
- 🚫 Don't stack automatic + code promotions (Medusa handles one at a time)
- 🚫 Don't create overlapping automatic promotions on same products
- ✅ Test promotions in admin before activating
- ✅ Monitor promotion performance in Medusa analytics

---

## Testing Promotions

### Test Automatic Promotion:

1. Create promotion in admin (automatic, 20% off)
2. Visit product page on storefront
3. Verify:
   - Original price shows with strikethrough
   - Sale price highlighted in red
   - "20% OFF" badge displays
4. Add to cart and verify price

### Test Code Promotion:

1. Create promotion in admin (code: TEST20)
2. Visit product page - should show regular price
3. Add to cart
4. Enter code "TEST20" at checkout
5. Verify discount applies

---

## Troubleshooting

### Promotion Not Showing on Storefront:

**Check:**
- ✅ Promotion status is "Active"
- ✅ Region includes "United States"
- ✅ Start date is in the past
- ✅ End date is in the future (or not set)
- ✅ Product is included in promotion scope
- ✅ Refresh storefront page (hard refresh: Ctrl+F5)

### Price Not Updating:

**Solutions:**
- Restart Medusa backend: `npm run dev` in `apps/backend`
- Restart storefront: `npm run dev` in `apps/storefront`
- Clear browser cache and reload

### Multiple Promotions Conflicting:

**Medusa applies the best promotion automatically:**
- If product has 20% off AND 15% off, customer gets 20%
- Cannot combine percentage + fixed amount
- Use Medusa admin to manage active promotions

---

## Support

For more information:
- [Medusa Promotions Docs](https://docs.medusajs.com/modules/promotions)
- [Medusa Admin Guide](https://docs.medusajs.com/admin/promotions)
