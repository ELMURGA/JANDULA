/// <reference path="../global.d.ts" />

/**
 * EDGE FUNCTION: notify-stock
 *
 * Cuando un cliente pulsa "Avísame cuando esté disponible":
 *  1. Envía un correo a jandulamodautrera@gmail.com con los datos del cliente y el producto
 *  2. Envía una confirmación al cliente
 *
 * POST /functions/v1/notify-stock
 * Body: { name, email, productName, productSlug, selectedColor? }
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ sent: false, error: 'Método no permitido' }, 405);
  }

  try {
    const body = await req.json().catch(() => ({}));
    const name:          string = (body.name          ?? '').trim();
    const email:         string = (body.email         ?? '').trim().toLowerCase();
    const productName:   string = (body.productName   ?? '').trim();
    const productSlug:   string = (body.productSlug   ?? '').trim();
    const selectedColor: string = (body.selectedColor ?? '').trim();

    if (!name || !email || !productName) {
      return json({ sent: false, error: 'Faltan campos obligatorios' }, 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ sent: false, error: 'Email inválido' }, 400);
    }

    const apiKey = Deno.env.get('RESEND_API_KEY');
    if (!apiKey) throw new Error('RESEND_API_KEY no configurada');

    const from = Deno.env.get('RESEND_FROM_EMAIL') || 'Jándula Moda <onboarding@resend.dev>';
    const productUrl = `https://jandulamodautrera.es/producto/${productSlug}`;

    // ── Email a la tienda ─────────────────────────────────────────────────────
    const storeRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: ['jandulamodautrera@gmail.com'],
        reply_to: email,
        subject: `🔔 Aviso de stock — ${productName}`,
        html: buildStoreHtml(name, email, productName, productUrl, selectedColor),
      }),
    });

    if (!storeRes.ok) {
      const errText = await storeRes.text();
      throw new Error(`Resend error (tienda): ${errText}`);
    }

    // ── Email de confirmación al cliente ─────────────────────────────────────
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: `✅ Te avisaremos cuando esté disponible — ${productName}`,
        html: buildClientHtml(name, productName, productUrl, selectedColor),
      }),
    });

    console.log(`✅ Aviso de stock enviado: ${email} → ${productName}`);
    return json({ sent: true });

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error('notify-stock error:', message);
    return json({ sent: false, error: message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  });
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── Email para la tienda ──────────────────────────────────────────────────────
function buildStoreHtml(name: string, email: string, productName: string, productUrl: string, color: string): string {
  const colorRow = color
    ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">Color</td><td style="padding:6px 0;font-size:14px;font-weight:600;">${esc(color)}</td></tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><title>Aviso de stock</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:12px;overflow:hidden;
                    box-shadow:0 4px 20px rgba(0,0,0,0.07);max-width:600px;">
        <tr>
          <td style="background:#F29BCB;padding:28px 32px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">🔔 Nueva petición de stock</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <h2 style="margin:0 0 20px;font-size:17px;color:#111;">
              Un cliente quiere que le avises cuando el producto esté disponible:
            </h2>
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
              <tr>
                <td style="padding:6px 0;color:#6b7280;font-size:14px;">Producto</td>
                <td style="padding:6px 0;font-size:14px;font-weight:600;">${esc(productName)}</td>
              </tr>
              ${colorRow}
              <tr>
                <td style="padding:6px 0;color:#6b7280;font-size:14px;">Cliente</td>
                <td style="padding:6px 0;font-size:14px;font-weight:600;">${esc(name)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;font-size:14px;">Email</td>
                <td style="padding:6px 0;font-size:14px;">
                  <a href="mailto:${esc(email)}" style="color:#F29BCB;">${esc(email)}</a>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 20px;color:#374151;font-size:14px;">
              Cuando el producto vuelva a estar disponible, avisa a este cliente por email o WhatsApp.
            </p>
            <a href="${esc(productUrl)}"
               style="display:inline-block;background:#F29BCB;color:#fff;padding:12px 28px;
                      border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">
              Ver producto →
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background:#f9fafb;text-align:center;
                     font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb;">
            Jándula Moda · Utrera, Sevilla
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Email de confirmación al cliente ─────────────────────────────────────────
function buildClientHtml(name: string, productName: string, productUrl: string, color: string): string {
  const colorText = color ? ` (${esc(color)})` : '';

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><title>Te avisaremos</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:12px;overflow:hidden;
                    box-shadow:0 4px 20px rgba(0,0,0,0.07);max-width:600px;">
        <tr>
          <td style="background:#F29BCB;padding:28px 32px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">
              ✅ ¡Recibido, ${esc(name)}!
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.6;">
              Hemos anotado tu interés en
              <strong>${esc(productName)}${colorText}</strong>.
            </p>
            <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
              En cuanto vuelva a estar disponible te avisaremos por email. ¡Gracias por confiar en Jándula Moda!
            </p>
            <a href="${esc(productUrl)}"
               style="display:inline-block;background:#F29BCB;color:#fff;padding:12px 28px;
                      border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">
              Ver el producto
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background:#f9fafb;text-align:center;
                     font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb;">
            Jándula Moda · Utrera, Sevilla ·
            <a href="https://jandulamodautrera.es" style="color:#F29BCB;">jandulamodautrera.es</a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
