-- ============================================================
-- JÁNDULA MODA — Integración Stripe + Sistema de Descuentos
-- Ejecutar en Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Añadir columnas Stripe a la tabla orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_session_id       TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_intent   TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_code           TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount         DECIMAL(10,2) DEFAULT 0;

-- 2. TABLA DISCOUNTS (códigos de descuento)
CREATE TABLE IF NOT EXISTS discounts (
  id           SERIAL PRIMARY KEY,
  code         TEXT UNIQUE NOT NULL,
  type         TEXT NOT NULL CHECK (type IN ('percentage', 'fixed', 'free_shipping')),
  value        DECIMAL(10,2) NOT NULL DEFAULT 0,
  min_order    DECIMAL(10,2) DEFAULT 0,
  max_uses     INTEGER DEFAULT NULL,
  used_count   INTEGER DEFAULT 0,
  is_active    BOOLEAN DEFAULT true,
  expires_at   TIMESTAMPTZ DEFAULT NULL,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- 3. TABLA DISCOUNT_USAGES (historial de usos por usuario)
CREATE TABLE IF NOT EXISTS discount_usages (
  id           SERIAL PRIMARY KEY,
  discount_id  INTEGER NOT NULL REFERENCES discounts(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id),
  order_id     INTEGER REFERENCES orders(id),
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(discount_id, user_id)   -- cada usuario solo puede usar cada código una vez
);

-- 4. RLS — Descuentos (lectura pública de activos, gestión solo admin)
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active discounts" ON discounts
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin manages discounts" ON discounts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

ALTER TABLE discount_usages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own usages" ON discount_usages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin reads all usages" ON discount_usages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 5. FUNCIÓN: process_order_server_side
--    Versión del RPC para el webhook de Stripe.
--    Recibe p_user_id directamente (sin auth.uid()) y opera
--    con SECURITY DEFINER y service_role desde la Edge Function.
--    El carrito se transmite como JSONB con { id (int), quantity, size }.

CREATE OR REPLACE FUNCTION process_order_server_side(
  p_user_id              UUID,
  p_items                JSONB,
  p_shipping_info        JSONB,
  p_stripe_session_id    TEXT    DEFAULT NULL,
  p_stripe_payment_intent TEXT   DEFAULT NULL,
  p_discount_code        TEXT    DEFAULT NULL,
  p_discount_amount      DECIMAL DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id   INTEGER;
  v_item       JSONB;
  v_product    RECORD;
  v_subtotal   DECIMAL := 0;
  v_shipping   DECIMAL;
  v_total      DECIMAL;
  v_line_total DECIMAL;
  v_items_info JSONB := '[]'::JSONB;
BEGIN
  -- Validación básica
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'user_id es requerido';
  END IF;

  IF jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'El carrito está vacío';
  END IF;

  -- 1. Verificar stock con bloqueo pesimista (FOR UPDATE)
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    SELECT id, name, price, image, stock
    INTO v_product
    FROM products
    WHERE id = (v_item->>'id')::INTEGER
      AND is_active = true
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Producto no encontrado (ID: %)', v_item->>'id';
    END IF;

    IF v_product.stock < (v_item->>'quantity')::INTEGER THEN
      RAISE EXCEPTION 'Stock insuficiente para "%". Disponible: %, solicitado: %',
        v_product.name, v_product.stock, (v_item->>'quantity')::INTEGER;
    END IF;

    v_subtotal := v_subtotal + (v_product.price * (v_item->>'quantity')::INTEGER);
  END LOOP;

  -- 2. Calcular envío y total
  v_shipping := CASE WHEN v_subtotal >= 50 THEN 0.00 ELSE 3.99 END;
  v_total    := GREATEST(0, v_subtotal + v_shipping - COALESCE(p_discount_amount, 0));

  -- 3. Crear pedido con estado 'confirmado' (el pago ya se realizó en Stripe)
  INSERT INTO orders (
    user_id, status, subtotal, shipping, total,
    shipping_name, shipping_address, shipping_city, shipping_postal, shipping_phone, notes,
    stripe_session_id, stripe_payment_intent,
    discount_code, discount_amount
  )
  VALUES (
    p_user_id, 'confirmado', v_subtotal, v_shipping, v_total,
    p_shipping_info->>'name',
    p_shipping_info->>'address',
    p_shipping_info->>'city',
    p_shipping_info->>'postal',
    p_shipping_info->>'phone',
    p_shipping_info->>'notes',
    p_stripe_session_id, p_stripe_payment_intent,
    p_discount_code, COALESCE(p_discount_amount, 0)
  )
  RETURNING id INTO v_order_id;

  -- 4. Crear líneas de pedido + RESTAR STOCK
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    SELECT id, name, price, image INTO v_product
    FROM products WHERE id = (v_item->>'id')::INTEGER;

    v_line_total := v_product.price * (v_item->>'quantity')::INTEGER;

    INSERT INTO order_items (
      order_id, product_id, product_name, product_image,
      size, quantity, unit_price, total_price
    )
    VALUES (
      v_order_id, v_product.id, v_product.name, v_product.image,
      NULLIF(v_item->>'size', 'null'),
      (v_item->>'quantity')::INTEGER,
      v_product.price,
      v_line_total
    );

    UPDATE products
    SET stock = stock - (v_item->>'quantity')::INTEGER
    WHERE id = v_product.id;

    -- Acumular info de items para el email
    v_items_info := v_items_info || jsonb_build_array(jsonb_build_object(
      'name',     v_product.name,
      'quantity', (v_item->>'quantity')::INTEGER,
      'price',    v_product.price,
      'size',     NULLIF(v_item->>'size', 'null'),
      'image',    v_product.image
    ));
  END LOOP;

  -- 5. Registrar uso del descuento si se aplicó uno
  IF p_discount_code IS NOT NULL AND p_discount_code != '' THEN
    INSERT INTO discount_usages (discount_id, user_id, order_id)
    SELECT id, p_user_id, v_order_id
    FROM discounts
    WHERE code = upper(p_discount_code)
    ON CONFLICT (discount_id, user_id) DO NOTHING;

    UPDATE discounts
    SET used_count = used_count + 1
    WHERE code = upper(p_discount_code);
  END IF;

  -- 6. Devolver resultado completo
  RETURN jsonb_build_object(
    'order_id',   v_order_id,
    'subtotal',   v_subtotal,
    'shipping',   v_shipping,
    'discount',   COALESCE(p_discount_amount, 0),
    'total',      v_total,
    'items',      v_items_info,
    'status',     'confirmado'
  );
END;
$$;

-- 6. Códigos de descuento de muestra (personalizables en Dashboard)
INSERT INTO discounts (code, type, value, min_order, is_active) VALUES
  ('BIENVENIDA10', 'percentage',    10, 0,  true),
  ('ENVIOGRATIS',  'free_shipping',  0, 30, true),
  ('VERANO15',     'percentage',    15, 50, true)
ON CONFLICT (code) DO NOTHING;
