-- Connect as the application user
CONNECT C##FARMER/farmer123;

SET DEFINE OFF;

-- Clear existing data to prevent duplicates when re-running
DELETE FROM product;
DELETE FROM farmer;
COMMIT;

-- Alter product table to allow more categories (Plsql block is safer)
BEGIN
    FOR r IN (SELECT constraint_name FROM all_constraints WHERE table_name = 'PRODUCT' AND owner = 'C##FARMER' AND constraint_type = 'C' AND search_condition_vc LIKE '%category%') LOOP
        EXECUTE IMMEDIATE 'ALTER TABLE product DROP CONSTRAINT ' || r.constraint_name;
    END LOOP;
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

ALTER TABLE product ADD CONSTRAINT chk_category CHECK (category IN ('Vegetable', 'Fruit', 'Grain', 'Spice', 'Dairy'));

-- Insert 10 Realistic Farmers
INSERT INTO farmer (name, phone, password_hash, location, bank_details) VALUES ('Anoop Nair', '9876500001', '$2a$10$wT.fA.PZ33XqE63zMpwC.O5K/N6yR7eU9i0A/O6v28a1pM3l2g/2O', 'Ahmedabad', 'SBI-1111');
INSERT INTO farmer (name, phone, password_hash, location, bank_details) VALUES ('Biju Varghese', '9876500002', '$2a$10$wT.fA.PZ33XqE63zMpwC.O5K/N6yR7eU9i0A/O6v28a1pM3l2g/2O', 'Surat', 'HDFC-2222');
INSERT INTO farmer (name, phone, password_hash, location, bank_details) VALUES ('Cyril Mathew', '9876500003', '$2a$10$wT.fA.PZ33XqE63zMpwC.O5K/N6yR7eU9i0A/O6v28a1pM3l2g/2O', 'Valsad', 'ICICI-3333');
INSERT INTO farmer (name, phone, password_hash, location, bank_details) VALUES ('Deepu Joseph', '9876500004', '$2a$10$wT.fA.PZ33XqE63zMpwC.O5K/N6yR7eU9i0A/O6v28a1pM3l2g/2O', 'Amritsar', 'PNB-4444');
INSERT INTO farmer (name, phone, password_hash, location, bank_details) VALUES ('Ebin Thomas', '9876500005', '$2a$10$wT.fA.PZ33XqE63zMpwC.O5K/N6yR7eU9i0A/O6v28a1pM3l2g/2O', 'Vijayawada', 'AXIS-5555');
INSERT INTO farmer (name, phone, password_hash, location, bank_details) VALUES ('Faisal Rahman', '9876500006', '$2a$10$wT.fA.PZ33XqE63zMpwC.O5K/N6yR7eU9i0A/O6v28a1pM3l2g/2O', 'Srinagar', 'J&K-6666');
INSERT INTO farmer (name, phone, password_hash, location, bank_details) VALUES ('Gokul Krishnan', '9876500007', '$2a$10$wT.fA.PZ33XqE63zMpwC.O5K/N6yR7eU9i0A/O6v28a1pM3l2g/2O', 'Shimla', 'BOB-7777');
INSERT INTO farmer (name, phone, password_hash, location, bank_details) VALUES ('Hari Narayanan', '9876500008', '$2a$10$wT.fA.PZ33XqE63zMpwC.O5K/N6yR7eU9i0A/O6v28a1pM3l2g/2O', 'Munnar', 'SBI-8888');
INSERT INTO farmer (name, phone, password_hash, location, bank_details) VALUES ('Irfan Basheer', '9876500009', '$2a$10$wT.fA.PZ33XqE63zMpwC.O5K/N6yR7eU9i0A/O6v28a1pM3l2g/2O', 'Madurai', 'IOB-9999');
INSERT INTO farmer (name, phone, password_hash, location, bank_details) VALUES ('Jomon Chacko', '9876500010', '$2a$10$wT.fA.PZ33XqE63zMpwC.O5K/N6yR7eU9i0A/O6v28a1pM3l2g/2O', 'Rajkot', 'HDFC-0000');

-- Products
-- Vegetables
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Anoop Nair'), 'Potatoes (Desi)', 'Vegetable', 28, 1500, TRUNC(SYSDATE) + 30);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Biju Varghese'), 'Green Cabbage', 'Vegetable', 32, 800, TRUNC(SYSDATE) + 7);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Cyril Mathew'), 'Cauliflower', 'Vegetable', 48, 500, TRUNC(SYSDATE) + 5);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Anoop Nair'), 'Carrots', 'Vegetable', 38, 600, TRUNC(SYSDATE) + 10);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Biju Varghese'), 'Spinach (Palak)', 'Vegetable', 22, 200, TRUNC(SYSDATE) + 1);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Cyril Mathew'), 'Eggplant (Brinjal)', 'Vegetable', 42, 450, TRUNC(SYSDATE) + 4);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Anoop Nair'), 'Garlic', 'Vegetable', 180, 100, TRUNC(SYSDATE) + 90);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Biju Varghese'), 'Green Chilies', 'Vegetable', 90, 300, TRUNC(SYSDATE) + 5);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Cyril Mathew'), 'Bell Pepper (Capsicum)', 'Vegetable', 85, 250, TRUNC(SYSDATE) + 7);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Anoop Nair'), 'Lady Finger (Bhindi)', 'Vegetable', 50, 350, TRUNC(SYSDATE) + 3);

-- Fruits
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Gokul Krishnan'), 'Himachal Apples', 'Fruit', 160, 800, TRUNC(SYSDATE) + 20);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Biju Varghese'), 'Kesar Mango', 'Fruit', 180, 500, TRUNC(SYSDATE) + 3);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Faisal Rahman'), 'Cherries', 'Fruit', 420, 50, TRUNC(SYSDATE) + 4);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Gokul Krishnan'), 'Peaches', 'Fruit', 190, 100, TRUNC(SYSDATE) + 5);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Irfan Basheer'), 'Papaya', 'Fruit', 45, 600, TRUNC(SYSDATE) + 2);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Cyril Mathew'), 'Pomegranates', 'Fruit', 170, 450, TRUNC(SYSDATE) + 15);

-- Grains & Pulses
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Deepu Joseph'), 'Premium Sharbati Wheat', 'Grain', 42, 5000, TRUNC(SYSDATE) + 180);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Ebin Thomas'), 'Sona Masoori Rice', 'Grain', 72, 3000, TRUNC(SYSDATE) + 240);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Deepu Joseph'), 'Pearl Millet (Bajra)', 'Grain', 38, 1000, TRUNC(SYSDATE) + 180);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Ebin Thomas'), 'Sorghum (Jowar)', 'Grain', 42, 800, TRUNC(SYSDATE) + 180);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Deepu Joseph'), 'Yellow Dal (Moong)', 'Grain', 125, 500, TRUNC(SYSDATE) + 240);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Deepu Joseph'), 'Black Gram (Urad)', 'Grain', 135, 400, TRUNC(SYSDATE) + 240);

-- Spices
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Hari Narayanan'), 'Black Pepper', 'Spice', 720, 100, TRUNC(SYSDATE) + 365);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Hari Narayanan'), 'Cardamom', 'Spice', 2200, 50, TRUNC(SYSDATE) + 365);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Hari Narayanan'), 'Cloves', 'Spice', 900, 75, TRUNC(SYSDATE) + 365);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Hari Narayanan'), 'Cinnamon', 'Spice', 520, 150, TRUNC(SYSDATE) + 365);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Hari Narayanan'), 'Nutmeg', 'Spice', 1300, 40, TRUNC(SYSDATE) + 365);

-- Dairy
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Jomon Chacko'), 'Milk', 'Dairy', 70, 100, TRUNC(SYSDATE) + 1);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Jomon Chacko'), 'Pure Cow Ghee', 'Dairy', 780, 40, TRUNC(SYSDATE) + 180);
INSERT INTO product (farmer_id, product_name, category, price_per_kg, available_quantity, expiry_date) VALUES ((SELECT max(farmer_id) FROM farmer WHERE name='Deepu Joseph'), 'Homemade Butter', 'Dairy', 480, 25, TRUNC(SYSDATE) + 20);

COMMIT;
EXIT;
