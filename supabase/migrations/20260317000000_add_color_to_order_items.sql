-- Migración para añadir color a order_items

ALTER TABLE order_items ADD COLUMN IF NOT EXISTS color TEXT;

-- Actualizamos el RPC process_order_server_side para soportar color

DROP FUNCTION IF EXISTS process_order_server_side(UUID, JSONB, JSONB, TEXT, TEXT, TEXT, DECIMAL);

CREATE OR REPLACE FUNCTION process_order_server_side(
    p_user_id UUID,
    p_items JSONB,
    p_shipping_info JSONB,
    p_stripe_session_id TEXT,
    p_stripe_payment_intent TEXT,
    p_discount_code TEXT DEFAULT NULL,
    p_discount_amount DECIMAL DEFAULT 0
) RETURNS JSON AS $$
DECLARE
    v_order_id INTEGER;
    v_item JSONB;
    v_product_id INTEGER;
    v_qty INTEGER;
    v_size TEXT;
    v_color TEXT;
    v_stock_record RECORD;
    v_subtotal DECIMAL(10,2) := 0;
    v_shipping DECIMAL(10,2) := 0;
    v_total DECIMAL(10,2) := 0;
    v_item_price DECIMAL(10,2);
    v_items_result JSONB[] := '{}';
    v_existing_order_id INTEGER;
BEGIN
    -- 1. Idempotencia: Verificar si el pedido ya existe
    SELECT id INTO v_existing_order_id FROM orders WHERE stripe_session_id = p_stripe_session_id;
    IF v_existing_order_id IS NOT NULL THEN
       RETURN json_build_object(
          'order_id', v_existing_order_id,
          'status', 'already_processed'
       );
    END IF;

    -- 2. Validar stock, reservar temporalmente usando FOR UPDATE, y calcular subtotal
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'id')::INTEGER;
        v_qty := (v_item->>'quantity')::INTEGER;
        v_size := v_item->>'size';
        v_color := v_item->>'color';

        -- Leer fila con FOR UPDATE para pessimistic locking (evitar race conditions)
        SELECT * INTO v_stock_record 
        FROM products 
        WHERE id = v_product_id 
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Producto con ID % no existe', v_product_id;
        END IF;

        IF v_stock_record.stock < v_qty THEN
            RAISE EXCEPTION 'Stock insuficiente para el producto % (ID: %). Solicitado: %, Disponible: %', 
                            v_stock_record.name, v_product_id, v_qty, v_stock_record.stock;
        END IF;

        -- Precio real de la DB
        v_item_price := COALESCE(v_stock_record.price_discount, v_stock_record.price);
        v_subtotal := v_subtotal + (v_item_price * v_qty);

        v_items_result := array_append(v_items_result, jsonb_build_object(
            'id', v_product_id,
            'name', v_stock_record.name,
            'price', v_item_price,
            'quantity', v_qty,
            'size', v_size,
            'color', v_color
        ));
    END LOOP;

    -- 3. Calcular total
    IF (v_subtotal - p_discount_amount) < 50 AND (v_subtotal - p_discount_amount) > 0 THEN
        v_shipping := 4.95;
    END IF;

    v_total := GREATEST(v_subtotal - p_discount_amount + v_shipping, 0);

    -- 4. Insertar pedido
    INSERT INTO orders (
        user_id,
        status,
        total,
        shipping_name,
        shipping_address,
        shipping_city,
        shipping_postal,
        shipping_phone,
        notes,
        stripe_session_id,
        stripe_payment_intent,
        subtotal,
        discount,
        shipping
    ) VALUES (
        p_user_id,
        'Pagado',
        v_total,
        p_shipping_info->>'name',
        p_shipping_info->>'address',
        p_shipping_info->>'city',
        p_shipping_info->>'postal',
        p_shipping_info->>'phone',
        p_shipping_info->>'notes',
        p_stripe_session_id,
        p_stripe_payment_intent,
        v_subtotal,
        p_discount_amount,
        v_shipping
    ) RETURNING id INTO v_order_id;

    -- 5. Insertar líneas de pedido y descontar stock real
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'id')::INTEGER;
        v_qty := (v_item->>'quantity')::INTEGER;
        v_size := v_item->>'size';
        v_color := v_item->>'color';

        SELECT COALESCE(price_discount, price), name, image_url 
        INTO v_stock_record 
        FROM products WHERE id = v_product_id;

        INSERT INTO order_items (
            order_id, product_id, product_name, product_image, size, color, quantity, unit_price, total_price
        ) VALUES (
            v_order_id, 
            v_product_id, 
            v_stock_record.name, 
            v_stock_record.image_url, 
            v_size, 
            v_color,
            v_qty, 
            COALESCE(v_stock_record.price_discount, v_stock_record.price), 
            COALESCE(v_stock_record.price_discount, v_stock_record.price) * v_qty
        );

        -- Descontar stock definitivamente
        UPDATE products 
        SET stock = stock - v_qty 
        WHERE id = v_product_id;
    END LOOP;

    -- 6. Devolver resultado
    RETURN json_build_object(
        'order_id', v_order_id,
        'status', 'success',
        'subtotal', v_subtotal,
        'shipping', v_shipping,
        'discount', p_discount_amount,
        'total', v_total,
        'items', to_jsonb(v_items_result)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;