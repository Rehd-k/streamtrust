"use client";

import { useState, useTransition, type FormEvent } from "react";
import { formatNgn, type CatalogTest } from "@/lib/catalog";

export function CheckoutForm({ items }: { items: CatalogTest[] }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const total = items.reduce((sum, item) => sum + item.priceNgn, 0);

  function pay(event: FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/payments/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceIds: items.map((item) => item.id),
            purpose: "service",
            customer: { fullName, email, phone },
          }),
        });
        const data = (await res.json()) as {
          authorizationUrl?: string;
          message?: string;
        };
        if (!res.ok || !data.authorizationUrl) {
          setError(data.message || "Could not start payment.");
          return;
        }
        window.location.href = data.authorizationUrl;
      } catch {
        setError("Network error. Please try again.");
      }
    });
  }

  return (
    <form className="mx-auto grid max-w-xl gap-4" onSubmit={pay}>
      <ul className="divide-y divide-border border-y border-border">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between gap-4 py-3 text-sm">
            <span>{item.name}</span>
            <span className="font-medium">{formatNgn(item.priceNgn)}</span>
          </li>
        ))}
        <li className="flex justify-between py-3 font-semibold">
          <span>Total</span>
          <span>{formatNgn(total)}</span>
        </li>
      </ul>

      {(
        [
          ["fullName", "Full name", fullName, setFullName, "text"],
          ["email", "Email for the receipt", email, setEmail, "email"],
          ["phone", "Phone", phone, setPhone, "tel"],
        ] as const
      ).map(([key, label, value, setValue, type]) => (
        <label key={key} className="block">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <input
            required
            type={type}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-teal/30 focus:ring-2"
          />
        </label>
      ))}

      <p className="text-xs text-muted">
        You will pay on Flutterwave. A receipt is emailed to you and to the centre
        after the payment is confirmed.
      </p>
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-teal-deep disabled:opacity-50"
      >
        {pending ? "Opening payment…" : `Pay ${formatNgn(total)}`}
      </button>
    </form>
  );
}
