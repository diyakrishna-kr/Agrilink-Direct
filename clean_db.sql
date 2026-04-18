CONNECT C##FARMER/farmer123;

-- Delete from child tables first to avoid constraint violations
DELETE FROM order_details;
DELETE FROM payment;
DELETE FROM orders;
DELETE FROM product;
DELETE FROM farmer;
-- Note: customer could also be cleared if needed, but the seed script focuses on products and farmers.

COMMIT;
EXIT;
