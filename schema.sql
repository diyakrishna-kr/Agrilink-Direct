-- Farmer\nCREATE TABLE farmer (
    farmer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    bank_details TEXT
);

-- Customer
CREATE TABLE customer (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    address TEXT
);

-- Product
CREATE TABLE product (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    category TEXT CHECK(category IN ('Vegetable','Fruit','Grain')),
    price_per_kg REAL NOT NULL CHECK(price_per_kg >= 0),
    available_quantity REAL NOT NULL CHECK(available_quantity >= 0),
    FOREIGN KEY(farmer_id) REFERENCES farmer(farmer_id)
);

-- Order
CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    order_date TEXT NOT NULL,
    total_amount REAL NOT NULL,
    order_status TEXT NOT NULL DEFAULT 'Placed',
    FOREIGN KEY(customer_id) REFERENCES customer(customer_id)
);

-- Order details
CREATE TABLE order_details (
    order_detail_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity REAL NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(order_id),
    FOREIGN KEY(product_id) REFERENCES product(product_id)
);

-- Payment
CREATE TABLE payment (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    payment_mode TEXT NOT NULL,
    payment_date TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(order_id)
);
