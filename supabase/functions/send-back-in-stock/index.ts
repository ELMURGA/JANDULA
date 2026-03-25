/// <reference path="../global.d.ts" />

/**
 * POST /functions/v1/send-back-in-stock
 *
 * Invocado de dos formas:
 *   A) Webhook automático de Sanity — cuando outOfStock pasa a false
 *      Header:  x-webhook-token: <SANITY_WEBHOOK_SECRET>
 *      Body:    { productSlug, productName, outOfStock }
 *
 *   B) Llamada manual
 *      Header:  Authorization: Bearer <ADMIN_SECRET>
 *      Body:    { productSlug, productName }
 *
 * Busca todos los avisos pendientes para ese producto y envía emails.
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

  // ── Autenticación ──────────────────────────────────────────────────────────
  // Acepta:  x-webhook-token (Sanity)  O  Authorization: Bearer (manual)
  const webhookSecret = Deno.env.get('SANITY_WEBHOOK_SECRET') ?? '';
  const adminSecret   = Deno.env.get('ADMIN_SECRET')          ?? '';

  const providedToken  = req.headers.get('x-webhook-token')  ?? '';
  const providedBearer = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '').trim();

  const isWebhook = webhookSecret && providedToken === webhookSecret;
  const isManual  = adminSecret   && providedBearer === adminSecret;

  if (!isWebhook && !isManual) {
    return json({ ok: false, error: 'No autorizado' }, 401);
  }

  try {
    const body        = await req.json().catch(() => ({}));
    const productSlug: string  = (body.productSlug ?? '').trim();
    const productName: string  = (body.productName ?? '').trim();
    // Sanity envía outOfStock en el payload; si es true el producto sigue agotado
    const outOfStock:  boolean = body.outOfStock ?? false;

    if (!productSlug || !productName)
      return json({ ok: false, error: 'productSlug y productName son obligatorios' }, 400);

    // Si el producto sigue agotado (webhook disparado por otro cambio), ignorar
    if (outOfStock === true) {
      console.log(`send-back-in-stock: ${productSlug} sigue agotado, ignorando`);
      return json({ ok: true, sent: 0, message: 'Producto aún agotado, sin acción' });
    }

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

const WRAP_OPEN = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><title>Jándula Moda</title></head>
<body style="margin:0;padding:0;background:#faf9f7;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:16px;overflow:hidden;
                    box-shadow:0 4px 24px rgba(0,0,0,0.06);max-width:600px;">`;

const WRAP_CLOSE = `        <tr>
          <td style="background:#f9fafb;padding:16px 36px;text-align:center;border-top:1px solid #f3f4f6;">
            <p style="color:#9ca3af;font-size:12px;font-family:Arial,sans-serif;margin:0;">
              &copy; ${new Date().getFullYear()} Jándula Moda &middot; Todos los derechos reservados<br/>
              <a href="https://jandulamodautrera.es/politica-privacidad"
                 style="color:#9ca3af;text-decoration:underline;">Política de Privacidad</a>
              &nbsp;&middot;&nbsp;
              <a href="https://jandulamodautrera.es/devoluciones"
                 style="color:#9ca3af;text-decoration:underline;">Devoluciones</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

function buildBackInStockHtml(
  name: string,
  productName: string,
  productUrl: string,
  color: string,
): string {
  const greeting  = name ? `Hola ${esc(name)},` : 'Hola,';
  const colorText = color ? ` en <strong>${esc(color)}</strong>` : '';

  return `${WRAP_OPEN}
        <tr>
          <td style="background:#F29BCB;padding:36px;text-align:center;">
            <h1 style="color:#fff;font-size:26px;margin:0;font-weight:300;letter-spacing:2px;">
              JÁNDULA MODA
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding:36px;">
            <h2 style="color:#111827;font-size:20px;margin:0 0 14px;">
              ¡Ya está disponible! 🎉
            </h2>
            <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 16px;">${greeting}</p>
            <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 16px;">
              Buenas noticias: <strong style="color:#111827;">${esc(productName)}</strong>${colorText}
              ya está disponible de nuevo.
            </p>
            <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 28px;">
              Date prisa, el stock puede agotarse pronto. ✨
            </p>
            <table cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" style="padding-top:8px;">
              <a href="${esc(productUrl)}"
                 style="display:inline-block;background:#F29BCB;color:#fff;
                        padding:14px 36px;border-radius:8px;text-decoration:none;
                        font-size:15px;font-weight:600;font-family:Arial,sans-serif;">
                Comprar ahora &rarr;
              </a>
            </td></tr></table>
          </td>
        </tr>
${WRAP_CLOSE}`;
}
