-- ============================================================
-- FIX: Política RLS para que usuarios puedan actualizar
--      y leer su propio perfil desde la cuenta
-- ============================================================

-- Leer perfil propio
DROP POLICY IF EXISTS "Users read own profile" ON profiles;
CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Actualizar perfil propio
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
