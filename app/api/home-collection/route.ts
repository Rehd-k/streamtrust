import { NextResponse } from "next/server";

type Body = {
  tests?: { id: string; name: string; priceNgn: number }[];
  contact?: {
    fullName?: string;
    phone?: string;
    email?: string;
    address?: string;
    landmark?: string;
    notes?: string;
  };
  totalNgn?: number;
};

/**
 * Stub home-collection intake.
 * When Vessel exposes a public endpoint, forward this payload there instead of
 * returning a local requestId.
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid JSON body" },
      { status: 400 },
    );
  }

  if (!body.tests?.length) {
    return NextResponse.json(
      { ok: false, message: "Select at least one test" },
      { status: 400 },
    );
  }

  const { fullName, phone, address } = body.contact ?? {};
  if (!fullName?.trim() || !phone?.trim() || !address?.trim()) {
    return NextResponse.json(
      { ok: false, message: "Name, phone, and address are required" },
      { status: 400 },
    );
  }

  const requestId = `HK-${Date.now().toString(36).toUpperCase()}`;

  // Future:
  // await vesselFetch('/public/home-collection-requests', { method: 'POST', body: JSON.stringify(body) })

  console.info("[home-collection stub]", {
    requestId,
    tests: body.tests.map((t) => t.id),
    totalNgn: body.totalNgn,
    contact: { fullName, phone, email: body.contact?.email },
  });

  return NextResponse.json({
    ok: true,
    requestId,
    message:
      "Request accepted (stub). Lab staff will be notified when the public API is connected.",
  });
}
