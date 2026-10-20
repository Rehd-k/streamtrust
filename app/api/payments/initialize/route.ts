import { NextResponse } from "next/server";
import { initializePayment, type PaymentPurpose } from "@/lib/payments";

type Body = {
  serviceIds?: string[];
  purpose?: PaymentPurpose;
  customer?: {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    landmark?: string;
    notes?: string;
  };
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const purpose = body.purpose === "home-collection" ? "home-collection" : "service";
  const origin = new URL(request.url).origin;
  const result = await initializePayment({
    serviceIds: body.serviceIds ?? [],
    purpose,
    customer: {
      fullName: body.customer?.fullName ?? "",
      email: body.customer?.email ?? "",
      phone: body.customer?.phone ?? "",
      address: body.customer?.address,
      landmark: body.customer?.landmark,
      notes: body.customer?.notes,
    },
    callbackUrl: `${origin}/pay/callback`,
  });

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  return NextResponse.json({
    authorizationUrl: result.authorizationUrl,
    reference: result.reference,
  });
}
