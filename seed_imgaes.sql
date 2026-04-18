SET DEFINE OFF;
UPDATE product SET image_url = 'https://images.unsplash.com/photo-1518977822558-757A3DAF01B6?w=400&q=80' WHERE product_name = 'Onions';
UPDATE product SET image_url = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80' WHERE product_name = 'Tomatoes';
UPDATE product SET image_url = 'https://images.unsplash.com/photo-1596368708356-6e1e1025ee72?w=400&q=80' WHERE product_name = 'Grapes';
UPDATE product SET image_url = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80' WHERE product_name = 'Wheat (Lokwan)';
UPDATE product SET image_url = 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=400&q=80' WHERE product_name = 'Rice (Basmati)';
COMMIT;
EXIT;
