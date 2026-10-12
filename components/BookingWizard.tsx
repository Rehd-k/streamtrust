"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";

type Specialty = { id?: string; name?: string; specialty?: string; [k: string]: unknown };
type Doctor = { id?: string; name?: string; fullName?: string; [k: string]: unknown };
type Slot = {
  id?: string;
  start?: string;
  end?: string;
  time?: string;
  startTime?: string;
  available?: boolean;
  [k: string]: unknown;
};

function asList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of ["data", "items", "results", "specialties", "doctors", "slots", "availability"]) {
      if (Array.isArray(obj[key])) return obj[key] as T[];
    }
  }
  return [];
}

function labelSpecialty(s: Specialty) {
  return String(s.name || s.specialty || s.id || "Specialty");
}

function labelDoctor(d: Doctor) {
  return String(d.fullName || d.name || d.id || "Doctor");
}

function labelSlot(s: Slot) {
  return String(s.time || s.startTime || s.start || s.id || "Slot");
}

export function BookingWizard({ authenticated }: { authenticated: boolean }) {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [specialtyId, setSpecialtyId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [slotId, setSlotId] = useState("");
  const [reason, setReason] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const minDate = useMemo(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/portal/proxy/appointments/specialties");
        const data = await res.json();
        if (!res.ok) {
          if (!cancelled) {
            setLoadError(
              data.message ||
                "Could not load specialties. Your device may need front-desk approval.",
            );
          }
          return;
        }
        if (!cancelled) setSpecialties(asList<Specialty>(data));
      } catch {
        if (!cancelled) setLoadError("Network error loading specialties.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated || !specialtyId) {
      setDoctors([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await fetch(
        `/api/portal/proxy/appointments/doctors?specialtyId=${encodeURIComponent(specialtyId)}`,
      );
      const data = await res.json();
      if (!cancelled) {
        if (res.ok) setDoctors(asList<Doctor>(data));
        else setDoctors([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authenticated, specialtyId]);

  useEffect(() => {
    if (!authenticated || !doctorId || !date) {
      setSlots([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const qs = new URLSearchParams({
        doctorId,
        date,
      });
      const res = await fetch(
        `/api/portal/proxy/appointments/availability?${qs.toString()}`,
      );
      const data = await res.json();
      if (!cancelled) {
        if (res.ok) setSlots(asList<Slot>(data));
        else setSlots([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authenticated, doctorId, date]);

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-lg rounded-sm border border-border bg-surface p-8 text-center">
        <h2 className="font-display text-2xl text-teal-deep">Sign in to book</h2>
        <p className="mt-3 text-muted">
          Appointment booking uses your patient portal account. New devices may
          need approval at the front desk.
        </p>
        <Link
          href="/portal/login"
          className="mt-6 inline-flex rounded-md bg-teal px-5 py-3 text-sm font-semibold text-white"
        >
          Go to patient login
        </Link>
        <p className="mt-4 text-sm text-muted">
          Prefer a phone booking?{" "}
          <Link href="/contact" className="text-teal hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg rounded-sm border border-border bg-surface p-8 text-center">
        <h2 className="font-display text-2xl text-teal-deep">Request submitted</h2>
        <p className="mt-3 text-muted">
          We received your appointment request. You can track it in the portal.
        </p>
        <Link
          href="/portal/appointments"
          className="mt-6 inline-flex rounded-md bg-teal px-5 py-3 text-sm font-semibold text-white"
        >
          View appointments
        </Link>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/portal/proxy/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            specialtyId: specialtyId || undefined,
            doctorId: doctorId || undefined,
            date: date || undefined,
            slotId: slotId || undefined,
            preferredDate: date || undefined,
            reason: reason || undefined,
            notes: reason || undefined,
          }),
        });
        const data = (await res.json()) as { message?: string };
        if (!res.ok) {
          setSubmitError(
            data.message ||
              "Could not create appointment. Confirm your device is approved.",
          );
          return;
        }
        setSuccess(true);
      } catch {
        setSubmitError("Network error.");
      }
    });
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-xl space-y-5">
      {loadError ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900">
          {loadError}
        </p>
      ) : null}

      <label className="block">
        <span className="text-sm font-medium">Specialty</span>
        <select
          required
          value={specialtyId}
          onChange={(e) => {
            setSpecialtyId(e.target.value);
            setDoctorId("");
            setSlotId("");
          }}
          className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-teal/30 focus:ring-2"
        >
          <option value="">Select specialty</option>
          {specialties.map((s, i) => {
            const id = String(s.id ?? i);
            return (
              <option key={id} value={id}>
                {labelSpecialty(s)}
              </option>
            );
          })}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium">Doctor (optional)</span>
        <select
          value={doctorId}
          onChange={(e) => {
            setDoctorId(e.target.value);
            setSlotId("");
          }}
          className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-teal/30 focus:ring-2"
        >
          <option value="">Any available</option>
          {doctors.map((d, i) => {
            const id = String(d.id ?? i);
            return (
              <option key={id} value={id}>
                {labelDoctor(d)}
              </option>
            );
          })}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium">Preferred date</span>
        <input
          required
          type="date"
          min={minDate}
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setSlotId("");
          }}
          className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-teal/30 focus:ring-2"
        />
      </label>

      {slots.length > 0 ? (
        <fieldset>
          <legend className="text-sm font-medium">Available slots</legend>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {slots.map((s, i) => {
              const id = String(s.id ?? labelSlot(s) ?? i);
              const disabled = s.available === false;
              return (
                <label
                  key={id}
                  className={`cursor-pointer rounded-md border px-3 py-2 text-center text-sm ${
                    slotId === id
                      ? "border-teal bg-surface-soft font-semibold text-teal"
                      : "border-border"
                  } ${disabled ? "opacity-40" : ""}`}
                >
                  <input
                    type="radio"
                    name="slot"
                    className="sr-only"
                    disabled={disabled}
                    checked={slotId === id}
                    onChange={() => setSlotId(id)}
                  />
                  {labelSlot(s)}
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : date && doctorId ? (
        <p className="text-sm text-muted">
          No published slots for this doctor/date — you can still submit a
          request and the centre will assign a time.
        </p>
      ) : null}

      <label className="block">
        <span className="text-sm font-medium">Reason / notes</span>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="e.g. Routine check, ultrasound, doctor referral"
          className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-teal/30 focus:ring-2"
        />
      </label>

      {submitError ? (
        <p className="text-sm text-red-700" role="alert">
          {submitError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-accent py-3 text-sm font-semibold text-teal-deep disabled:opacity-50"
      >
        {pending ? "Submitting…" : "Request appointment"}
      </button>
    </form>
  );
}
