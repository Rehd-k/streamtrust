import { NextResponse } from "next/server";
import { getPatientToken } from "@/lib/auth";
import { vesselFetch } from "@/lib/vessel";

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxy(request: Request, context: RouteContext) {
  const token = await getPatientToken();
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { path } = await context.params;
  const suffix = path.join("/");
  const url = new URL(request.url);
  const qs = url.search;

  // Map /api/portal/proxy/... → Vessel /patient/... or /patient-auth/...
  let vesselPath: string;
  if (suffix.startsWith("auth/")) {
    vesselPath = `/patient-auth/${suffix.slice(5)}${qs}`;
  } else {
    vesselPath = `/patient/${suffix}${qs}`;
  }

  const init: RequestInit & { token?: string } = {
    method: request.method,
    token,
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      init.body = await request.text();
      init.headers = { "Content-Type": "application/json" };
    } else if (contentType) {
      init.body = await request.arrayBuffer();
      init.headers = { "Content-Type": contentType };
    }
  }

  const { data, error } = await vesselFetch<unknown>(vesselPath, init);

  if (error) {
    return NextResponse.json(
      { message: error.message, body: error.body },
      { status: error.status || 502 },
    );
  }

  return NextResponse.json(data ?? {});
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
