import { cookies } from "next/headers";

export const PATIENT_TOKEN_COOKIE = "st_patient_token";
export const DEVICE_KEY_COOKIE = "st_device_key";

export async function getPatientToken() {
  const jar = await cookies();
  return jar.get(PATIENT_TOKEN_COOKIE)?.value ?? null;
}

export async function getDeviceKey() {
  const jar = await cookies();
  return jar.get(DEVICE_KEY_COOKIE)?.value ?? null;
}

export function createDeviceKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
