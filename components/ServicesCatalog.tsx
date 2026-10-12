"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  categories,
  formatNgn,
  getCategoryById,
  searchTests,
  type CatalogTest,
} from "@/lib/mock-catalog";

export function ServicesCatalog({ initialTests }: { initialTests: CatalogTest[] }) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string>("all");

  const filtered = useMemo(() => {
    let list = query ? searchTests(query) : initialTests;
    if (categoryId !== "all") {
      list = list.filter((t) => t.categoryId === categoryId);
    }
    return list;
  }, [query, categoryId, initialTests]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="flex-1">
          <span className="sr-only">Search tests</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tests…"
            className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none ring-teal/30 focus:ring-2"
          />
        </label>
        <label>
          <span className="sr-only">Category</span>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none ring-teal/30 focus:ring-2 sm:w-56"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-4 text-sm text-muted">
        {filtered.length} test{filtered.length === 1 ? "" : "s"}
        {query ? ` matching “${query}”` : ""}
      </p>

      <ul className="mt-6 divide-y divide-border border-y border-border">
        {filtered.map((test) => {
          const cat = getCategoryById(test.categoryId);
          return (
            <li key={test.id}>
              <Link
                href={`/services/${test.slug}`}
                className="flex flex-col gap-2 py-5 transition-colors hover:bg-surface-soft/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-teal-soft">
                    {cat?.name}
                  </p>
                  <p className="mt-1 font-medium text-foreground">{test.name}</p>
                  <p className="mt-1 text-sm text-muted line-clamp-2">
                    {test.description}
                  </p>
                  {test.homeCollectionEligible ? (
                    <p className="mt-2 text-xs font-medium text-teal">
                      Home kit available
                    </p>
                  ) : null}
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <p className="font-semibold text-teal">{formatNgn(test.priceNgn)}</p>
                  <p className="mt-1 text-xs text-muted">{test.turnaround}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 ? (
        <p className="mt-8 text-muted">No tests match your search.</p>
      ) : null}
    </div>
  );
}
