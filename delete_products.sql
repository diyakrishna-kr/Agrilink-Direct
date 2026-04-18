CONNECT C##FARMER/farmer123;

-- Previous removals
DELETE FROM product WHERE LOWER(product_name) LIKE '%chickpea%' OR LOWER(product_name) LIKE '%chana%';
DELETE FROM product WHERE LOWER(product_name) LIKE '%red lentil%' OR LOWER(product_name) LIKE '%masoor%';
DELETE FROM product WHERE LOWER(product_name) LIKE '%buffalo%';

-- New removals
DELETE FROM product WHERE LOWER(product_name) = 'fresh paneer';
DELETE FROM product WHERE LOWER(product_name) = 'kashmiri apples';
DELETE FROM product WHERE LOWER(product_name) = 'alphonso mango';

COMMIT;
EXIT;
