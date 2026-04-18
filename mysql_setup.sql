CREATE DATABASE IF NOT EXISTS farmercustomer;
USE farmercustomer;

-- ==========================================
-- DDL: TABLE CREATION
-- ==========================================
CREATE TABLE IF NOT EXISTS farmer (
    farmer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(255),
    bank_details VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    address VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    category ENUM('Vegetable', 'Fruit', 'Grain') NOT NULL,
    price_per_kg DECIMAL(10,2) NOT NULL,
    available_quantity DECIMAL(10,2) NOT NULL,
    FOREIGN KEY(farmer_id) REFERENCES farmer(farmer_id),
    CHECK (price_per_kg >= 0),
    CHECK (available_quantity >= 0)
);

CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    order_status VARCHAR(50) NOT NULL DEFAULT 'Placed',
    FOREIGN KEY(customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE IF NOT EXISTS order_details (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(order_id),
    FOREIGN KEY(product_id) REFERENCES product(product_id)
);

CREATE TABLE IF NOT EXISTS payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_mode VARCHAR(50) NOT NULL,
    payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(50) NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(order_id)
);

-- ==========================================
-- TRIGGERS
-- ==========================================
DELIMITER //

CREATE TRIGGER prevent_negative_price
BEFORE INSERT ON product
FOR EACH ROW
BEGIN
    IF NEW.price_per_kg <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Price per kg must be greater than zero.';
    END IF;
END //

CREATE TRIGGER update_stock_after_order
AFTER INSERT ON order_details
FOR EACH ROW
BEGIN
    UPDATE product
    SET available_quantity = available_quantity - NEW.quantity
    WHERE product_id = NEW.product_id;
END //

-- ==========================================
-- STORED PROCEDURES
-- ==========================================
CREATE PROCEDURE place_order_transaction (
    IN p_customer_id INT,
    IN p_product_id INT,
    IN p_quantity DECIMAL(10,2),
    IN p_payment_mode VARCHAR(50)
)
BEGIN
    DECLARE product_price DECIMAL(10,2);
    DECLARE total DECIMAL(10,2);
    DECLARE new_order_id INT;

    -- Exit handling for rollback
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT price_per_kg INTO product_price FROM product WHERE product_id = p_product_id;
    SET total = product_price * p_quantity;

    -- Insert order
    INSERT INTO orders (customer_id, total_amount, order_status) 
    VALUES (p_customer_id, total, 'Placed');
    
    SET new_order_id = LAST_INSERT_ID();

    -- Insert order details
    INSERT INTO order_details (order_id, product_id, quantity, price) 
    VALUES (new_order_id, p_product_id, p_quantity, product_price);

    -- Insert payment
    INSERT INTO payment (order_id, payment_mode, payment_status)
    VALUES (new_order_id, p_payment_mode, 'Success');

    COMMIT;
END //

DELIMITER ;

-- ==========================================
-- SEED DATA
-- ==========================================
INSERT IGNORE INTO farmer (farmer_id, name, phone, location, bank_details) VALUES 
(1, 'Rajesh Kumar', '9876543210', 'Pune, Maharashtra', 'SBI 123456789'),
(2, 'Anita Patel', '8765432109', 'Nashik, Maharashtra', 'HDFC 987654321'),
(3, 'Suresh Singh', '7654321098', 'Ludhiana, Punjab', 'ICICI 456123789');

INSERT IGNORE INTO customer (customer_id, name, email, phone, address) VALUES 
(1, 'Ravi Sharma', 'ravi.sharma@example.com', '9988776655', 'Mumbai, Maharashtra'),
(2, 'Priya Desai', 'priya.desai@example.com', '8877665544', 'Pune, Maharashtra');

INSERT IGNORE INTO product (product_id, farmer_id, product_name, category, price_per_kg, available_quantity) VALUES 
(1, 1, 'Onions', 'Vegetable', 40.0, 500.0),
(2, 1, 'Tomatoes', 'Vegetable', 30.0, 200.0),
(3, 2, 'Grapes', 'Fruit', 80.0, 150.0),
(4, 3, 'Wheat (Lokwan)', 'Grain', 35.0, 1000.0),
(5, 3, 'Rice (Basmati)', 'Grain', 90.0, 400.0);
