# AgriLink Direct App Demo Script

## Demo Setup

1. Open PowerShell in `C:\Users\imdk2\Desktop\Farmer-Customer`
2. Start the app:
   ```powershell
   node app.js
   ```
3. Open `http://localhost:3005`

## Demo Accounts

- Farmer
  - Phone: `9876500001`
  - Password: `password123`
- Customer
  - Email: `arun.nair@example.com`
  - Password: `password123`
- Admin
  - Username: `admin`
  - Password: `admin123`

## Opening Pitch

"This is AgriLink Direct, a farmer-to-customer marketplace built with Express, EJS, and Oracle. The app supports product discovery, role-based login, order placement, expiry-aware discounts, order tracking, refunds, reviews, farmer inventory management, and admin-level monitoring."

## Part 1: Homepage and Product Discovery

1. Start on the home page.
2. Say:
   "The landing page shows all available products with images, category labels, stock, expiry date, and pricing."
3. Use the search bar to search for a product.
4. Click category filters like `Fruits`, `Vegetables`, `Dairy`, `Spices`, `Cereals`, or `Pulses`.
5. Point out:
   - Near-expiry items show a discount badge.
   - Expired items are blocked from ordering.
   - Ratings and review counts are shown on product cards.

## Part 2: Customer Flow

1. Login as the customer.
2. Return to the homepage and click `Buy Now` on one or two products.
3. Open `/order`.
4. Say:
   "The bag groups items by farmer so multi-farmer purchases remain organized."
5. Show:
   - Quantity updates
   - Remove item option
   - Savings from expiry discount
   - Expiry information inside the bag
6. Click `Proceed to Checkout`.
7. On the checkout page, explain:
   - Payment mode selection
   - Delivery address entry
   - Total payable and savings summary
   - Cancellation policy
8. Place an order if you want a full live transaction.
9. Back on the order page, show:
   - Order history
   - Status progression
   - Refund preview for cancellation
   - Review/rating form for delivered orders

## Part 3: Farmer Flow

1. Logout and login as the farmer.
2. Open `/product`.
3. Say:
   "Farmers can create and manage their own product listings from this screen."
4. Show the add-product form:
   - Product name
   - Category
   - Price per kg
   - Available quantity
   - Expiry date
   - Manual discount percent
   - Image upload
5. Point to the product table below and explain:
   - Edit and delete actions
   - Expiry labels
   - Manual discount vs applied discount
   - Near-expiry discount logic
6. Open `/farmer/dashboard`.
7. Highlight:
   - Products listed
   - Incoming orders
   - Delivered revenue
   - Open order value
   - Total quantity sold
8. If orders exist, update one through `Packed`, `Shipped`, and `Delivered`.
9. Say:
   "This gives the farmer direct control over fulfilment without admin intervention."

## Part 4: Admin Flow

1. Logout and login as the admin.
2. Open `/admin`.
3. Say:
   "The admin dashboard gives a complete view of marketplace activity."
4. Show:
   - Revenue loaded from the Oracle `get_total_revenue()` function
   - Farmer list
   - Customer list
   - Product list
   - Order list
5. Point out:
   - Admin can remove farmers or customers when intervention is needed.
   - Product pricing reflects expiry-based discounting.
   - Orders include payment mode, address, status, and refund data.

## Part 5: Expiry Date Feature

1. Mention:
   "This app includes expiry-aware selling logic."
2. Explain:
   - Expired products cannot be ordered.
   - Near-expiry products automatically receive a discount.
   - Farmers can set expiry dates while listing products.
   - We also updated expired products in the database to a future date so the demo inventory stays orderable.

## Closing Script

"In summary, AgriLink Direct covers the full marketplace lifecycle: browsing, ordering, fulfilment, refunds, reviews, inventory updates, expiry-aware discounts, and admin monitoring. It demonstrates how Oracle PL/SQL logic and a Node.js frontend can work together in a practical direct-market platform."

## Optional Fast Demo Order

If you only have 2 to 3 minutes:

1. Show homepage filters and search.
2. Login as customer and add one item to bag.
3. Show checkout and refund policy.
4. Login as farmer and show product management plus dashboard.
5. Login as admin and show revenue plus system-wide monitoring.
