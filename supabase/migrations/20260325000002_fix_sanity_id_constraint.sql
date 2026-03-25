-- Reemplazar índice parcial por UNIQUE CONSTRAINT completo
-- (los índices parciales no funcionan con ON CONFLICT de PostgREST)

DROP INDEX IF EXISTS idx_products_sanity_id;
ALTER TABLE products ADD CONSTRAINT products_sanity_id_key UNIQUE (sanity_id);
