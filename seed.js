const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'farmercustomer.db'));

const seedSql = `
BEGIN TRANSACTION;

-- Insert Farmers
INSERT INTO farmer (name, phone, location, bank_details) VALUES 
('Rajesh Kumar', '9876543210', 'Pune, Maharashtra', 'SBI 123456789'),
('Anita Patel', '8765432109', 'Nashik, Maharashtra', 'HDFC 987654321'),
('Suresh Singh', '7654321098', 'Ludhiana, Punjab', 'ICICI 456123789');

-- Insert Customers
INSERT INTO customer (name, email, phone, address) VALUES 
('Ravi Sharma', 'ravi.sharma@example.com', '9988776655', 'Mumbai, Maharashtra'),
('Priya Desai', 'priya.desai@example.com', '8877665544', 'Pune, Maharashtra');

-- Insert Products
-- Assume Rajesh is id 1, Anita id 2, Suresh id 3
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity) VALUES 
(1, 'Onions', 'Vegetable', 40.0, 500.0),
(1, 'Tomatoes', 'Vegetable', 30.0, 200.0),
(2, 'Grapes', 'Fruit', 80.0, 150.0),
(3, 'Wheat (Lokwan)', 'Grain', 35.0, 1000.0),
(3, 'Rice (Basmati)', 'Grain', 90.0, 400.0);

COMMIT;
`;

db.exec(seedSql, (err) => {
  if (err) {
    console.error('Error seeding data:', err);
  } else {
    console.log('Successfully inserted dummy data into farmercustomer.db');
  }
  db.close();
});
