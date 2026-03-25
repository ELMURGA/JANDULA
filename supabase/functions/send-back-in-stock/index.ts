/// <reference path="../global.d.ts" />

/**
 * POST /functions/v1/send-back-in-stock
 *
 * Cuando un producto vuelve a tener stock, envía emails a todos los
 * clientes que pidieron aviso y marca sus registros como notificados.
 *
 * Body: { productSlug, productName }
 * Auth: Cabecera  Authorization: Bearer <ADMIN_SECRET>
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200, headers: corsHeaders });
  if (req.method !== 'POST') return json({ ok: false, error: 'Método no permitido' }, 405);

  // Autenticación básica con ADMIN_SECRET
  const adminSecret = Deno.env.get('ADMIN_SECRET');
  if (adminSecret) {
    const authHeader = req.headers.get('Authorization') ?? '';
    const provided   = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!provided || provided !== adminSecret)
      return json({ ok: false, error: 'No autorizado' }, 401);
  }

  try {
    const body        = await req.json().catch(() => ({}));
    const productSlug: string = (body.productSlug ?? '').trim();
    const productName: string = (body.productName ?? '').trim();

    if (!productSlug || !productName)
      return json({ ok: false, error: 'productSlug y productName son obligatorios' }, 400);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Buscar registros pendientes de notificación
    const { data: rows, error: selectError } = await supabase
      .from('stock_notifications')
      .select('id, email, name, selected_color')
      .eq('product_slug', productSlug)
      .eq('notified', false);

    if (selectError) throw new Error(`DB select: ${selectError.message}`);
    if (!rows || rows.length === 0) {
      console.log(`send-back-in-stock: no pending for ${productSlug}`);
      return json({ ok: true, sent: 0, message: 'Sin suscriptores pendientes' });
    }

    const apiKey = Deno.env.get('RESEND_API_KEY');
    if (!apiKey) throw new Error('RESEND_API_KEY no configurada');

    const from       = Deno.env.get('RESEND_FROM_EMAIL') || 'Jándula Moda <onboarding@resend.dev>';
    const productUrl = `https://jandulamodautrera.es/producto/${productSlug}`;

    let sent = 0;
    const notifiedIds: string[] = [];

    for (const row of rows) {
      try {
        const r = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            from,
            to: [row.email],
            subject: `¡Ya está disponible! — ${productName}`,
            html: buildBackInStockHtml(
              row.name ?? '',
              productName,
              productUrl,
              row.selected_color ?? '',
            ),
          }),
        });
        if (r.ok) {
          sent++;
          notifiedIds.push(row.id);
        } else {
          console.error(`Resend failed for ${row.email}: ${await r.text()}`);
        }
      } catch (e) {
        console.error(`Email error for ${row.email}:`, e);
      }
    }

    // Marcar como notificados
    if (notifiedIds.length > 0) {
      const { error: updateError } = await supabase
        .from('stock_notifications')
        .update({ notified: true, notified_at: new Date().toISOString() })
        .in('id', notifiedIds);
      if (updateError) console.error('DB update error:', updateError.message);
    }

    console.log(`send-back-in-stock OK: ${sent}/${rows.length} emails for ${productSlug}`);
    return json({ ok: true, sent, total: rows.length });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('send-back-in-stock error:', msg);
    return json({ ok: false, error: msg }, 500);
  }
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  });
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const WRAP_OPEN = `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
</head><body style="margin:0;padding:0;background:#f5f5f5;
font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0"
  style="max-width:560px;width:100%;background:#fff;">`;

const WRAP_CLOSE = `<tr><td style="padding:28px 40px;border-top:1px solid #eee;text-align:center;">
<p style="margin:0;font-size:11px;color:#bbb;letter-spacing:.06em;text-transform:uppercase;">
Jándula Moda &nbsp;&middot;&nbsp; Utrera, Sevilla &nbsp;&middot;&nbsp;
<a href="https://jandulamodautrera.es" style="color:#bbb;text-decoration:none;">
jandulamodautrera.es</a></p>
</td></tr>
</table></td></tr></table></body></html>`;

function buildBackInStockHtml(
  name: string,
  productName: string,
  productUrl: string,
  color: string,
): string {
  const greeting  = name ? `Hola ${esc(name)},` : 'Hola,';
  const colorText = color ? ` en <strong>${esc(color)}</strong>` : '';

  return `${WRAP_OPEN}
<tr><td style="padding:36px 40px 28px;border-bottom:2px solid #111;">
  <p style="margin:0 0 8px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#aaa;">Jándula Moda</p>
  <h1 style="margin:0;font-size:22px;font-weight:700;color:#111;">¡Ya está disponible!</h1>
</td></tr>
<tr><td style="padding:32px 40px;">
  <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.75;">${greeting}</p>
  <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.75;">
    Buenas noticias: <strong>${esc(productName)}</strong>${colorText}
    ya está disponible de nuevo.
  </p>
  <p style="margin:0 0 32px;font-size:15px;color:#333;line-height:1.75;">
    Date prisa, el stock puede agotarse pronto.
  </p>
  <a href="${esc(productUrl)}"
    style="display:inline-block;background:#111;color:#fff;padding:13px 30px;
    text-decoration:none;font-size:14px;font-weight:600;letter-spacing:.04em;">
    Comprar ahora &rarr;
  </a>
</td></tr>
${WRAP_CLOSE}`;
}
