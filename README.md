# Jándula Moda

Tienda React + Vite con:
- Sanity como CMS de catálogo
- Supabase para auth, pedidos y productos transaccionales
- Stripe para checkout
- Resend para emails

## Flujo actual

1. El catálogo visible se lee desde Sanity.
2. El checkout valida precios y stock contra la tabla `products` de Supabase.
3. Para que un producto nuevo de Sanity se pueda comprar, ese producto debe estar sincronizado en `products`.

## Sync Sanity -> Supabase

La función desplegada es:

- `https://aadjazenpqldtvnxqksr.supabase.co/functions/v1/sync-products`

Qué hace:

- inserta o actualiza productos desde Sanity en Supabase
- desactiva en Supabase los productos que ya no existan en Sanity

Autenticación esperada:

- header `Authorization: Bearer <VITE_SUPABASE_ANON_KEY>`

## Para automatizar productos nuevos

Configura un webhook en Sanity que haga `POST` a la URL anterior cada vez que cambie un documento `product`.

Estado actual:

- el webhook de produccion ya esta creado y apuntando a `sync-products`
- la funcion ya valida un secreto dedicado para el webhook

Headers recomendados:

- `x-webhook-token: <SANITY_WEBHOOK_SECRET>`
- `Content-Type: application/json`

Resultado:

- si el cliente crea un producto en Sanity, se sincroniza a Supabase y se puede comprar
- si lo desactiva o lo elimina, deja de estar activo para checkout después del sync

## Comandos útiles

```bash
npm run dev
npm run build
node scripts/setup_sanity_webhook.mjs
supabase functions deploy sync-products
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook
supabase functions deploy confirm-order
```