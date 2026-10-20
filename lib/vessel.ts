/**
 * Vessel / Helty Hospital API client.
 *
 * Services and prices: GET /services?skip=&take=&search=
 * Optional API_TOKEN is sent as a bearer token when the catalogue requires one.
 *
 * Patient portal uses real endpoints under /patient-auth and /patient.
 */

import {
  parseCategories,
  parseService,
  parseServiceList,
  SERVICES_PAGE_SIZE,
  type CatalogCategory,
  type CatalogTest,
  type ServiceListResult,
} from "./catalog";

export type { CatalogCategory, CatalogTest, ServiceListResult };

export function getApiBaseUrl() {
  return (
    process.env.API_BASE_URL?.replace(/\/$/, "") ||
    "http://ou8sq568lehodo2oeqp6gzl8.89.116.38.252.sslip.io"
  );
}

function catalogToken() {
  return process.env.API_TOKEN?.trim() || null;
}

function servicesQuery(query: {
  skip?: number;
  take?: number;
  search?: string;
  categoryId?: string;
}) {
  const params = new URLSearchParams({
    skip: String(query.skip ?? 0),
    take: String(query.take ?? SERVICES_PAGE_SIZE),
    search: query.search ?? "",
  });
  if (query.categoryId) {
    const uuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuid.test(query.categoryId)) params.set("categoryId", query.categoryId);
    else params.set("filterCategory", query.categoryId);
  }
  return `/services?${params.toString()}`;
}

function catalogueError(status: number, message: string) {
  console.warn("[services]", status, message);
  if (status === 401 || status === 403) {
    return "The price list is unavailable right now.";
  }
  return message || "Could not load services.";
}

export async function getServiceCategories(): Promise<CatalogCategory[]> {
  const { data, error } = await vesselFetch<unknown>("/service-categories", {
    token: catalogToken(),
  });
  if (error || data == null) {
    if (error) console.warn("[services] categories", error.status, error.message);
    return [];
  }
  return parseCategories(data);
}

export async function getServices(query?: {
  skip?: number;
  take?: number;
  search?: string;
  categoryId?: string;
}): Promise<ServiceListResult> {
  const skip = Math.max(0, Math.floor(query?.skip ?? 0));
  const take = Math.min(
    100,
    Math.max(1, Math.floor(query?.take ?? SERVICES_PAGE_SIZE)),
  );
  const search = query?.search?.trim() ?? "";
  const { data, error } = await vesselFetch<unknown>(
    servicesQuery({
      skip,
      take,
      search,
      categoryId: query?.categoryId,
    }),
    { token: catalogToken() },
  );

  if (error) {
    return {
      services: [],
      total: null,
      skip,
      take,
      error: catalogueError(error.status, error.message),
    };
  }

  const parsed = parseServiceList(data);
  return {
    services: parsed.services,
    total: parsed.total,
    skip,
    take,
    error: null,
  };
}

export async function getAllServices(search = ""): Promise<{
  services: CatalogTest[];
  error: string | null;
}> {
  const pageSize = 50;
  const services: CatalogTest[] = [];
  let skip = 0;
  let error: string | null = null;

  for (let page = 0; page < 40; page += 1) {
    const result = await getServices({ skip, take: pageSize, search });
    if (result.error) {
      error = result.error;
      break;
    }
    services.push(...result.services);
    if (result.services.length < pageSize) break;
    if (result.total != null && services.length >= result.total) break;
    skip += result.services.length || pageSize;
  }

  return { services, error: services.length > 0 ? null : error };
}

export async function getService(id: string): Promise<CatalogTest | null> {
  const { data, error } = await vesselFetch<unknown>(
    `/services/${encodeURIComponent(id)}`,
    { token: catalogToken() },
  );
  if (error || data == null) return null;
  return parseService(data);
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
