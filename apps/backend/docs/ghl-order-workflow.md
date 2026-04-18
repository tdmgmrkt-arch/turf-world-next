# Turf World — GHL Order Notifications Workflow

**Trigger:** Inbound Webhook (already created in GHL)
**Webhook URL:** `https://services.leadconnectorhq.com/hooks/lBYgCVRxgw7QkJkVotLZ/webhook-trigger/c5fe0399-c4b7-41e5-979b-e9822fd4e86f`

**Env var in Railway (backend service):** `GHL_ORDER_WEBHOOK_URL=<URL above>`

---

## Workflow Structure

```
[Trigger: Inbound Webhook]
  → Action 1: Create/Update Contact
  → Action 2: Internal Notification — SMS to David
  → Action 3: Internal Notification — Email to David
  → Action 4: Send Email — Customer Order Confirmation
  → Action 5: Add Tags
```

No branches, no delays.

---

## 1. Custom Fields to Create First

**Settings → Custom Fields → Contacts.** All Text (single line) unless noted.

| Label | Internal Name | Type |
|---|---|---|
| Last Order ID | `last_order_id` | Text |
| Last Order # | `last_order_display_id` | Text |
| Last Order Total | `last_order_total` | Text |
| Last Order Items | `last_order_items` | Text Area |
| Last Order Date | `last_order_date` | Text |
| Last Order Shipping Method | `last_order_shipping_method` | Text |

---

## 2. Contact Mapping (Action 1)

| GHL Field | Merge Tag |
|---|---|
| First Name | `{{inboundWebhookRequest.customer_first_name}}` |
| Last Name | `{{inboundWebhookRequest.customer_last_name}}` |
| Email | `{{inboundWebhookRequest.customer_email}}` |
| Phone | `{{inboundWebhookRequest.customer_phone}}` |
| Street Address | `{{inboundWebhookRequest.shipping_address_1}}` |
| City | `{{inboundWebhookRequest.shipping_city}}` |
| State | `{{inboundWebhookRequest.shipping_state}}` |
| Postal Code | `{{inboundWebhookRequest.shipping_postal_code}}` |
| Last Order ID | `{{inboundWebhookRequest.order_id}}` |
| Last Order # | `{{inboundWebhookRequest.display_id}}` |
| Last Order Total | `{{inboundWebhookRequest.total_formatted}}` |
| Last Order Items | `{{inboundWebhookRequest.items_text}}` |
| Last Order Date | `{{inboundWebhookRequest.placed_at}}` |
| Last Order Shipping Method | `{{inboundWebhookRequest.shipping_method}}` |

**Find Contact By:** Email. **If exists:** Update.

---

## 3. Admin SMS (Action 2)

**To:** `{{ADMIN_PHONE}}`

```
New Turf World Order #{{inboundWebhookRequest.display_id}}

{{inboundWebhookRequest.customer_full_name}}
{{inboundWebhookRequest.items_text}}
Total: {{inboundWebhookRequest.total_formatted}} | {{inboundWebhookRequest.shipping_method}}
Ship to: {{inboundWebhookRequest.shipping_city}}, CA

turf-world.com/admin to fulfill.
```

---

## 4. Admin Email (Action 3)

**To:** `{{ADMIN_EMAIL}}`
**Subject:** `New Order #{{inboundWebhookRequest.display_id}} — {{inboundWebhookRequest.customer_full_name}} — {{inboundWebhookRequest.total_formatted}}`

**Body:**
```
NEW ONLINE ORDER — NEEDS FULFILLMENT
=====================================

Order #{{inboundWebhookRequest.display_id}}
Placed: {{inboundWebhookRequest.placed_at}}
Order ID: {{inboundWebhookRequest.order_id}}


CUSTOMER
--------
Name:   {{inboundWebhookRequest.customer_full_name}}
Email:  {{inboundWebhookRequest.customer_email}}
Phone:  {{inboundWebhookRequest.customer_phone}}


SHIP TO
-------
{{inboundWebhookRequest.shipping_address_oneline}}


ITEMS
-----
{{inboundWebhookRequest.items_text}}


ORDER TOTALS
------------
Subtotal:  {{inboundWebhookRequest.subtotal_formatted}}
Shipping:  {{inboundWebhookRequest.shipping_total_formatted}}
Tax:       {{inboundWebhookRequest.tax_total_formatted}}
TOTAL:     {{inboundWebhookRequest.total_formatted}}

Shipping method: {{inboundWebhookRequest.shipping_method}}


—
Turf World order automation
support@turf-world.com | (909) 491-2203
```

---

## 5. Customer Confirmation Email (Action 4)

**From Name:** `Turf World`
**From Email:** `{{FROM_EMAIL}}` (must be verified in GHL Settings → Email Services)
**Subject:** `Your Turf World order is confirmed (#{{inboundWebhookRequest.display_id}})`

HTML template is in [ghl-order-confirmation-email.html](./ghl-order-confirmation-email.html).

**To use it:**
1. Marketing → Emails → Templates → + New Template
2. Name: `Turf World — Customer — Order Confirmation`
3. Switch to HTML editor (not drag-and-drop)
4. Paste the entire contents of `ghl-order-confirmation-email.html`
5. Save

Then in the workflow: Send Email action → Select Template → pick that one.

---

## 6. Tags to Apply (Action 5)

Add all three in a single Add Tag action:
- `turf-customer`
- `src-website-order`
- `order-placed`

---

## Placeholders to Replace Before Publishing

- `{{ADMIN_PHONE}}` — David's cell
- `{{ADMIN_EMAIL}}` — David's email
- `{{FROM_EMAIL}}` — verified sending address (`orders@turf-world.com` or `support@turf-world.com`)

---

## Testing

Place a real test order through the storefront after everything is deployed. Verify:
- Contact appears in GHL, all 14 fields populated (especially city vs. state — easy to flip)
- Custom fields populated on contact record
- David's SMS arrives within 60 seconds
- David's email arrives with subject line resolved
- Customer email arrives, renders cleanly on mobile
- Tags applied

---

## Known Flags

1. **`placed_at` is UTC** — admin email shows ISO string. Backend subscriber can be updated to format as PT if wanted.
2. **Verified sending address required** — `{{FROM_EMAIL}}` must be verified in GHL before publishing.
3. **`items_text` line breaks** — HTML template uses `white-space:pre-wrap`. If items render as one blob in testing, backend subscriber needs to use `<br>` instead of `\n`.
4. **No pipeline** — intentional. Purchases, not leads. Build a fulfillment kanban separately if wanted.
5. **Review request flow** — not in scope. Build separately once fulfillment lifecycle is clear.
