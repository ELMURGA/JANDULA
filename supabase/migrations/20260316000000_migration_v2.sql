-- ============================================
-- JÁNDULA MODA — Migration V2
-- Columnas faltantes, tablas descuento, RPC server-side
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- ── 1. Columnas faltantes en orders ──────────────────────────────────────────
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_intent TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_country TEXT DEFAULT 'España';

-- Índice ÚNICO para idempotencia (no duplicar pedidos por stripe_session_id)
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_stripe_session_id
  ON orders (stripe_session_id) WHERE stripe_session_id IS NOT NULL;

-- ── 2. Tabla de cupones ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS discounts (
  id          SERIAL PRIMARY KEY,
  code        TEXT UNIQUE NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('percentage','fixed','free_shipping')),
  value       DECIMAL(10,2) NOT NULL DEFAULT 0,
  min_order   DECIMAL(10,2) NOT NULL DEFAULT 0,
  max_uses    INTEGER,
  used_count  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── 3. Historial de uso de cupones ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS discount_usages (
  id          SERIAL PRIMARY KEY,
  discount_id INTEGER NOT NULL REFERENCES discounts(id),
  user_id     UUID NOT NULL REFERENCES auth.users(id),
  order_id    INTEGER REFERENCES orders(id),
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(discount_id, user_id)
);

-- ── 4. RPC process_order_server_side ─────────────────────────────────────────
-- Llamada desde stripe-webhook y confirm-order.
-- IDEMPOTENTE: si ya existe pedido con ese stripe_session_id, devuelve el existente.
-- Stock: SELECT … FOR UPDATE (bloqueo pesimista).
-- Registra uso de cupón.

-- Primero eliminar la función existente (los defaults cambiaron y PG no permite
-- cambiar defaults con CREATE OR REPLACE).
DROP FUNCTION IF EXISTS process_order_server_side(UUID, JSONB, JSONB, TEXT, TEXT, TEXT, DECIMAL);

CREATE OR REPLACE FUNCTION process_order_server_side(
  p_user_id               UUID,
  p_items                 JSONB,
  p_shipping_info         JSONB,
  p_stripe_session_id     TEXT,
  p_stripe_payment_intent TEXT DEFAULT NULL,
  p_discount_code         TEXT DEFAULT NULL,
  p_discount_amount       DECIMAL DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id     INTEGER;
  v_item         JSONB;
  v_product      RECORD;
  v_subtotal     DECIMAL := 0;
  v_shipping     DECIMAL;
  v_total        DECIMAL;
  v_line_total   DECIMAL;
  v_existing     RECORD;
  v_items_out    JSONB := '[]'::JSONB;
  v_discount_id  INTEGER;
BEGIN
  -- ── Idempotencia: si ya existe pedido con este stripe_session_id, devolver ──
  IF p_stripe_session_id IS NOT NULL THEN
    SELECT id, subtotal, shipping, discount_amount, total
    INTO v_existing
    FROM orders
    WHERE stripe_session_id = p_stripe_session_id
    LIMIT 1;

    IF v_existing IS NOT NULL THEN
      -- Obtener items del pedido existente para el email
      SELECT jsonb_agg(jsonb_build_object(
        'name', oi.product_name,
        'quantity', oi.quantity,
        'price', oi.unit_price,
        'size', oi.size
      ))
      INTO v_items_out
      FROM order_items oi
      WHERE oi.order_id = v_existing.id;

      RETURN jsonb_build_object(
        'order_id',  v_existing.id,
        'subtotal',  v_existing.subtotal,
        'shipping',  v_existing.shipping,
        'discount',  COALESCE(v_existing.discount_amount, 0),
        'total',     v_existing.total,
        'items',     COALESCE(v_items_out, '[]'::JSONB),
        'already_existed', true
      );
    END IF;
  END IF;

  -- ── 1. Verificar stock con bloqueo pesimista + calcular subtotal ─────────
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    SELECT id, name, price, image, stock
    INTO v_product
    FROM products
    WHERE id = (v_item->>'id')::INTEGER
      AND is_active = true
    FOR UPDATE;

    IF v_product IS NULL THEN
      RAISE EXCEPTION 'Producto no encontrado o inactivo (ID: %)', v_item->>'id';
    END IF;

    IF v_product.stock < (v_item->>'quantity')::INTEGER THEN
      RAISE EXCEPTION 'Stock insuficiente para "%". Disponible: %, solicitado: %',
        v_product.name, v_product.stock, (v_item->>'quantity')::INTEGER;
    END IF;

    v_subtotal := v_subtotal + (v_product.price * (v_item->>'quantity')::INTEGER);
  END LOOP;

  -- ── 2. Calcular totales ──────────────────────────────────────────────────
  v_shipping := CASE WHEN v_subtotal >= 50 THEN 0 ELSE 3.99 END;
  v_total := v_subtotal + v_shipping - COALESCE(p_discount_amount, 0);
  IF v_total < 0 THEN v_total := 0; END IF;

  -- ── 3. Crear pedido ─────────────────────────────────────────────────────
  INSERT INTO orders (
    user_id, subtotal, shipping, total,
    shipping_name, shipping_address, shipping_city,
    shipping_postal, shipping_phone, notes,
    stripe_session_id, stripe_payment_intent,
    discount_code, discount_amount, shipping_country
  )
  VALUES (
    p_user_id, v_subtotal, v_shipping, v_total,
    p_shipping_info->>'name',
    p_shipping_info->>'address',
    p_shipping_info->>'city',
    p_shipping_info->>'postal',
    p_shipping_info->>'phone',
    p_shipping_info->>'notes',
    p_stripe_session_id,
    p_stripe_payment_intent,
    p_discount_code,
    COALESCE(p_discount_amount, 0),
    COALESCE(p_shipping_info->>'country', 'España')
  )
  RETURNING id INTO v_order_id;

  -- ── 4. Crear líneas de pedido + restar stock ────────────────────────────
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
      v_item->>'size', (v_item->>'quantity')::INTEGER,
      v_product.price, v_line_total
    );

    UPDATE products
    SET stock = stock - (v_item->>'quantity')::INTEGER
    WHERE id = v_product.id;

    v_items_out := v_items_out || jsonb_build_object(
      'name', v_product.name,
      'quantity', (v_item->>'quantity')::INTEGER,
      'price', v_product.price,
      'size', v_item->>'size'
    );
  END LOOP;

  -- ── 5. Registrar uso de cupón ───────────────────────────────────────────
  IF p_discount_code IS NOT NULL AND p_discount_code != '' THEN
    SELECT id INTO v_discount_id FROM discounts WHERE code = p_discount_code;
    IF v_discount_id IS NOT NULL THEN
      UPDATE discounts SET used_count = used_count + 1 WHERE id = v_discount_id;
      INSERT INTO discount_usages (discount_id, user_id, order_id)
      VALUES (v_discount_id, p_user_id, v_order_id)
      ON CONFLICT (discount_id, user_id) DO NOTHING;
    END IF;
  END IF;

  -- ── 6. Devolver resultado ───────────────────────────────────────────────
  RETURN jsonb_build_object(
    'order_id',  v_order_id,
    'subtotal',  v_subtotal,
    'shipping',  v_shipping,
    'discount',  COALESCE(p_discount_amount, 0),
    'total',     v_total,
    'items',     v_items_out,
    'already_existed', false
  );
END;
$$;
