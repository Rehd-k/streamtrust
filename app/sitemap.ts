import type { MetadataRoute } from "next";
import { healthTopics } from "@/lib/health-topics";
import { org } from "@/lib/org";
import { getAllServices } from "@/lib/vessel";

const lastModified = new Date("2026-10-03");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { services } = await getAllServices();
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/gallery",
    "/health",
    "/services",
    "/home-collection",
    "/book",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: path ? `${org.website}${path}` : org.website,
      lastModified,
    })),
    ...services.map((test) => ({
      url: `${org.website}/services/${test.id}`,
      lastModified,
    })),
    ...healthTopics.map((topic) => ({
      url: `${org.website}/health/${topic.slug}`,
      lastModified,
    })),
  ];
}
