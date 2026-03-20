-- ============================================
-- FIX: process_order_server_side
-- La migración anterior (add_color) usaba columnas
-- que no existen: price_discount, image_url, discount.
-- Esta migración corrige eso usando las columnas reales:
-- price, image, discount_amount, discount_code, shipping_country.
-- ============================================

DROP FUNCTION IF EXISTS process_order_server_side(UUID, JSONB, JSONB, TEXT, TEXT, TEXT, DECIMAL);

CREATE OR REPLACE FUNCTION process_order_server_side(
    p_user_id UUID,
    p_items JSONB,
    p_shipping_info JSONB,
    p_stripe_session_id TEXT,
    p_stripe_payment_intent TEXT DEFAULT NULL,
    p_discount_code TEXT DEFAULT NULL,
    p_discount_amount DECIMAL DEFAULT 0
) RETURNS JSONB
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
            SELECT jsonb_agg(jsonb_build_object(
                'name', oi.product_name,
                'quantity', oi.quantity,
                'price', oi.unit_price,
                'size', oi.size,
                'color', oi.color
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
            size, color, quantity, unit_price, total_price
        )
        VALUES (
            v_order_id, v_product.id, v_product.name, v_product.image,
            v_item->>'size', v_item->>'color',
            (v_item->>'quantity')::INTEGER,
            v_product.price, v_line_total
        );

        UPDATE products
        SET stock = stock - (v_item->>'quantity')::INTEGER
        WHERE id = v_product.id;

        v_items_out := v_items_out || jsonb_build_object(
            'name', v_product.name,
            'quantity', (v_item->>'quantity')::INTEGER,
            'price', v_product.price,
            'size', v_item->>'size',
            'color', v_item->>'color'
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
