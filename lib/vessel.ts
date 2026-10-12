/**
 * Vessel / Helty Hospital API client.
 *
 * Catalog: USE_MOCK_CATALOG=true (default) reads lib/mock-catalog.ts.
 * When Vessel exposes a public catalog, set USE_MOCK_CATALOG=false and
 * implement getCategories/getTests against e.g. GET /public/lab/tests.
 *
 * Patient portal uses real endpoints under /patient-auth and /patient.
 */

import {
  categories as mockCategories,
  tests as mockTests,
  getTestById as mockGetTestById,
  getTestBySlug as mockGetTestBySlug,
  searchTests as mockSearchTests,
  type CatalogCategory,
  type CatalogTest,
} from "./mock-catalog";

export type { CatalogCategory, CatalogTest };

export function getApiBaseUrl() {
  return (
    process.env.API_BASE_URL?.replace(/\/$/, "") ||
    "http://ou8sq568lehodo2oeqp6gzl8.89.116.38.252.sslip.io"
  );
}

export function useMockCatalog() {
  return process.env.USE_MOCK_CATALOG !== "false";
}

export async function getCategories(): Promise<CatalogCategory[]> {
  if (useMockCatalog()) return mockCategories;
  // Future: GET `${getApiBaseUrl()}/public/lab/categories`
  return mockCategories;
}

export async function getTests(query?: string): Promise<CatalogTest[]> {
  if (useMockCatalog()) {
    return query ? mockSearchTests(query) : mockTests;
  }
  // Future: GET `${getApiBaseUrl()}/public/lab/tests?q=...`
  return query ? mockSearchTests(query) : mockTests;
}

export async function getTest(idOrSlug: string): Promise<CatalogTest | undefined> {
  if (useMockCatalog()) {
    return mockGetTestById(idOrSlug) ?? mockGetTestBySlug(idOrSlug);
  }
  // Future: GET `${getApiBaseUrl()}/public/lab/tests/${idOrSlug}`
  return mockGetTestById(idOrSlug) ?? mockGetTestBySlug(idOrSlug);
}

export type VesselError = {
  status: number;
  message: string;
  body?: unknown;
};

export async function vesselFetch<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<{ data: T | null; error: VesselError | null }> {
  const { token, headers: initHeaders, ...rest } = options;
  const headers = new Headers(initHeaders);
  if (!headers.has("Content-Type") && rest.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      ...rest,
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      let body: unknown;
      try {
        body = await res.json();
      } catch {
        body = await res.text().catch(() => undefined);
      }
      const message =
        typeof body === "object" &&
        body &&
        "message" in body &&
        typeof (body as { message: unknown }).message === "string"
          ? (body as { message: string }).message
          : res.statusText || "Request failed";
      return {
        data: null,
        error: { status: res.status, message, body },
      };
    }

    if (res.status === 204) {
      return { data: null as T, error: null };
    }

    const data = (await res.json()) as T;
    return { data, error: null };
  } catch (e) {
    return {
      data: null,
      error: {
        status: 0,
        message: e instanceof Error ? e.message : "Network error",
      },
    };
  }
}
