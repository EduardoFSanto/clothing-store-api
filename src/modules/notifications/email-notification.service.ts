function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatCurrency(valueInCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valueInCents / 100);
}

type OrderItem = {
  productName: string;
  sku: string;
  size: string;
  color: string;
  quantity: number;
  totalInCents: number;
};

type PaidOrderNotificationInput = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalInCents: number;
  paymentMethod: string;
  receiptUrl: string;
  items: OrderItem[];
};

export class EmailNotificationService {
  async sendPaidOrderNotification(
    input: PaidOrderNotificationInput,
  ) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    const to =
      process.env.ORDER_NOTIFICATION_EMAIL ??
      "Suporte773@gmail.com";

    if (!apiKey || !from) {
      console.warn(
        "Email notification skipped: RESEND_API_KEY or RESEND_FROM_EMAIL is not configured.",
      );
      return;
    }

    const itemsHtml = input.items
      .map(
        (item) => `
          <tr>
            <td style="padding:10px;border-bottom:1px solid #eee;">
              <strong>${escapeHtml(item.productName)}</strong><br />
              <span style="color:#666;">SKU: ${escapeHtml(item.sku)}</span>
            </td>
            <td style="padding:10px;border-bottom:1px solid #eee;">
              ${escapeHtml(item.color)} / ${escapeHtml(item.size)}
            </td>
            <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">
              ${item.quantity}
            </td>
            <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">
              ${formatCurrency(item.totalInCents)}
            </td>
          </tr>
        `,
      )
      .join("");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#222;">
        <h1 style="margin-bottom:4px;">Nova venda aprovada</h1>
        <p style="color:#666;margin-top:0;">Saint Marin</p>

        <div style="background:#f7f7f7;padding:16px;border-radius:8px;margin:24px 0;">
          <p><strong>Pedido:</strong> #${escapeHtml(input.orderId)}</p>
          <p><strong>Cliente:</strong> ${escapeHtml(input.customerName)}</p>
          <p><strong>E-mail:</strong> ${escapeHtml(input.customerEmail)}</p>
          <p><strong>Pagamento:</strong> ${escapeHtml(input.paymentMethod)}</p>
          <p><strong>Total:</strong> ${formatCurrency(input.totalInCents)}</p>
        </div>

        <h2>Produtos</h2>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="text-align:left;">
              <th style="padding:10px;">Produto</th>
              <th style="padding:10px;">Variação</th>
              <th style="padding:10px;text-align:center;">Qtd.</th>
              <th style="padding:10px;text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <p style="margin-top:24px;">
          <a
            href="${escapeHtml(input.receiptUrl)}"
            style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:6px;"
          >
            Ver comprovante do pagamento
          </a>
        </p>
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Nova venda aprovada — Pedido #${input.orderId}`,
        html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();

      throw new Error(
        `Resend email failed (HTTP ${response.status}): ${detail}`,
      );
    }
  }
}
