"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  formatNgn,
  SERVICES_PAGE_SIZE,
  type CatalogCategory,
  type CatalogTest,
  type ServiceListResult,
} from "@/lib/catalog";

export function ServicesCatalog({
  initial,
  categories,
}: {
  initial: ServiceListResult;
  categories: CatalogCategory[];
}) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [skip, setSkip] = useState(initial.skip);
  const [result, setResult] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initial.error);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const trimmed = query.trim();
      const useInitial =
        attempt === 0 && trimmed === "" && skip === 0 && categoryId === "all";
      if (useInitial) {
        setResult(initial);
        setError(initial.error);
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        skip: String(skip),
        take: String(SERVICES_PAGE_SIZE),
        search: trimmed,
      });
      if (categoryId !== "all") params.set("categoryId", categoryId);

      setLoading(true);
      try {
        const res = await fetch(`/api/services?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = (await res.json()) as ServiceListResult & { message?: string };
        if (!res.ok) {
          setError(data.error || data.message || "Could not load services.");
          setResult({
            services: [],
            total: null,
            skip,
            take: SERVICES_PAGE_SIZE,
            error: data.error || data.message || "Could not load services.",
          });
          return;
        }
        setError(null);
        setResult(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Network error. Please try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [attempt, categoryId, initial, query, skip]);

  const from = result.services.length > 0 ? result.skip + 1 : 0;
  const to = result.skip + result.services.length;
  const hasPrev = result.skip > 0;
  const hasNext =
    result.total != null
      ? result.skip + result.services.length < result.total
      : result.services.length === result.take;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="flex-1">
          <span className="sr-only">Search tests</span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSkip(0);
            }}
            placeholder="Search tests…"
            className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none ring-teal/30 focus:ring-2"
          />
        </label>
        {categories.length > 0 ? (
          <label>
            <span className="sr-only">Category</span>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setSkip(0);
              }}
              className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none ring-teal/30 focus:ring-2 sm:w-56"
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <p className="mt-4 text-sm text-muted">
        {result.services.length === 0
          ? "0 tests"
          : result.total != null
            ? `${from}–${to} of ${result.total} test${result.total === 1 ? "" : "s"}`
            : `${result.services.length} test${result.services.length === 1 ? "" : "s"}`}
        {query.trim() ? ` matching “${query.trim()}”` : ""}
        {loading ? " · Loading…" : ""}
      </p>

      {error ? (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
          <button
            type="button"
            onClick={() => setAttempt((value) => value + 1)}
            className="rounded-md border border-border px-3 py-1.5 text-sm font-semibold text-teal"
          >
            Retry
          </button>
        </div>
      ) : null}

      <ul
        className={`mt-6 divide-y divide-border border-y border-border ${loading ? "opacity-60" : ""}`}
      >
        {result.services.map((test) => (
          <ServiceRow key={test.id} test={test} />
        ))}
      </ul>

      {!error && result.services.length === 0 ? (
        <p className="mt-8 text-muted">No tests match your search.</p>
      ) : null}

      {hasPrev || hasNext ? (
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={!hasPrev || loading}
            onClick={() => setSkip((value) => Math.max(0, value - SERVICES_PAGE_SIZE))}
            className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-teal disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={!hasNext || loading}
            onClick={() => setSkip((value) => value + SERVICES_PAGE_SIZE)}
            className="rounded-md bg-teal px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ServiceRow({ test }: { test: CatalogTest }) {
  return (
    <li>
      <Link
        href={`/services/${test.id}`}
        className="flex flex-col gap-2 py-5 transition-colors hover:bg-surface-soft/50 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0">
          {test.categoryName ? (
            <p className="text-xs font-medium uppercase tracking-wider text-teal-soft">
              {test.categoryName}
            </p>
          ) : null}
          <p className="mt-1 font-medium text-foreground">{test.name}</p>
          {test.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-muted">{test.description}</p>
          ) : null}
          {test.homeCollectionEligible ? (
            <p className="mt-2 text-xs font-medium text-teal">Home kit available</p>
          ) : null}
        </div>
        <div className="shrink-0 text-left sm:text-right">
          <p className="font-semibold text-teal">{formatNgn(test.priceNgn)}</p>
          {test.turnaround ? (
            <p className="mt-1 text-xs text-muted">{test.turnaround}</p>
          ) : null}
        </div>
      </Link>
    </li>
  );
}
