/// <reference path="../global.d.ts" />

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, siteUrl } = await req.json();

    if (!email || typeof email !== 'string') {
      return json({ sent: false, error: 'Email requerido' }, 400);
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const redirectTo = `${siteUrl || Deno.env.get('SITE_URL') || 'http://localhost:5173'}/recuperar-contrasena`;

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo },
    });

    if (linkError) {
      console.error('generateLink recovery error:', linkError.message);
      return json({ sent: true });
    }

    const actionLink = linkData?.properties?.action_link;
    if (!actionLink) {
      return json({ sent: true });
    }

    const from = Deno.env.get('RESEND_FROM_EMAIL') || 'Jándula Moda <onboarding@resend.dev>';

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: 'Restablece tu contraseña — Jándula Moda',
        html: buildRecoveryHtml(actionLink),
      }),
    });

    if (!resendResponse.ok) {
      const errText = await resendResponse.text();
      console.error('send-password-recovery resend error:', errText);
      return json({ sent: true });
    }

    return json({ sent: true });
  } catch (err) {
    console.error('send-password-recovery error:', err);
    return json({ sent: true });
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  });
}

function buildRecoveryHtml(actionLink: string) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Recuperar contraseña — Jándula Moda</title>
</head>
<body style="margin:0;padding:0;background:#faf9f7;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f7;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);max-width:600px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#e879a4,#c2185b);padding:36px;text-align:center;">
            <h1 style="color:#fff;font-size:28px;margin:0;font-weight:300;letter-spacing:2px;">JÁNDULA MODA</h1>
            <p style="color:rgba(255,255,255,0.88);margin:8px 0 0;font-size:13px;letter-spacing:1px;">RECUPERACIÓN DE CONTRASEÑA</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h2 style="color:#111827;font-size:22px;margin:0 0 16px;">¿Has olvidado tu contraseña?</h2>
            <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 24px;">
              Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Jándula Moda.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 26px;">
              <tr><td align="center">
                <a href="${actionLink}" style="display:inline-block;background:linear-gradient(135deg,#e879a4,#c2185b);color:#fff;padding:14px 34px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600;">
                  Restablecer contraseña
                </a>
              </td></tr>
            </table>
            <p style="color:#9ca3af;font-size:13px;line-height:1.6;margin:0;">
              Si no solicitaste este cambio, puedes ignorar este email. Tu contraseña seguirá siendo la misma.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
