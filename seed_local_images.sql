CONNECT C##FARMER/farmer123;
UPDATE product SET image_url = 'onions.jpg' WHERE product_name = 'Onions';
UPDATE product SET image_url = 'tomatoes.jpg' WHERE product_name = 'Tomatoes';
UPDATE product SET image_url = 'grapes.jpg' WHERE product_name = 'Grapes';
UPDATE product SET image_url = 'wheat.jpg' WHERE product_name = 'Wheat (Lokwan)';
UPDATE product SET image_url = 'rice.jpg' WHERE product_name = 'Rice (Basmati)';
COMMIT;
EXIT;
