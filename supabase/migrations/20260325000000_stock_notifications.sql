-- ============================================================
-- stock_notifications
-- Registra los clientes que quieren ser avisados cuando un
-- producto agotado vuelva a estar disponible.
-- ============================================================

create table if not exists public.stock_notifications (
  id            uuid primary key default gen_random_uuid(),
  product_slug  text not null,
  product_name  text not null,
  email         text not null,
  name          text not null default '',
  selected_color text not null default '',
  notified      boolean not null default false,
  notified_at   timestamptz,
  created_at    timestamptz not null default now()
);

-- Índice para buscar rápido por producto y estado
create index if not exists stock_notifications_slug_notified_idx
  on public.stock_notifications (product_slug, notified);

-- Evitar duplicados: un email no puede suscribirse dos veces al mismo producto+color
create unique index if not exists stock_notifications_unique_idx
  on public.stock_notifications (product_slug, email, selected_color);

-- RLS: la tabla solo es accesible desde funciones server-side (service_role)
alter table public.stock_notifications enable row level security;

-- Permitir inserción pública (el formulario no requiere login)
create policy "insert_public" on public.stock_notifications
  for insert with check (true);

-- Solo service_role puede leer y actualizar (para la Edge Function send-back-in-stock)
create policy "select_service" on public.stock_notifications
  for select using (auth.role() = 'service_role');

create policy "update_service" on public.stock_notifications
  for update using (auth.role() = 'service_role');
