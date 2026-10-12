"use client";

import { useState, useTransition } from "react";

type Props = {
  initial: Record<string, unknown>;
};

function str(v: unknown) {
  return typeof v === "string" ? v : typeof v === "number" ? String(v) : "";
}

export function ProfileForm({ initial }: Props) {
  const [phone, setPhone] = useState(
    str(initial.phone || initial.phoneNumber || initial.mobile),
  );
  const [email, setEmail] = useState(str(initial.email));
  const [address, setAddress] = useState(
    str(initial.address || initial.homeAddress),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/portal/proxy/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, email, address }),
        });
        const data = (await res.json()) as { message?: string };
        if (!res.ok) {
          setError(data.message || "Could not update profile");
          return;
        }
        setMessage("Profile updated.");
      } catch {
        setError("Network error.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Phone</span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-teal/30 focus:ring-2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-teal/30 focus:ring-2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Address</span>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-teal/30 focus:ring-2"
        />
      </label>
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className="text-sm text-teal">{message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-teal px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
