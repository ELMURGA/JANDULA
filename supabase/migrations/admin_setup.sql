-- ================================================================
-- JÁNDULA — Gestión de usuarios administradores
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ================================================================

-- 1. VER SI YA EXISTE UN ADMIN
-- ────────────────────────────
SELECT
    p.id,
    a.email,
    p.full_name,
    p.role
FROM profiles p
JOIN auth.users a ON a.id = p.id
WHERE p.role = 'admin';

-- Si ves resultados, usa ese email para entrar en /admin


-- ================================================================
-- 2. PROMOVER UN USUARIO A ADMIN
--    (ejecutar solo si no hay ningún admin o quieres cambiar)
-- ================================================================
-- Email de pruebas actual:
-- designerazenty@gmail.com

-- A) Comprobar que el usuario existe en auth.users
SELECT id, email
FROM auth.users
WHERE lower(email) = lower('designerazenty@gmail.com');

-- B) Crear perfil si faltase (solo se inserta si no existe)
INSERT INTO profiles (id, email, full_name, role)
SELECT u.id, u.email, COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)), 'customer'
FROM auth.users u
WHERE lower(u.email) = lower('designerazenty@gmail.com')
    AND NOT EXISTS (
        SELECT 1 FROM profiles p WHERE p.id = u.id
    );

-- C) Promover a admin
UPDATE profiles
SET role = 'admin'
WHERE id = (
        SELECT id FROM auth.users WHERE lower(email) = lower('designerazenty@gmail.com')
)
RETURNING id, email, role;

-- Verificar que se guardó:
SELECT p.id, a.email, p.role
FROM profiles p JOIN auth.users a ON a.id = p.id
WHERE p.role = 'admin';


-- ================================================================
-- 3. CAMBIAR CONTRASEÑA DE UN USUARIO (desde SQL, usando Auth API)
--    Alternativa si no recuerdas la contraseña:
--    → ve a Supabase Dashboard > Authentication > Users
--    → encuentra el usuario → "Send password reset"  
--    O usa "¿Olvidaste tu contraseña?" en la web que ya funciona.
-- ================================================================
