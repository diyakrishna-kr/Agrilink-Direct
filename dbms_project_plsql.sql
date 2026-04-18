-- ==========================================
-- DBMS Micro Project: Farmer-Customer Portal
-- SQL Queries and PL/SQL Scripts (Oracle Syntax)
-- ==========================================

-- 1. BASIC TO ADVANCED QUERIES
-- ==========================================

-- A. Simple Select with Ordering
-- Retrieve all products available with their prices sorted ascending.
SELECT product_name, category, price_per_kg, available_quantity 
FROM product 
ORDER BY price_per_kg ASC;

-- B. Join Query
-- Get details of orders including customer name, order date, and total amount.
SELECT c.name AS Customer_Name, o.order_id, o.order_date, o.total_amount, o.order_status
FROM orders o
JOIN customer c ON o.customer_id = c.customer_id;

-- C. Aggregate Query with Group By
-- Find the total number of products available for each category.
SELECT category, COUNT(product_id) as Number_Of_Products, SUM(available_quantity) as Total_Stock
FROM product
GROUP BY category;

-- D. Subquery
-- Find farmers who have uploaded products with a price greater than 50/kg.
SELECT name, location 
FROM farmer
WHERE farmer_id IN (
    SELECT farmer_id FROM product WHERE price_per_kg > 50
);


-- 2. VIEWS
-- ==========================================
-- Create a view to easily see the full details of an order including the customer and payment status.
CREATE OR REPLACE VIEW order_summary_view AS
SELECT 
    o.order_id,
    c.name AS customer_name,
    o.order_date,
    o.total_amount,
    p.payment_mode,
    p.payment_status
FROM orders o
JOIN customer c ON o.customer_id = c.customer_id
JOIN payment p ON o.order_id = p.order_id;


-- 3. PL/SQL: STORED PROCEDURES
-- ==========================================
-- Procedure to add a new farmer and output their new ID
CREATE OR REPLACE PROCEDURE add_farmer(
    p_name IN farmer.name%TYPE,
    p_phone IN farmer.phone%TYPE,
    p_location IN farmer.location%TYPE,
    p_bank IN farmer.bank_details%TYPE,
    p_farmer_id OUT farmer.farmer_id%TYPE
)
IS
BEGIN
    INSERT INTO farmer (name, phone, location, bank_details)
    VALUES (p_name, p_phone, p_location, p_bank)
    RETURNING farmer_id INTO p_farmer_id;
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Farmer added successfully with ID: ' || p_farmer_id);
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error adding farmer: ' || SQLERRM);
        ROLLBACK;
END;
/


-- 4. PL/SQL: FUNCTIONS
-- ==========================================
-- Function to calculate total revenue generated from successful payments
CREATE OR REPLACE FUNCTION get_total_revenue 
RETURN NUMBER 
IS
    v_total NUMBER := 0;
BEGIN
    SELECT NVL(SUM(o.total_amount), 0)
    INTO v_total
    FROM orders o
    JOIN payment p ON o.order_id = p.order_id
    WHERE p.payment_status = 'Success';
    
    RETURN v_total;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 0;
END;
/


-- 5. PL/SQL: TRIGGERS
-- ==========================================
-- Trigger to enforce that product price cannot be zero or negative
CREATE OR REPLACE TRIGGER trg_validate_price
BEFORE INSERT OR UPDATE ON product
FOR EACH ROW
BEGIN
    IF :NEW.price_per_kg <= 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Price per kg must be greater than zero.');
    END IF;
END;
/

-- Trigger to automatically update stock after an order is placed
CREATE OR REPLACE TRIGGER trg_update_stock
AFTER INSERT ON order_details
FOR EACH ROW
BEGIN
    UPDATE product
    SET available_quantity = available_quantity - :NEW.quantity
    WHERE product_id = :NEW.product_id;
END;
/


-- 6. PL/SQL: CURSORS
-- ==========================================
-- Using a Cursor to iterate through all products of a specific farmer and print them
DECLARE
    v_farmer_id NUMBER := 1; -- Example Farmer ID
    CURSOR product_cursor IS
        SELECT product_name, price_per_kg, available_quantity 
        FROM product 
        WHERE farmer_id = v_farmer_id;
    
    v_rec product_cursor%ROWTYPE;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Products for Farmer ID: ' || v_farmer_id);
    DBMS_OUTPUT.PUT_LINE('-----------------------------------');
    OPEN product_cursor;
    LOOP
        FETCH product_cursor INTO v_rec;
        EXIT WHEN product_cursor%NOTFOUND;
        DBMS_OUTPUT.PUT_LINE('Product: ' || v_rec.product_name || ' | Price: ' || v_rec.price_per_kg || ' | Stock: ' || v_rec.available_quantity);
    END LOOP;
    CLOSE product_cursor;
END;
/
