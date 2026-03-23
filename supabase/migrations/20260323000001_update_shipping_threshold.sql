-- ============================================================
-- FIX: Actualizar umbral de envío gratis de 50€ a 100€
--      en la función process_order_server_side
-- ============================================================

CREATE OR REPLACE FUNCTION process_order_server_side(
  p_user_id        UUID,
  p_cart_items     JSONB,
  p_shipping_info  JSONB,
  p_discount_code  TEXT DEFAULT NULL,
  p_discount_amount DECIMAL DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id   INTEGER;
  v_subtotal   DECIMAL(10,2) := 0;
  v_shipping   DECIMAL(10,2) := 0;
  v_total      DECIMAL(10,2) := 0;
  v_item       JSONB;
  v_product    RECORD;
BEGIN
  -- 1. Calcular subtotal y validar stock
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_cart_items)
  LOOP
    SELECT id, name, price, stock, image
    INTO v_product
    FROM products
    WHERE id = (v_item->>'id')::INTEGER AND is_active = true;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Producto no encontrado o inactivo: %', v_item->>'id';
    END IF;

    IF v_product.stock < (v_item->>'quantity')::INTEGER THEN
      RAISE EXCEPTION 'Stock insuficiente para: %', v_product.name;
    END IF;

    v_subtotal := v_subtotal + (v_product.price * (v_item->>'quantity')::INTEGER);
  END LOOP;

  -- 2. Calcular envío (gratis a partir de 100€)
  v_shipping := CASE WHEN v_subtotal >= 100 THEN 0 ELSE 3.99 END;

  -- 3. Descuento envío gratis
  IF p_discount_code IS NOT NULL AND p_discount_amount = 0 THEN
    DECLARE
      v_disc RECORD;
    BEGIN
      SELECT type INTO v_disc FROM discounts WHERE code = p_discount_code AND is_active = true;
      IF FOUND AND v_disc.type = 'free_shipping' THEN
        v_shipping := 0;
      END IF;
    END;
  END IF;

  -- 4. Total final
  v_total := v_subtotal + v_shipping - p_discount_amount;
  IF v_total < 0 THEN v_total := 0; END IF;

  -- 5. Insertar pedido
  INSERT INTO orders (
    user_id, status, subtotal, shipping, total,
    shipping_name, shipping_address, shipping_city,
    shipping_postal, shipping_phone, notes,
    discount_code, discount_amount
  ) VALUES (
    p_user_id, 'confirmado', v_subtotal, v_shipping, v_total,
    p_shipping_info->>'name',
    p_shipping_info->>'address',
    p_shipping_info->>'city',
    p_shipping_info->>'postal',
    p_shipping_info->>'phone',
    COALESCE(p_shipping_info->>'notes', ''),
    p_discount_code,
    p_discount_amount
  )
  RETURNING id INTO v_order_id;

  -- 6. Insertar líneas de pedido y descontar stock
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_cart_items)
  LOOP
    SELECT id, name, price, image
    INTO v_product
    FROM products
    WHERE id = (v_item->>'id')::INTEGER;

    INSERT INTO order_items (
      order_id, product_id, product_name, quantity,
      unit_price, total_price, size, color, image
    ) VALUES (
      v_order_id,
      v_product.id,
      v_product.name,
      (v_item->>'quantity')::INTEGER,
      v_product.price,
      v_product.price * (v_item->>'quantity')::INTEGER,
      v_item->>'size',
      v_item->>'color',
      v_product.image
    );

    UPDATE products
    SET stock = stock - (v_item->>'quantity')::INTEGER
    WHERE id = v_product.id;
  END LOOP;

  RETURN jsonb_build_object(
    'order_id', v_order_id,
    'subtotal', v_subtotal,
    'shipping', v_shipping,
    'total',    v_total
  );
END;
$$;
