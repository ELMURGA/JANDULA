/// <reference path="../global.d.ts" />

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders });
  }

  try {
    const authorization = req.headers.get('Authorization') ?? '';
    if (!authorization) {
      return json({ sent: false, error: 'No autorizado' }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authorization } } }
    );

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return json({ sent: false, error: 'Sesión inválida' }, 401);
    }

    const customerName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Clienta';
    const to = user.email!;
    const from = Deno.env.get('RESEND_FROM_EMAIL') || 'Jándula Moda <onboarding@resend.dev>';

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: '🎉 Bienvenida a Jándula Moda — Tu descuento del 10%',
        html: buildWelcomeHtml(customerName),
      }),
    });

    if (!resendResponse.ok) {
      const err = await resendResponse.text();
      console.error('Resend error:', err);
      return json({ sent: false, error: err }, 500);
    }

    const result = await resendResponse.json();
    console.log(`✅ Email bienvenida enviado a ${to}, id: ${result.id}`);
    return json({ sent: true, id: result.id });

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error';
    console.error('send-welcome-email error:', message);
    return json({ sent: false, error: message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  });
}

function buildWelcomeHtml(name: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Bienvenida a Jándula Moda</title>
</head>
<body style="margin:0;padding:0;background:#faf9f7;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f7;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);max-width:600px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#e879a4,#c2185b);padding:40px;text-align:center;">
            <h1 style="color:#fff;font-size:28px;margin:0;font-weight:300;letter-spacing:2px;">JÁNDULA MODA</h1>
            <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:13px;letter-spacing:1px;">MODA PARA SENTIRTE BIEN</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">¡Bienvenida, ${name}! 🎉</h2>
            <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 24px;">
              Nos alegra tenerte con nosotras. Como regalo de bienvenida, tienes un
              <strong style="color:#e879a4;">10% de descuento</strong> en tu primera compra.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf2f8;border:2px dashed #e879a4;border-radius:12px;margin:0 0 24px;">
              <tr>
                <td style="padding:24px;text-align:center;">
                  <p style="color:#9ca3af;font-size:11px;letter-spacing:1px;margin:0 0 8px;text-transform:uppercase;">Tu código de bienvenida</p>
                  <p style="color:#e879a4;font-size:30px;font-weight:700;letter-spacing:4px;margin:0;font-family:monospace;">BIENVENIDA10</p>
                  <p style="color:#9ca3af;font-size:13px;margin:8px 0 0;">10% de descuento · Sin fecha de caducidad</p>
                </td>
              </tr>
            </table>
            <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 32px;">
              Introduce este código al finalizar tu compra para aplicar el descuento automáticamente.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="https://jandula.es/categoria/todos"
                   style="display:inline-block;background:linear-gradient(135deg,#e879a4,#c2185b);color:#fff;padding:16px 40px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600;">
                  Ir a la Tienda →
                </a>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #f3f4f6;">
            <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 Jándula Moda · Andújar, Jaén</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
