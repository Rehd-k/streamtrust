import { NextResponse } from "next/server";
import {
  DEVICE_KEY_COOKIE,
  PATIENT_TOKEN_COOKIE,
  createDeviceKey,
} from "@/lib/auth";
import { vesselFetch } from "@/lib/vessel";

type LoginBody = {
  patientId?: string;
  dateOfBirth?: string;
  deviceKey?: string;
};

type LoginResponse = {
  accessToken?: string;
  token?: string;
  access_token?: string;
  deviceStatus?: string;
  status?: string;
  message?: string;
  [key: string]: unknown;
};

function extractToken(data: LoginResponse | null) {
  if (!data) return null;
  return data.accessToken || data.token || data.access_token || null;
}

export async function POST(request: Request) {
  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const patientId = body.patientId?.trim();
  const dateOfBirth = body.dateOfBirth?.trim();
  if (!patientId || !dateOfBirth) {
    return NextResponse.json(
      { message: "Patient ID and date of birth are required" },
      { status: 400 },
    );
  }

  const deviceKey = body.deviceKey?.trim() || createDeviceKey();

  const { data, error } = await vesselFetch<LoginResponse>("/patient-auth/login", {
    method: "POST",
    body: JSON.stringify({
      patientId,
      dateOfBirth,
      deviceKey,
    }),
  });

  if (error) {
    return NextResponse.json(
      {
        message: error.message,
        devicePending:
          error.status === 403 ||
          /pending|approval|device/i.test(error.message),
      },
      { status: error.status || 502 },
    );
  }

  const token = extractToken(data);
  if (!token) {
    return NextResponse.json(
      {
        message:
          data?.message ||
          "Login succeeded but no token was returned. Contact the centre.",
        raw: data,
      },
      { status: 502 },
    );
  }

  const res = NextResponse.json({
    ok: true,
    deviceStatus: data?.deviceStatus || data?.status || "UNKNOWN",
    profile: data,
  });

  res.cookies.set(PATIENT_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  res.cookies.set(DEVICE_KEY_COOKIE, deviceKey, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return res;
}
