import { timingSafeEqual } from "node:crypto";
import { formatNgn } from "@/lib/catalog";
import { receiptInbox, sendEmail } from "@/lib/mail";
import { org } from "@/lib/org";
import { getService } from "@/lib/vessel";

const FLUTTERWAVE_API = "https://api.flutterwave.com/v3";
const MIN_NAIRA = 100;

export type CheckoutCustomer = {
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  landmark?: string;
  notes?: string;
};

export type ReceiptItem = {
  id: string;
  name: string;
  priceNgn: number;
};

export type PaymentPurpose = "service" | "home-collection";

type StoredOrder = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  landmark: string;
  notes: string;
  purpose: PaymentPurpose;
  items: ReceiptItem[];
};

export type CompletedPayment = {
  ok: boolean;
  paid: boolean;
  reference: string;
  amountNgn: number;
  emailSent: boolean;
  message: string;
  order: StoredOrder | null;
};

function flutterwaveSecret() {
  return process.env.FLUTTERWAVE_SECRET_KEY?.trim() || "";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function clean(value: unknown, max = 240) {
  return String(value ?? "").trim().slice(0, max);
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function quoteServices(serviceIds: string[]) {
  const unique = [...new Set(serviceIds.map((id) => id.trim()).filter(Boolean))].slice(0, 20);
  if (unique.length === 0) {
    return { items: [] as ReceiptItem[], error: "Select at least one test." };
  }

  const loaded = await Promise.all(unique.map((id) => getService(id)));
  const items = loaded.flatMap((service) =>
    service
      ? [{ id: service.id, name: service.name, priceNgn: service.priceNgn }]
      : [],
  );

  if (items.length !== unique.length) {
    return {
      items,
      error: "One or more tests could not be priced. Refresh the catalogue and try again.",
    };
  }

  const totalNgn = items.reduce((sum, item) => sum + item.priceNgn, 0);
  if (totalNgn < MIN_NAIRA) {
    return {
      items,
      error: `Online payment starts at ${formatNgn(MIN_NAIRA)}.`,
    };
  }

  return { items, totalNgn, error: null };
}

export async function initializePayment(input: {
  serviceIds: string[];
  customer: CheckoutCustomer;
  purpose: PaymentPurpose;
  callbackUrl: string;
}) {
  const secret = flutterwaveSecret();
  if (!secret) {
    return {
      ok: false as const,
      message: "Online payment is not configured yet. Call the centre to pay.",
    };
  }

  const fullName = clean(input.customer.fullName, 120);
  const email = clean(input.customer.email, 160).toLowerCase();
  const phone = clean(input.customer.phone, 40);
  const address = clean(input.customer.address, 240);
  const landmark = clean(input.customer.landmark, 160);
  const notes = clean(input.customer.notes, 500);

  if (!fullName || !phone || !isEmail(email)) {
    return { ok: false as const, message: "Name, phone, and a valid email are required." };
  }
  if (input.purpose === "home-collection" && !address) {
    return { ok: false as const, message: "A delivery address is required." };
  }

  const quote = await quoteServices(input.serviceIds);
  if (quote.error || quote.totalNgn == null) {
    return { ok: false as const, message: quote.error || "Could not price these tests." };
  }

  const reference = `ST-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const order: StoredOrder = {
    fullName,
    email,
    phone,
    address,
    landmark,
    notes,
    purpose: input.purpose,
    items: quote.items,
  };

  const res = await fetch(`${FLUTTERWAVE_API}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: reference,
      amount: quote.totalNgn,
      currency: "NGN",
      redirect_url: input.callbackUrl,
      customer: {
        email,
        phonenumber: phone,
        name: fullName,
      },
      customizations: {
        title: org.name,
        description:
          input.purpose === "home-collection"
            ? "Home sample kit"
            : "Diagnostic test",
        logo: `${org.website}${org.logoPath}`,
      },
      meta: {
        order: JSON.stringify(order),
      },
    }),
  });

  const body = (await res.json().catch(() => null)) as {
    status?: string;
    message?: string;
    data?: { link?: string };
  } | null;

  if (!res.ok || body?.status !== "success" || !body.data?.link) {
    return {
      ok: false as const,
      message: body?.message || "Could not start payment. Try again.",
    };
  }

  return {
    ok: true as const,
    authorizationUrl: body.data.link,
    reference,
  };
}

function readOrder(metadata: unknown): StoredOrder | null {
  if (!metadata || typeof metadata !== "object") return null;
  const record = metadata as { order?: unknown; meta?: { order?: unknown } };
  const raw = record.order ?? record.meta?.order;
  if (typeof raw !== "string") return null;
  try {
    const parsed = JSON.parse(raw) as StoredOrder;
    if (!parsed || !Array.isArray(parsed.items) || !parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

function receiptHtml(order: StoredOrder, reference: string, amountNgn: number) {
  const rows = order.items
    .map(
      (item) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${escapeHtml(item.name)}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${escapeHtml(formatNgn(item.priceNgn))}</td></tr>`,
    )
    .join("");
  const address = [order.address, order.landmark].filter(Boolean).join(" · ");
  const purpose =
    order.purpose === "home-collection" ? "Home sample kit" : "Diagnostic test";

  return `<div style="font-family:Arial,sans-serif;color:#141218;line-height:1.5">
    <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#0f6e6e">Payment receipt</p>
    <h1 style="margin:0 0 12px;font-size:22px">${escapeHtml(org.name)}</h1>
    <p style="margin:0 0 16px">Reference <strong>${escapeHtml(reference)}</strong></p>
    <p style="margin:0 0 4px"><strong>${escapeHtml(order.fullName)}</strong></p>
    <p style="margin:0 0 4px">${escapeHtml(order.email)} · ${escapeHtml(order.phone)}</p>
    <p style="margin:0 0 16px">${escapeHtml(purpose)}${address ? ` · ${escapeHtml(address)}` : ""}</p>
    ${order.notes ? `<p style="margin:0 0 16px">Notes: ${escapeHtml(order.notes)}</p>` : ""}
    <table style="width:100%;border-collapse:collapse">${rows}
      <tr><td style="padding:12px 0;font-weight:700">Total paid</td><td style="padding:12px 0;text-align:right;font-weight:700">${escapeHtml(formatNgn(amountNgn))}</td></tr>
    </table>
    <p style="margin:16px 0 0;color:#555">${escapeHtml(org.address)}<br>${escapeHtml(org.hours)}</p>
  </div>`;
}

export function verifyFlutterwaveHash(signature: string | null) {
  const secret = process.env.FLUTTERWAVE_SECRET_HASH?.trim() || "";
  if (!secret || !signature) return false;
  const left = Buffer.from(secret);
  const right = Buffer.from(signature);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function completePayment(reference: string): Promise<CompletedPayment> {
  const cleanReference = clean(reference, 100);
  const failed = (message: string, paid = false): CompletedPayment => ({
    ok: false,
    paid,
    reference: cleanReference,
    amountNgn: 0,
    emailSent: false,
    message,
    order: null,
  });

  const secret = flutterwaveSecret();
  if (!secret) return failed("Online payment is not configured yet.");
  if (!cleanReference) return failed("Missing payment reference.");

  const res = await fetch(
    `${FLUTTERWAVE_API}/transactions/verify_by_reference?tx_ref=${encodeURIComponent(cleanReference)}`,
    { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store" },
  );
  const body = (await res.json().catch(() => null)) as {
    status?: string;
    message?: string;
    data?: {
      status?: string;
      amount?: number;
      currency?: string;
      tx_ref?: string;
      meta?: unknown;
      meta_data?: unknown;
    };
  } | null;

  if (!res.ok || body?.status !== "success" || !body.data) {
    return failed(body?.message || "Could not verify this payment.");
  }

  if (body.data.status !== "successful" || body.data.currency !== "NGN") {
    return failed("Payment was not completed.", false);
  }

  const order = readOrder(body.data.meta) ?? readOrder(body.data.meta_data);
  const amountNgn = Math.round(Number(body.data.amount ?? 0));
  const confirmed = body.data.tx_ref || cleanReference;
  const expected = order?.items.reduce((sum, item) => sum + item.priceNgn, 0) ?? amountNgn;
  if (order && amountNgn < expected) {
    return failed("The amount paid does not match the test fees.", true);
  }
  if (!order) {
    return {
      ok: true,
      paid: true,
      reference: confirmed,
      amountNgn,
      emailSent: false,
      message: "Payment was received, but the receipt details were missing.",
      order: null,
    };
  }

  const emailed = await sendEmail({
    to: [order.email, receiptInbox()],
    subject: `Payment receipt ${confirmed}`,
    html: receiptHtml(order, confirmed, amountNgn),
    idempotencyKey: `receipt/${confirmed}`,
  });

  return {
    ok: true,
    paid: true,
    reference: confirmed,
    amountNgn,
    emailSent: emailed.ok,
    message: emailed.ok
      ? "Payment received. A receipt has been emailed."
      : `Payment received. The receipt email could not be sent: ${emailed.message}`,
    order,
  };
}
