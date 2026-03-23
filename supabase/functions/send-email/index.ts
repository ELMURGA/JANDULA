/**
 * EDGE FUNCTION: send-email
 *
 * Envía el email de confirmación de pedido via Resend.
 * Solo se llama internamente desde stripe-webhook (no expuesta al frontend).
 *
 * POST /functions/v1/send-email
 * Authorization: Bearer <service_role_key>
 * Body: { to, orderId, customerName, items, subtotal, shipping, discount, total, shippingAddress }
 */

/// <reference path="../global.d.ts" />

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

interface OrderItem {
  name:     string;
  quantity: number;
  price:    number;
  size:     string | null;
  image?:   string;
}

interface ShippingAddress {
  address: string;
  city:    string;
  postal:  string;
  phone:   string;
}

interface SendEmailBody {
  to:              string;
  orderId:         number;
  customerName:    string;
  items:           OrderItem[];
  subtotal:        number;
  shipping:        number;
  discount:        number;
  total:           number;
  shippingAddress: ShippingAddress;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200 });
  }

  try {
    const authorization = req.headers.get('Authorization') ?? '';
    const expected = `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`;
    if (authorization !== expected) {
      return new Response(JSON.stringify({ sent: false, error: 'No autorizado' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const body: SendEmailBody = await req.json();
    const {
      to, orderId, customerName, items,
      subtotal, shipping, discount, total, shippingAddress,
    } = body;

    if (!to || !orderId) throw new Error('Faltan parámetros requeridos');

    const html = buildEmailHtml(
      orderId, customerName, items,
      subtotal, shipping, discount, total, shippingAddress
    );

    const from = Deno.env.get('RESEND_FROM_EMAIL') || 'Jándula Moda <onboarding@resend.dev>';

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        from,
        to:      [to],
        subject: `✅ Pedido #${orderId} confirmado — Jándula Moda`,
        html,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      throw new Error(`Resend error: ${errorText}`);
    }

    const result = await resendResponse.json();
    console.log(`✅ Email enviado a ${to}, id: ${result.id}`);

    return new Response(JSON.stringify({ sent: true, emailId: result.id }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al enviar el email';
    console.error('❌ send-email error:', message);
    return new Response(JSON.stringify({ sent: false, error: message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

// ─── Template HTML del email ──────────────────────────────────────────────────

function fmt(amount: number): string {
  return amount.toLocaleString('es-ES', {
    style:                 'currency',
    currency:              'EUR',
    minimumFractionDigits: 2,
  });
}

function buildEmailHtml(
  orderId:         number,
  customerName:    string,
  items:           OrderItem[],
  subtotal:        number,
  shipping:        number,
  discount:        number,
  total:           number,
  shippingAddress: ShippingAddress
): string {
  const itemRows = (items ?? []).map(item => `
    <tr>
      <td style="padding:12px 16px; border-bottom:1px solid #f3f4f6;">
        <strong style="color:#1f2937;">${item.name}</strong>
        ${item.size ? `<br><small style="color:#6b7280;">Talla: ${item.size}</small>` : ''}
        ${item.color ? `<br><small style="color:#6b7280;">Color: ${item.color}</small>` : ''}
      </td>
      <td style="padding:12px 16px; border-bottom:1px solid #f3f4f6; text-align:center; color:#6b7280;">
        ${item.quantity}
      </td>
      <td style="padding:12px 16px; border-bottom:1px solid #f3f4f6; text-align:right; color:#1f2937;">
        ${fmt(item.price * item.quantity)}
      </td>
    </tr>
  `).join('');

  const discountRow = discount > 0
    ? `<tr>
        <td colspan="2" style="padding:8px 16px; color:#059669;">Descuento</td>
        <td style="padding:8px 16px; text-align:right; color:#059669;">−${fmt(discount)}</td>
       </tr>`
    : '';

  const shippingRow = shipping === 0
    ? `<tr>
        <td colspan="2" style="padding:8px 16px; color:#059669;">Envío</td>
        <td style="padding:8px 16px; text-align:right; color:#059669;">¡Gratis!</td>
       </tr>`
    : `<tr>
        <td colspan="2" style="padding:8px 16px; color:#6b7280;">Envío</td>
        <td style="padding:8px 16px; text-align:right; color:#6b7280;">${fmt(shipping)}</td>
       </tr>`;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pedido Confirmado — Jándula Moda</title>
</head>
<body style="margin:0;padding:0;background:#faf9f7;font-family:'Georgia',serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f7;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#F29BCB;padding:40px;text-align:center;border-radius:12px 12px 0 0;">
              <h1 style="margin:0;color:#fff;font-size:28px;letter-spacing:2px;font-family:Georgia,serif;">
                JÁNDULA MODA
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;letter-spacing:1px;font-family:Arial,sans-serif;">
                TU ESTILO, TU ESENCIA
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px;border-radius:0 0 12px 12px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

              <!-- Checkmark -->
              <div style="text-align:center;margin-bottom:32px;">
                <div style="display:inline-block;width:64px;height:64px;background:#dcfce7;border-radius:50%;line-height:64px;font-size:32px;">
                  ✅
                </div>
              </div>

              <!-- Greeting -->
              <h2 style="margin:0 0 8px;color:#111827;font-size:22px;text-align:center;">
                ¡Gracias por tu compra, ${escapeHtml(customerName.split(' ')[0])}!
              </h2>
              <p style="margin:0 0 32px;color:#6b7280;text-align:center;font-family:Arial,sans-serif;font-size:15px;">
                Tu pedido <strong style="color:#F29BCB;">#${orderId}</strong> ha sido confirmado y está siendo preparado con cariño.
              </p>

              <!-- Order items table -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="border:1px solid #f3f4f6;border-radius:8px;overflow:hidden;margin-bottom:24px;">
                <thead>
                  <tr style="background:#fdf2f8;">
                    <th style="padding:12px 16px;text-align:left;color:#6b7280;font-size:12px;font-family:Arial,sans-serif;letter-spacing:0.5px;font-weight:600;text-transform:uppercase;">
                      Producto
                    </th>
                    <th style="padding:12px 16px;text-align:center;color:#6b7280;font-size:12px;font-family:Arial,sans-serif;letter-spacing:0.5px;font-weight:600;text-transform:uppercase;">
                      Cant.
                    </th>
                    <th style="padding:12px 16px;text-align:right;color:#6b7280;font-size:12px;font-family:Arial,sans-serif;letter-spacing:0.5px;font-weight:600;text-transform:uppercase;">
                      Precio
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="border:1px solid #f3f4f6;border-radius:8px;overflow:hidden;margin-bottom:32px;">
                <tbody>
                  <tr>
                    <td colspan="2" style="padding:8px 16px;color:#6b7280;font-family:Arial,sans-serif;font-size:14px;">Subtotal</td>
                    <td style="padding:8px 16px;text-align:right;color:#6b7280;font-family:Arial,sans-serif;font-size:14px;">${fmt(subtotal)}</td>
                  </tr>
                  ${discountRow}
                  ${shippingRow}
                  <tr style="background:#fdf2f8;">
                    <td colspan="2" style="padding:14px 16px;font-weight:bold;color:#111827;font-size:16px;font-family:Arial,sans-serif;">
                      TOTAL
                    </td>
                    <td style="padding:14px 16px;text-align:right;font-weight:bold;color:#F29BCB;font-size:18px;font-family:Arial,sans-serif;">
                      ${fmt(total)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Shipping address -->
              <div style="background:#f9fafb;border-radius:8px;padding:20px;margin-bottom:32px;">
                <h3 style="margin:0 0 12px;color:#374151;font-size:14px;font-family:Arial,sans-serif;letter-spacing:0.5px;text-transform:uppercase;">
                  📦 Dirección de Envío
                </h3>
                <p style="margin:0;color:#6b7280;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;">
                  ${escapeHtml(customerName)}<br>
                  ${escapeHtml(shippingAddress.address)}<br>
                  ${escapeHtml(shippingAddress.postal)} ${escapeHtml(shippingAddress.city)}<br>
                  Tel: ${escapeHtml(shippingAddress.phone)}
                </p>
              </div>

              <!-- CTA -->
              <div style="text-align:center;margin-bottom:32px;">
                <a href="https://jandula.vercel.app/mi-cuenta"
                   style="display:inline-block;background:#F29BCB;color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;font-family:Arial,sans-serif;font-size:15px;font-weight:600;letter-spacing:0.5px;">
                  Ver Mis Pedidos
                </a>
              </div>

              <!-- Info note -->
              <p style="margin:0 0 24px;color:#9ca3af;text-align:center;font-family:Arial,sans-serif;font-size:13px;line-height:1.6;">
                Recibirás otro email cuando tu pedido sea enviado.<br>
                ¿Alguna duda? Escríbenos a
                <a href="mailto:jandulamodautrera@gmail.com" style="color:#F29BCB;">jandulamodautrera@gmail.com</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-family:Arial,sans-serif;font-size:12px;">
                © ${new Date().getFullYear()} Jándula Moda · Todos los derechos reservados<br>
                <a href="https://jandula.vercel.app/politica-privacidad"
                   style="color:#9ca3af;text-decoration:underline;">Política de Privacidad</a>
                &nbsp;·&nbsp;
                <a href="https://jandula.vercel.app/devoluciones"
                   style="color:#9ca3af;text-decoration:underline;">Devoluciones</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
