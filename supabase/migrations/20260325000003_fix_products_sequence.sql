-- Avanzar la secuencia del id de products al valor máximo actual + 1
-- Necesario porque los productos fueron importados con ids explícitos
-- sin avanzar la secuencia automáticamente.
SELECT setval(
  pg_get_serial_sequence('products', 'id'),
  COALESCE((SELECT MAX(id) FROM products), 0) + 1,
  false
);
