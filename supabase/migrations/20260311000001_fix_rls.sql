-- ============================================
-- FIX: Recursión infinita en políticas RLS
-- Las políticas que hacen SELECT en profiles
-- desde dentro de profiles causan recursión.
-- Solución: función SECURITY DEFINER que
-- bypasea RLS al consultar profiles.
-- ============================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Recrear políticas de products
DROP POLICY IF EXISTS "Admin manages products" ON products;
CREATE POLICY "Admin manages products" ON products
  FOR ALL USING (is_admin());

-- Recrear política admin de profiles
DROP POLICY IF EXISTS "Admin reads all profiles" ON profiles;
CREATE POLICY "Admin reads all profiles" ON profiles
  FOR SELECT USING (is_admin());

-- Inserción de perfiles la hace el trigger (SECURITY DEFINER), no el usuario
DROP POLICY IF EXISTS "Service role insert profiles" ON profiles;
CREATE POLICY "Service role insert profiles" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id OR is_admin());

-- Recrear políticas de orders
DROP POLICY IF EXISTS "Admin manages all orders" ON orders;
CREATE POLICY "Admin manages all orders" ON orders
  FOR ALL USING (is_admin());

-- Recrear políticas de order_items
DROP POLICY IF EXISTS "Admin reads all order items" ON order_items;
CREATE POLICY "Admin reads all order items" ON order_items
  FOR SELECT USING (is_admin());

-- Permitir al admin insertrar/actualizar order_items
DROP POLICY IF EXISTS "Admin manages order items" ON order_items;
CREATE POLICY "Admin manages order items" ON order_items
  FOR ALL USING (is_admin());
