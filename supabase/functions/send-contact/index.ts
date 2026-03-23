/// <reference path="../global.d.ts" />

/**
 * EDGE FUNCTION: send-contact
 *
 * Recibe el mensaje del formulario de contacto y lo reenvía
 * a jandulamodautrera@gmail.com via Resend.
 *
 * POST /functions/v1/send-contact
 * Body: { name, email, phone?, message }
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
    const name:    string = (body.name    ?? '').trim();
    const email:   string = (body.email   ?? '').trim().toLowerCase();
    const phone:   string = (body.phone   ?? '').trim();
    const message: string = (body.message ?? '').trim();

    if (!name || !email || !message) {
      return json({ sent: false, error: 'Faltan campos obligatorios' }, 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ sent: false, error: 'Email inválido' }, 400);
    }

    const apiKey = Deno.env.get('RESEND_API_KEY');
    if (!apiKey) throw new Error('RESEND_API_KEY no configurada');

    const from = Deno.env.get('RESEND_FROM_EMAIL') || 'Jándula Moda <onboarding@resend.dev>';

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: ['jandulamodautrera@gmail.com'],
        reply_to: email,
        subject: `📬 Nuevo mensaje de contacto — ${name}`,
        html: buildHtml(name, email, phone, message),
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      throw new Error(`Resend error: ${errText}`);
    }

    // Enviar también email de confirmación al remitente
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: '✅ Hemos recibido tu mensaje — Jándula Moda',
        html: buildConfirmationHtml(name),
      }),
    });

    console.log(`✅ Contacto enviado de ${email}`);
    return json({ sent: true });

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error('send-contact error:', message);
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
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

function buildHtml(name: string, email: string, phone: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><title>Nuevo mensaje de contacto</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:12px;overflow:hidden;
                    box-shadow:0 4px 20px rgba(0,0,0,0.07);max-width:600px;">
        <tr>
          <td style="background:#F29BCB;padding:28px 32px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:1px;font-weight:400;">
              JÁNDULA MODA — Formulario de Contacto
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <h2 style="margin:0 0 20px;color:#111827;font-size:18px;">📬 Nuevo mensaje recibido</h2>

            <table width="100%" cellpadding="0" cellspacing="0"
                   style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:24px;">
              <tr style="background:#fdf0f8;">
                <td style="padding:10px 16px;font-weight:600;color:#374151;font-size:13px;width:120px;">Nombre</td>
                <td style="padding:10px 16px;color:#111827;font-size:14px;">${esc(name)}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;font-weight:600;color:#374151;font-size:13px;border-top:1px solid #f3f4f6;">Email</td>
                <td style="padding:10px 16px;color:#111827;font-size:14px;border-top:1px solid #f3f4f6;">
                  <a href="mailto:${esc(email)}" style="color:#F29BCB;">${esc(email)}</a>
                </td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding:10px 16px;font-weight:600;color:#374151;font-size:13px;border-top:1px solid #f3f4f6;">Teléfono</td>
                <td style="padding:10px 16px;color:#111827;font-size:14px;border-top:1px solid #f3f4f6;">
                  <a href="tel:${esc(phone)}" style="color:#F29BCB;">${esc(phone)}</a>
                </td>
              </tr>` : ''}
            </table>

            <div style="background:#f9fafb;border-left:4px solid #F29BCB;border-radius:4px;
                        padding:16px 20px;margin-bottom:24px;">
              <p style="margin:0 0 8px;font-weight:600;color:#374151;font-size:12px;
                         text-transform:uppercase;letter-spacing:0.5px;">Mensaje</p>
              <p style="margin:0;color:#374151;font-size:15px;line-height:1.7;">${esc(message)}</p>
            </div>

            <p style="color:#9ca3af;font-size:12px;margin:0;">
              Puedes responder directamente a este email para contestar a la clienta.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #f3f4f6;">
            <p style="color:#9ca3af;font-size:11px;margin:0;">
              © 2026 Jándula Moda · Utrera, Sevilla
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildConfirmationHtml(name: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><title>Hemos recibido tu mensaje</title></head>
<body style="margin:0;padding:0;background:#faf9f7;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:16px;overflow:hidden;
                    box-shadow:0 4px 24px rgba(0,0,0,0.06);max-width:600px;">
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
              ¡Gracias por escribirnos, ${esc(name)}! ✨
            </h2>
            <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 24px;">
              Hemos recibido tu mensaje y te responderemos lo antes posible,
              normalmente en menos de 24 horas laborables.
            </p>
            <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 28px;">
              Si necesitas ayuda urgente, también puedes contactarnos por WhatsApp:
            </p>
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr><td align="center">
                <a href="https://wa.me/34610505303"
                   style="display:inline-block;background:#F29BCB;color:#fff;
                          padding:14px 36px;border-radius:8px;text-decoration:none;
                          font-size:15px;font-weight:600;font-family:Arial,sans-serif;">
                  Contactar por WhatsApp
                </a>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;padding:16px 36px;text-align:center;border-top:1px solid #f3f4f6;">
            <p style="color:#9ca3af;font-size:12px;margin:0;">
              © 2026 Jándula Moda · Av. María Auxiliadora, 76 — Utrera, Sevilla
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
