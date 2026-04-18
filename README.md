# AgriLink Direct

AgriLink Direct is a farmer-to-customer marketplace web application that helps farmers sell fresh produce directly to customers without middlemen. The system supports product browsing, farmer inventory management, customer ordering, checkout, order tracking, expiry-aware discounts, reviews, refunds, and admin monitoring.

## Features

- Role-based login for Farmers, Customers, and Admin
- Product catalogue with images, categories, stock, price, expiry date, and discounts
- Search and category-based product filtering
- Customer cart and checkout flow
- Farmer product management with add, edit, delete, image upload, expiry date, and manual discount
- Farmer dashboard for orders, revenue, and fulfilment status
- Order status updates such as Packed, Shipped, and Delivered
- Product reviews and ratings
- Automatic discount logic for near-expiry products
- Expired products are blocked from ordering
- Admin dashboard for farmers, customers, products, orders, and revenue
- Oracle PL/SQL package, procedures, functions, triggers, and views for database logic

## Tech Stack

- **Frontend:** HTML, CSS, EJS
- **Backend:** Node.js, Express.js
- **Database:** Oracle Database
- **Authentication:** Express Session, bcryptjs
- **File Uploads:** Multer
- **Template Engine:** EJS with Express EJS Layouts

## Project Structure

```text
Farmer-Customer/
├── app.js                     # Main Express application
├── package.json               # Node.js dependencies and scripts
├── oracle_setup.sql           # Oracle database setup script
├── dbms_project_plsql.sql     # PL/SQL package and database logic
├── massive_seed.sql           # Sample data
├── public/
│   ├── css/                   # Stylesheets
│   ├── images/                # Static images and logo
│   └── uploads/               # Uploaded product images
├── views/                     # EJS templates
│   ├── home.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── product.ejs
│   ├── checkout.ejs
│   ├── order.ejs
│   ├── farmer_dashboard.ejs
│   └── admin.ejs
└── screenshots/               # Project screenshots

