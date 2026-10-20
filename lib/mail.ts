const DEFAULT_FROM =
  "StreamTrust Diagnostics <accounts@streamtrustdiagnostics.com>";

export function emailFrom() {
  return process.env.EMAIL_FROM?.trim() || DEFAULT_FROM;
}

export function receiptInbox() {
  return process.env.RECEIPT_EMAIL?.trim() || "accounts@streamtrustdiagnostics.com";
}

export async function sendEmail(input: {
  to: string[];
  subject: string;
  html: string;
  idempotencyKey: string;
}) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    return { ok: false as const, message: "Email is not configured." };
  }

  const recipients = [...new Set(input.to.map((address) => address.trim()).filter(Boolean))];
  if (recipients.length === 0) {
    return { ok: false as const, message: "No recipient for this email." };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "Idempotency-Key": input.idempotencyKey,
      },
      body: JSON.stringify({
        from: emailFrom(),
        to: recipients,
        subject: input.subject,
        html: input.html,
      }),
    });

    const body = (await res.json().catch(() => null)) as { message?: string; id?: string } | null;
    if (!res.ok) {
      return {
        ok: false as const,
        message: body?.message || "Could not send the receipt email.",
      };
    }
    return { ok: true as const, id: body?.id };
  } catch (error) {
    return {
      ok: false as const,
      message: error instanceof Error ? error.message : "Could not send the receipt email.",
    };
  }
}
