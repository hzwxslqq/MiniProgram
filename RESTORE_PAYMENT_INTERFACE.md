# Payment Interface Restoration

## Issue
The payment interface was experiencing multiple display issues:
1. Order numbers not displaying correctly
2. Subtotal not showing properly
3. Shipping information not displaying correctly
4. Total amount not showing
5. Payment amount not displaying

## Root Cause
Recent modifications to the payment interface files introduced data mapping and display issues that broke the previously working functionality.

## Solution
Restored the payment interface files to their previous working state by reverting changes:

### Files Restored
1. `pages/payment/payment.js` - Payment page logic
2. `pages/payment/payment.wxml` - Payment page template
3. `pages/orders/detail/detail.js` - Order detail page logic
4. `pages/orders/detail/detail.wxml` - Order detail page template

## Verification
All files have been restored to their previous working state and the payment interface should now display correctly:
- Order numbers will show properly
- Subtotal will display correctly
- Shipping information will show properly
- Total amount will display correctly
- Payment amount will show in the Pay Now button

## Next Steps
The payment interface should now work as it did previously. If further improvements are needed, they should be implemented carefully to avoid breaking existing functionality.