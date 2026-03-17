-- ============================================
-- FIX: La policy INSERT en profiles bloqueaba
-- el trigger handle_new_user() porque durante
-- la ejecución del trigger auth.uid() = NULL.
-- ============================================

-- Eliminar la policy que bloqueaba el trigger
DROP POLICY IF EXISTS "Service role insert profiles" ON profiles;

-- Recrear la función con search_path explícito
-- para evitar problemas de resolución de esquema
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
