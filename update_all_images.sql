-- Connect as the application user
CONNECT C##FARMER/farmer123;

-- ─────────────────────────────────────────
-- VEGETABLES
-- ─────────────────────────────────────────
UPDATE product SET image_url = 'tomato_red.jpg'       WHERE LOWER(product_name) LIKE '%tomato%';
UPDATE product SET image_url = 'potatoes.jpg'         WHERE LOWER(product_name) LIKE '%potato%';
UPDATE product SET image_url = 'cabbage_green.jpg'    WHERE LOWER(product_name) LIKE '%cabbage%';
UPDATE product SET image_url = 'cauliflower.jpg'      WHERE LOWER(product_name) LIKE '%cauliflower%';
UPDATE product SET image_url = 'carrot_orange.jpg'    WHERE LOWER(product_name) LIKE '%carrot%';
UPDATE product SET image_url = 'capsicum.webp'        WHERE LOWER(product_name) LIKE '%capsicum%' OR LOWER(product_name) LIKE '%bell pepper%';
UPDATE product SET image_url = 'eggplant_brinjal.jpg' WHERE LOWER(product_name) LIKE '%eggplant%' OR LOWER(product_name) LIKE '%brinjal%';
UPDATE product SET image_url = 'spinach.jpg'          WHERE LOWER(product_name) LIKE '%spinach%' OR LOWER(product_name) LIKE '%palak%';
UPDATE product SET image_url = 'garlic.jpg'           WHERE LOWER(product_name) LIKE '%garlic%';
UPDATE product SET image_url = 'green_chilies.jpg'    WHERE LOWER(product_name) LIKE '%chili%' OR LOWER(product_name) LIKE '%chilli%';
UPDATE product SET image_url = 'lady_finger.jpg'      WHERE LOWER(product_name) LIKE '%lady finger%' OR LOWER(product_name) LIKE '%bhindi%' OR LOWER(product_name) LIKE '%okra%';

-- ─────────────────────────────────────────
-- FRUITS
-- ─────────────────────────────────────────
UPDATE product SET image_url = 'apple.jpg'            WHERE LOWER(product_name) LIKE '%apple%';
UPDATE product SET image_url = 'mango.jpg'            WHERE LOWER(product_name) LIKE '%mango%';
UPDATE product SET image_url = 'grapes.jpg'           WHERE LOWER(product_name) LIKE '%grape%';

UPDATE product SET image_url = 'cherries.jpg'         WHERE LOWER(product_name) LIKE '%cherr%';
UPDATE product SET image_url = 'peaches.jpg'          WHERE LOWER(product_name) LIKE '%peach%';
UPDATE product SET image_url = 'papaya.jpg'           WHERE LOWER(product_name) LIKE '%papaya%';
UPDATE product SET image_url = 'pomegranate.jpg'      WHERE LOWER(product_name) LIKE '%pomegranate%';

-- ─────────────────────────────────────────
-- GRAINS & PULSES
-- ─────────────────────────────────────────
UPDATE product SET image_url = 'wheat_lokwan.jpg'     WHERE LOWER(product_name) LIKE '%wheat%';
UPDATE product SET image_url = 'rice.jpg'             WHERE LOWER(product_name) LIKE '%rice%';
UPDATE product SET image_url = 'bajra.jpg'            WHERE LOWER(product_name) LIKE '%bajra%' OR LOWER(product_name) LIKE '%pearl millet%';
UPDATE product SET image_url = 'jowar.jpg'            WHERE LOWER(product_name) LIKE '%jowar%' OR LOWER(product_name) LIKE '%sorghum%';
UPDATE product SET image_url = 'dal_yellow.jpg'       WHERE LOWER(product_name) LIKE '%yellow dal%' OR LOWER(product_name) LIKE '%moong%' OR LOWER(product_name) LIKE '%toor%' OR LOWER(product_name) LIKE '%arhar%';
UPDATE product SET image_url = 'black_gram.jpg'       WHERE LOWER(product_name) LIKE '%black gram%' OR LOWER(product_name) LIKE '%urad%';

-- ─────────────────────────────────────────
-- SPICES
-- ─────────────────────────────────────────
UPDATE product SET image_url = 'pepper.jpg'           WHERE LOWER(product_name) LIKE '%black pepper%';
UPDATE product SET image_url = 'cardamom.jpg'         WHERE LOWER(product_name) LIKE '%cardamom%';
UPDATE product SET image_url = 'cinnamon.jpg'         WHERE LOWER(product_name) LIKE '%cinnamon%' OR LOWER(product_name) LIKE '%dalchini%';
UPDATE product SET image_url = 'cloves.jpg'           WHERE LOWER(product_name) LIKE '%clove%';
UPDATE product SET image_url = 'nutmeg.jpg'           WHERE LOWER(product_name) LIKE '%nutmeg%';

-- ─────────────────────────────────────────
-- DAIRY
-- ─────────────────────────────────────────
UPDATE product SET image_url = 'milk_a2.jpg'          WHERE LOWER(product_name) LIKE '%a2%';
UPDATE product SET image_url = 'milk_cow.jpg'         WHERE LOWER(product_name) LIKE '%cow milk%' OR LOWER(product_name) LIKE '%cow%';
UPDATE product SET image_url = 'ghee.jpg'             WHERE LOWER(product_name) LIKE '%ghee%';
UPDATE product SET image_url = 'Butter.webp'          WHERE LOWER(product_name) LIKE '%butter%';
UPDATE product SET image_url = 'paneer_fresh.jpg'     WHERE LOWER(product_name) LIKE '%paneer%';

COMMIT;
EXIT;
