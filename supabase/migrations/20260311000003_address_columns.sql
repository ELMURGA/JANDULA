-- ============================================
-- Añadir columnas de dirección a profiles
-- Facturación y envío por separado
-- ============================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS billing_first_name TEXT,
  ADD COLUMN IF NOT EXISTS billing_last_name  TEXT,
  ADD COLUMN IF NOT EXISTS billing_company    TEXT,
  ADD COLUMN IF NOT EXISTS billing_apartment  TEXT,
  ADD COLUMN IF NOT EXISTS shipping_first_name TEXT,
  ADD COLUMN IF NOT EXISTS shipping_last_name  TEXT,
  ADD COLUMN IF NOT EXISTS shipping_company    TEXT,
  ADD COLUMN IF NOT EXISTS shipping_street     TEXT,
  ADD COLUMN IF NOT EXISTS shipping_apartment  TEXT,
  ADD COLUMN IF NOT EXISTS shipping_city       TEXT,
  ADD COLUMN IF NOT EXISTS shipping_province   TEXT,
  ADD COLUMN IF NOT EXISTS shipping_postal     TEXT;
