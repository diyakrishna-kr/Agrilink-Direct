CONNECT C##FARMER/farmer123;

-- Differentiate Dairy
UPDATE product SET image_url = 'milk_a2.jpg' WHERE product_name = 'A2 Cow Milk (per L)';
UPDATE product SET image_url = 'milk_buffalo.jpg' WHERE product_name = 'Buffalo Milk (per L)';
UPDATE product SET image_url = 'ghee_pure.jpg' WHERE product_name = 'Pure Cow Ghee';
UPDATE product SET image_url = 'butter_homemade.jpg' WHERE product_name = 'Homemade Butter';
UPDATE product SET image_url = 'paneer_fresh.jpg' WHERE product_name = 'Fresh Paneer';

-- Differentiate Pulses/Grains
UPDATE product SET image_url = 'dal_yellow.jpg' WHERE product_name = 'Yellow Dal (Moong)';
UPDATE product SET image_url = 'dal_red.jpg' WHERE product_name = 'Red Lentils (Masoor)';
UPDATE product SET image_url = 'chana.jpg' WHERE product_name = 'Chickpeas (Chana)';
UPDATE product SET image_url = 'groundnuts.jpg' WHERE product_name = 'Groundnuts';

COMMIT;
EXIT;
