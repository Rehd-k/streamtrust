"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

function getOrCreateDeviceKey() {
  if (typeof window === "undefined") return "";
  const key = "st_device_key_client";
  let existing = localStorage.getItem(key);
  if (!existing) {
    existing =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `dev-${Date.now()}`;
    localStorage.setItem(key, existing);
  }
  return existing;
}

export function PortalLoginForm() {
  const router = useRouter();
  const [patientId, setPatientId] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingHint, setPendingHint] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPendingHint(false);
    startTransition(async () => {
      try {
        const res = await fetch("/api/portal/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId,
            dateOfBirth,
            deviceKey: getOrCreateDeviceKey(),
          }),
        });
        const data = (await res.json()) as {
          message?: string;
          devicePending?: boolean;
          ok?: boolean;
        };
        if (!res.ok) {
          setError(data.message || "Login failed");
          setPendingHint(Boolean(data.devicePending));
          return;
        }
        router.push("/portal");
        router.refresh();
      } catch {
        setError("Network error. Check your connection and try again.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Patient ID</span>
        <input
          required
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="As issued by the centre"
          className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-teal/30 focus:ring-2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Date of birth</span>
        <input
          required
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-teal/30 focus:ring-2"
        />
      </label>

      {error ? (
        <div
          className="rounded-md border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-800"
          role="alert"
        >
          <p>{error}</p>
          {pendingHint ? (
            <p className="mt-2 text-red-700">
              First-time devices often need front-desk approval. Visit or call
              StreamTrust with your Patient ID, then try again.
            </p>
          ) : null}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-teal py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-sm text-muted">
        Not registered yet?{" "}
        <Link href="/contact" className="font-medium text-teal hover:underline">
          Contact the centre
        </Link>
      </p>
    </form>
  );
}
