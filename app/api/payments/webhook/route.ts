import { NextResponse } from "next/server";
import { completePayment, verifyFlutterwaveHash } from "@/lib/payments";

export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get("verif-hash");
  if (!verifyFlutterwaveHash(signature)) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  let event: { event?: string; data?: { tx_ref?: string; status?: string } };
  try {
    event = JSON.parse(raw) as {
      event?: string;
      data?: { tx_ref?: string; status?: string };
    };
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  if (event.event === "charge.completed" && event.data?.status === "successful" && event.data.tx_ref) {
    await completePayment(event.data.tx_ref);
  }

  return NextResponse.json({ received: true });
}
