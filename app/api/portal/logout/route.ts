import { NextResponse } from "next/server";
import { PATIENT_TOKEN_COOKIE, getPatientToken } from "@/lib/auth";
import { vesselFetch } from "@/lib/vessel";

export async function POST() {
  const token = await getPatientToken();
  if (token) {
    await vesselFetch("/patient-auth/logout", {
      method: "POST",
      token,
    });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(PATIENT_TOKEN_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return res;
}
