/// <reference path="../global.d.ts" />

/**
 * POST /functions/v1/notify-stock
 * Body: { name, email, productName, productSlug, selectedColor? }
 *
 * 1. Guarda en stock_notifications (Supabase)
 * 2. Email aviso a la tienda
 * 3. Email confirmación al cliente
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200, headers: corsHeaders });
  if (req.method !== 'POST') return json({ sent: false, error: 'Método no permitido' }, 405);

  try {
    const body           = await req.json().catch(() => ({}));
    const name:          string = (body.name          ?? '').trim();
    const email:         string = (body.email         ?? '').trim().toLowerCase();
    const productName:   string = (body.productName   ?? '').trim();
    const productSlug:   string = (body.productSlug   ?? '').trim();
    const selectedColor: string = (body.selectedColor ?? '').trim();

    if (!name || !email || !productName)
      return json({ sent: false, error: 'Faltan campos obligatorios' }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return json({ sent: false, error: 'Email inválido' }, 400);

    // 1. Guardar en Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const { error: dbError } = await supabase
      .from('stock_notifications')
      .upsert(
        { product_slug: productSlug, product_name: productName, email, name, selected_color: selectedColor },
        { onConflict: 'product_slug,email,selected_color', ignoreDuplicates: true },
      );
    if (dbError) console.error('DB upsert error:', dbError.message);

    // 2 & 3. Emails via Resend
    const apiKey = Deno.env.get('RESEND_API_KEY');
    if (!apiKey) throw new Error('RESEND_API_KEY no configurada');

    const from       = Deno.env.get('RESEND_FROM_EMAIL') || 'Jándula Moda <onboarding@resend.dev>';
    const productUrl = `https://jandulamodautrera.es/producto/${productSlug}`;

    const r1 = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from,
        to: ['jandulamodautrera@gmail.com'],
        reply_to: email,
        subject: `Aviso de stock — ${productName}`,
        html: buildStoreHtml(name, email, productName, productUrl, selectedColor),
      }),
    });
    if (!r1.ok) throw new Error(`Resend (tienda): ${await r1.text()}`);

    // Confirmación al cliente (no bloquea si falla)
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from,
        to: [email],
        subject: `Anotado — te avisaremos cuando vuelva ${productName}`,
        html: buildClientConfirmHtml(name, productName, productUrl, selectedColor),
      }),
    }).catch((e: unknown) => console.error('Resend (cliente):', e));

    console.log(`notify-stock OK: ${email} -> ${productSlug}`);
    return json({ sent: true });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('notify-stock error:', msg);
    return json({ sent: false, error: msg }, 500);
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

function emailBtn(label: string, url: string): string {
  return `<table cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" style="padding-top:8px;">
    <a href="${esc(url)}"
       style="display:inline-block;background:#F29BCB;color:#fff;
              padding:14px 36px;border-radius:8px;text-decoration:none;
              font-size:15px;font-weight:600;font-family:Arial,sans-serif;">${label}</a>
  </td></tr></table>`;
}

function buildStoreHtml(
  name: string, email: string,
  productName: string, productUrl: string, color: string,
): string {
  const colorRow = color
    ? `<tr style="background:#fdf0f8;">
  <td style="padding:10px 16px;font-weight:600;color:#374151;font-size:13px;border-top:1px solid #f3f4f6;width:110px;">Color</td>
  <td style="padding:10px 16px;color:#111827;font-size:14px;border-top:1px solid #f3f4f6;">${esc(color)}</td>
</tr>`
    : '';

  return `${WRAP_OPEN}
        <tr>
          <td style="background:#F29BCB;padding:28px 32px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:1px;font-weight:400;">
              JÁNDULA MODA — Aviso de Stock
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <h2 style="margin:0 0 20px;color:#111827;font-size:18px;"> Nueva petición de stock</h2>
            <p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6;">
              Un cliente quiere ser avisado cuando vuelva a estar disponible.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:24px;">
              <tr style="background:#fdf0f8;">
                <td style="padding:10px 16px;font-weight:600;color:#374151;font-size:13px;width:110px;">Producto</td>
                <td style="padding:10px 16px;color:#111827;font-size:14px;font-weight:700;">${esc(productName)}</td>
              </tr>
              ${colorRow}
              <tr>
                <td style="padding:10px 16px;font-weight:600;color:#374151;font-size:13px;border-top:1px solid #f3f4f6;">Cliente</td>
                <td style="padding:10px 16px;color:#111827;font-size:14px;border-top:1px solid #f3f4f6;">${esc(name)}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;font-weight:600;color:#374151;font-size:13px;border-top:1px solid #f3f4f6;">Email</td>
                <td style="padding:10px 16px;font-size:14px;border-top:1px solid #f3f4f6;">
                  <a href="mailto:${esc(email)}" style="color:#F29BCB;">${esc(email)}</a>
                </td>
              </tr>
            </table>
            ${emailBtn('Ver producto', productUrl)}
          </td>
        </tr>
${WRAP_CLOSE}`;
}

function buildClientConfirmHtml(
  name: string, productName: string, productUrl: string, color: string,
): string {
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
              ¡Anotado! Te avisaremos cuando vuelva 
            </h2>
            <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 16px;">
              Hola ${esc(name)},
            </p>
            <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 16px;">
              Hemos anotado tu interés en <strong style="color:#111827;">${esc(productName)}</strong>${colorText}.
            </p>
            <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 28px;">
              En cuanto vuelva a estar disponible recibirás un email con el enlace directo.
              No tienes que hacer nada más.
            </p>
            ${emailBtn('Ver el producto', productUrl)}
          </td>
        </tr>
${WRAP_CLOSE}`;
}
