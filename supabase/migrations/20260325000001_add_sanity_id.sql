-- ============================================================
-- Añadir columna sanity_id a products para que cualquier
-- producto creado en Sanity (con _id aleatorio) se sincronice
-- correctamente en Supabase y se pueda comprar.
-- ============================================================

-- 1. Añadir columna sanity_id (identificador de Sanity)
ALTER TABLE products ADD COLUMN IF NOT EXISTS sanity_id TEXT;

-- 2. Rellenar productos existentes que fueron importados con el
--    patrón antiguo "product-{id}" → backfill de sanity_id
UPDATE products
SET sanity_id = 'product-' || id::TEXT
WHERE sanity_id IS NULL;

-- 3. Índice único para que el upsert en sync-products funcione
--    sin colisiones y permita cualquier formato de _id de Sanity
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sanity_id
  ON products (sanity_id)
  WHERE sanity_id IS NOT NULL;
