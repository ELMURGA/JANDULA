/// <reference path="../global.d.ts" />

/**
 * EDGE FUNCTION: send-discount-preview
 *
 * Endpoint PÚBLICO (marketing). Acepta un email y envía el código
 * de bienvenida BIENVENIDA10 via Resend. No requiere auth de usuario.
 *
 * POST /functions/v1/send-discount-preview
 * Body: { email: string }
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
    const email: string = (body.email ?? '').trim().toLowerCase();

    // Validación básica del formato de email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ sent: false, error: 'Email inválido' }, 400);
    }

    const from = Deno.env.get('RESEND_FROM_EMAIL') || 'Jándula Moda <onboarding@resend.dev>';
    const apiKey = Deno.env.get('RESEND_API_KEY');

    if (!apiKey) {
      throw new Error('RESEND_API_KEY no configurada');
    }

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: '🎁 Tu 10% de descuento en Jándula Moda',
        html: buildHtml(email),
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      throw new Error(`Resend error: ${errText}`);
    }

    const result = await resendRes.json();
    console.log(`✅ Código descuento enviado a ${email}, id: ${result.id}`);
    return json({ sent: true });

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error('send-discount-preview error:', message);
    return json({ sent: false, error: message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  });
}

function buildHtml(email: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Tu descuento de bienvenida — Jándula Moda</title>
</head>
<body style="margin:0;padding:0;background:#faf9f7;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f7;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:16px;overflow:hidden;
                    box-shadow:0 4px 24px rgba(0,0,0,0.06);max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#F29BCB;padding:40px;text-align:center;">
            <h1 style="color:#fff;font-size:28px;margin:0;font-weight:300;letter-spacing:2px;">
              JÁNDULA MODA
            </h1>
            <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:13px;letter-spacing:1px;">
              MODA PARA SENTIRTE BIEN
            </p>
          </td>
        </tr>

        <!-- Cuerpo -->
        <tr>
          <td style="padding:40px;">
            <h2 style="color:#111827;font-size:22px;margin:0 0 14px;">¡Tu código te espera! 🎁</h2>
            <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 28px;">
              Gracias por tu interés en Jándula Moda. Aquí tienes tu código exclusivo de bienvenida:
            </p>

            <!-- Código -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#fdf0f8;border:2px dashed #F29BCB;border-radius:12px;margin:0 0 28px;">
              <tr>
                <td style="padding:28px;text-align:center;">
                  <p style="color:#9ca3af;font-size:11px;letter-spacing:1px;margin:0 0 10px;
                             text-transform:uppercase;">Tu código de descuento</p>
                  <p style="color:#c47fa8;font-size:32px;font-weight:700;letter-spacing:5px;
                             margin:0;font-family:monospace;">BIENVENIDA10</p>
                  <p style="color:#9ca3af;font-size:13px;margin:10px 0 0;">
                    10% de descuento en tu primera compra
                  </p>
                </td>
              </tr>
            </table>

            <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 32px;">
              Introduce este código al finalizar tu pedido para aplicar el descuento automáticamente.
              Es de <strong>un solo uso</strong> y válido para clientes nuevas.
            </p>

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="https://jandulamodautrera.es/categoria/todos"
                   style="display:inline-block;background:#F29BCB;color:#fff;
                          padding:16px 44px;border-radius:8px;text-decoration:none;
                          font-size:15px;font-weight:600;font-family:Arial,sans-serif;">
                  Ver la tienda →
                </a>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;text-align:center;
                     border-top:1px solid #f3f4f6;">
            <p style="color:#9ca3af;font-size:12px;margin:0;">
              © 2026 Jándula Moda · Si no pediste este código, puedes ignorar este correo.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
