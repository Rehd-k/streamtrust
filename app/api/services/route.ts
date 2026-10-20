import { NextResponse } from "next/server";
import { SERVICES_PAGE_SIZE } from "@/lib/catalog";
import { getServices } from "@/lib/vessel";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const skipRaw = Number(url.searchParams.get("skip") ?? "0");
  const takeRaw = Number(url.searchParams.get("take") ?? String(SERVICES_PAGE_SIZE));
  const skip = Number.isFinite(skipRaw) && skipRaw > 0 ? Math.floor(skipRaw) : 0;
  const take =
    Number.isFinite(takeRaw) && takeRaw > 0
      ? Math.min(Math.floor(takeRaw), 50)
      : SERVICES_PAGE_SIZE;
  const search = url.searchParams.get("search") ?? "";
  const categoryId = url.searchParams.get("categoryId") || undefined;

  const result = await getServices({ skip, take, search, categoryId });
  if (result.error) {
    return NextResponse.json(result, { status: 502 });
  }
  return NextResponse.json(result);
}
