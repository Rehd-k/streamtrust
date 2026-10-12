import { getPatientToken } from "@/lib/auth";
import { vesselFetch } from "@/lib/vessel";

export async function requirePatientSession() {
  const token = await getPatientToken();
  return token;
}

export async function patientGet<T>(path: string) {
  const token = await getPatientToken();
  if (!token) {
    return { data: null as T | null, error: { status: 401, message: "Not authenticated" } };
  }
  return vesselFetch<T>(path, { token });
}
