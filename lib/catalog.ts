export const SERVICES_PAGE_SIZE = 10;

export type CatalogCategory = {
  id: string;
  name: string;
  description: string;
};

export type CatalogTest = {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  slug: string;
  description: string;
  priceNgn: number;
  turnaround: string;
  preparation: string;
  homeCollectionEligible: boolean;
};

export type ServiceListResult = {
  services: CatalogTest[];
  total: number | null;
  skip: number;
  take: number;
  error: string | null;
};

const LIST_KEYS = [
  "data",
  "items",
  "results",
  "services",
  "rows",
  "records",
  "content",
] as const;

const PRICE_KEYS = [
  "cost",
  "price",
  "priceNgn",
  "amount",
  "fee",
  "sellingPrice",
  "serviceCost",
  "unitPrice",
] as const;

const HOME_KEYS = [
  "homeCollectionEligible",
  "homeCollection",
  "allowHomeCollection",
  "isHomeCollection",
  "homeService",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function asBool(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === 1 || value === "1") return true;
  if (value === "false" || value === 0 || value === "0") return false;
  return null;
}

function readTotal(obj: Record<string, unknown>): number | null {
  for (const key of ["total", "count", "totalCount", "totalItems"]) {
    const total = asNumber(obj[key]);
    if (total != null) return total;
  }
  if (isRecord(obj.meta)) return readTotal(obj.meta);
  if (isRecord(obj.pagination)) return readTotal(obj.pagination);
  return null;
}

export function formatNgn(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function mapService(raw: Record<string, unknown>): CatalogTest | null {
  if (raw.statusCode != null || raw.error != null) return null;

  const category = isRecord(raw.category)
    ? raw.category
    : isRecord(raw.serviceCategory)
      ? raw.serviceCategory
      : null;
  const id = asText(raw.id ?? raw.serviceId ?? raw.uuid);
  const name = asText(raw.name ?? raw.serviceName ?? raw.title);
  if (!id && !name) return null;

  let price: number | null = null;
  for (const key of PRICE_KEYS) {
    price = asNumber(raw[key]);
    if (price != null) break;
  }

  let home: boolean | null = null;
  for (const key of HOME_KEYS) {
    home = asBool(raw[key]);
    if (home != null) break;
  }

  const categoryId = asText(raw.categoryId ?? category?.id);
  const categoryName = asText(
    category?.name ?? raw.categoryName ?? raw.filterCategory,
  );
  const stableId = id || name;

  return {
    id: stableId,
    categoryId,
    categoryName,
    name: name || "Service",
    slug: stableId,
    description: asText(raw.description ?? raw.details ?? raw.summary),
    priceNgn: price ?? 0,
    turnaround: asText(raw.turnaround ?? raw.turnaroundTime ?? raw.duration),
    preparation: asText(
      raw.preparation ?? raw.preparationNote ?? raw.instructions,
    ),
    homeCollectionEligible: home ?? false,
  };
}

function mapList(list: unknown[]): CatalogTest[] {
  return list.flatMap((item) => {
    const service = isRecord(item) ? mapService(item) : null;
    return service ? [service] : [];
  });
}

export function parseServiceList(payload: unknown): {
  services: CatalogTest[];
  total: number | null;
} {
  if (Array.isArray(payload)) {
    return { services: mapList(payload), total: null };
  }
  if (!isRecord(payload)) return { services: [], total: null };
  if (payload.statusCode != null) return { services: [], total: null };

  const total = readTotal(payload);
  for (const key of LIST_KEYS) {
    if (Array.isArray(payload[key])) {
      return { services: mapList(payload[key] as unknown[]), total };
    }
  }

  if (isRecord(payload.data)) {
    const nested = parseServiceList(payload.data);
    return { services: nested.services, total: nested.total ?? total };
  }

  const single = mapService(payload);
  if (single) return { services: [single], total: total ?? 1 };
  return { services: [], total };
}

export function parseService(payload: unknown): CatalogTest | null {
  if (!isRecord(payload)) return null;
  if (isRecord(payload.data) && !Array.isArray(payload.data)) {
    const nested = mapService(payload.data);
    if (nested) return nested;
  }
  return mapService(payload);
}

export function parseCategories(payload: unknown): CatalogCategory[] {
  if (Array.isArray(payload)) {
    return payload.flatMap((item) => {
      if (!isRecord(item)) return [];
      const name = asText(item.name ?? item.title ?? item.category);
      const id = asText(item.id ?? item.categoryId) || name;
      if (!id && !name) return [];
      return [
        {
          id,
          name: name || id,
          description: asText(item.description),
        },
      ];
    });
  }
  if (!isRecord(payload) || payload.statusCode != null) return [];
  for (const key of LIST_KEYS) {
    if (Array.isArray(payload[key])) return parseCategories(payload[key]);
  }
  if (isRecord(payload.data)) return parseCategories(payload.data);
  return [];
}

export function canRequestHomeKit(test: CatalogTest) {
  if (test.homeCollectionEligible) return true;
  return /lab|blood|haemat|hemat|chem|pathol|micro/.test(
    test.categoryName.toLowerCase(),
  );
}

export function servicesForHomeCollection(services: CatalogTest[]) {
  const flagged = services.filter((service) => service.homeCollectionEligible);
  if (flagged.length > 0) return flagged;
  const lab = services.filter((service) => canRequestHomeKit(service));
  if (lab.length > 0) return lab;
  return services;
}
