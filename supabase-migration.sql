-- ============================================
-- JÁNDULA MODA — Database Schema
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. TABLA PRODUCTS (catálogo con stock)
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT NOT NULL,
  subcategory TEXT,
  tags TEXT[] DEFAULT '{}',
  image TEXT,
  description TEXT,
  sizes TEXT[] DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TABLA PROFILES (extiende auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  address_line TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger para crear perfil al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 3. TABLA ORDERS (pedidos)
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pendiente'
    CHECK (status IN ('pendiente','confirmado','enviado','entregado','cancelado')),
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  shipping_name TEXT,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_postal TEXT,
  shipping_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TABLA ORDER_ITEMS (líneas de pedido)
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_image TEXT,
  size TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Products: lectura pública
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON products
  FOR SELECT USING (true);
CREATE POLICY "Admin manages products" ON products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Profiles: usuario ve su propio perfil
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin reads all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Orders: usuario ve sus pedidos, admin ve todos
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin manages all orders" ON orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Order items: acceso via pedido
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );
CREATE POLICY "Admin reads all order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- FUNCIÓN TRANSACCIONAL: PROCESAR PEDIDO
-- ============================================

CREATE OR REPLACE FUNCTION process_order(
  p_items JSONB,
  p_shipping_info JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_order_id INTEGER;
  v_item JSONB;
  v_product RECORD;
  v_subtotal DECIMAL := 0;
  v_shipping DECIMAL;
  v_total DECIMAL;
  v_line_total DECIMAL;
BEGIN
  -- Obtener usuario autenticado
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;

  -- 1. Verificar stock con bloqueo pesimista (FOR UPDATE)
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    SELECT id, name, price, image, stock
    INTO v_product
    FROM products
    WHERE id = (v_item->>'product_id')::INTEGER
      AND is_active = true
    FOR UPDATE;

    IF v_product IS NULL THEN
      RAISE EXCEPTION 'Producto no encontrado (ID: %)', v_item->>'product_id';
    END IF;

    IF v_product.stock < (v_item->>'quantity')::INTEGER THEN
      RAISE EXCEPTION 'Stock insuficiente para "%". Disponible: %, solicitado: %',
        v_product.name, v_product.stock, (v_item->>'quantity')::INTEGER;
    END IF;

    v_subtotal := v_subtotal + (v_product.price * (v_item->>'quantity')::INTEGER);
  END LOOP;

  -- 2. Calcular totales
  v_shipping := CASE WHEN v_subtotal >= 50 THEN 0 ELSE 3.99 END;
  v_total := v_subtotal + v_shipping;

  -- 3. Crear pedido
  INSERT INTO orders (user_id, subtotal, shipping, total,
    shipping_name, shipping_address, shipping_city, shipping_postal, shipping_phone, notes)
  VALUES (
    v_user_id, v_subtotal, v_shipping, v_total,
    p_shipping_info->>'name',
    p_shipping_info->>'address',
    p_shipping_info->>'city',
    p_shipping_info->>'postal',
    p_shipping_info->>'phone',
    p_shipping_info->>'notes'
  )
  RETURNING id INTO v_order_id;

  -- 4. Crear líneas del pedido + RESTAR STOCK
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    SELECT id, name, price, image INTO v_product
    FROM products WHERE id = (v_item->>'product_id')::INTEGER;

    v_line_total := v_product.price * (v_item->>'quantity')::INTEGER;

    INSERT INTO order_items (order_id, product_id, product_name, product_image,
      size, quantity, unit_price, total_price)
    VALUES (
      v_order_id, v_product.id, v_product.name, v_product.image,
      v_item->>'size', (v_item->>'quantity')::INTEGER,
      v_product.price, v_line_total
    );

    UPDATE products
    SET stock = stock - (v_item->>'quantity')::INTEGER
    WHERE id = v_product.id;
  END LOOP;

  -- 5. Devolver resultado
  RETURN jsonb_build_object(
    'order_id', v_order_id,
    'subtotal', v_subtotal,
    'shipping', v_shipping,
    'total', v_total,
    'status', 'pendiente'
  );
END;
$$;

-- ============================================
-- FUNCIÓN: ACTUALIZAR ESTADO DE PEDIDO (ADMIN)
-- ============================================

CREATE OR REPLACE FUNCTION update_order_status(
  p_order_id INTEGER,
  p_new_status TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_role TEXT;
BEGIN
  SELECT role INTO v_user_role FROM profiles WHERE id = auth.uid();
  IF v_user_role != 'admin' THEN
    RAISE EXCEPTION 'Acceso denegado: se requiere rol admin';
  END IF;

  UPDATE orders
  SET status = p_new_status, updated_at = now()
  WHERE id = p_order_id;

  RETURN jsonb_build_object('success', true, 'order_id', p_order_id, 'status', p_new_status);
END;
$$;
