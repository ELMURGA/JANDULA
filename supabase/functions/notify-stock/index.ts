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

const WRAP_OPEN = `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;">`;

const WRAP_CLOSE = `<tr><td style="padding:28px 40px;border-top:1px solid #eee;text-align:center;">
<p style="margin:0;font-size:11px;color:#bbb;letter-spacing:.06em;text-transform:uppercase;">
Jándula Moda &nbsp;&middot;&nbsp; Utrera, Sevilla &nbsp;&middot;&nbsp;
<a href="https://jandulamodautrera.es" style="color:#bbb;text-decoration:none;">jandulamodautrera.es</a>
</p>
</td></tr>
</table></td></tr></table></body></html>`;

function emailBtn(label: string, url: string): string {
  return `<a href="${esc(url)}" style="display:inline-block;background:#111;color:#fff;padding:13px 30px;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:.04em;">${label}</a>`;
}

function buildStoreHtml(
  name: string, email: string,
  productName: string, productUrl: string, color: string,
): string {
  const colorRow = color
    ? `<tr>
  <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#666;width:110px;">Color</td>
  <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;font-weight:600;color:#111;">${esc(color)}</td>
</tr>`
    : '';

  return `${WRAP_OPEN}
<tr><td style="padding:36px 40px 28px;border-bottom:2px solid #111;">
  <p style="margin:0 0 8px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#aaa;">Jándula Moda</p>
  <h1 style="margin:0;font-size:22px;font-weight:700;color:#111;">Nueva petición de stock</h1>
  <p style="margin:8px 0 0;font-size:14px;color:#666;">Un cliente quiere ser avisado cuando vuelva este producto.</p>
</td></tr>
<tr><td style="padding:28px 40px 8px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#666;width:110px;">Producto</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;font-weight:700;color:#111;">${esc(productName)}</td>
    </tr>
    ${colorRow}
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#666;">Cliente</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#111;">${esc(name)}</td>
    </tr>
    <tr>
      <td style="padding:10px 0;font-size:14px;color:#666;">Email</td>
      <td style="padding:10px 0;font-size:14px;"><a href="mailto:${esc(email)}" style="color:#111;">${esc(email)}</a></td>
    </tr>
  </table>
</td></tr>
<tr><td style="padding:24px 40px 40px;">${emailBtn('Ver producto', productUrl)}</td></tr>
${WRAP_CLOSE}`;
}

function buildClientConfirmHtml(
  name: string, productName: string, productUrl: string, color: string,
): string {
  const colorText = color ? ` en <strong>${esc(color)}</strong>` : '';
  return `${WRAP_OPEN}
<tr><td style="padding:36px 40px 28px;border-bottom:2px solid #111;">
  <p style="margin:0 0 8px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#aaa;">Jándula Moda</p>
  <h1 style="margin:0;font-size:22px;font-weight:700;color:#111;">Te avisaremos cuando vuelva</h1>
</td></tr>
<tr><td style="padding:32px 40px;">
  <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.75;">Hola ${esc(name)},</p>
  <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.75;">
    Hemos anotado tu interés en <strong>${esc(productName)}</strong>${colorText}.
  </p>
  <p style="margin:0 0 32px;font-size:15px;color:#333;line-height:1.75;">
    En cuanto vuelva a estar disponible recibirás un email con el enlace directo. No tienes que hacer nada más.
  </p>
  ${emailBtn('Ver el producto', productUrl)}
</td></tr>
${WRAP_CLOSE}`;
}
