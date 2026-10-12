import type { MetadataRoute } from "next";
import { healthTopics } from "@/lib/health-topics";
import { tests } from "@/lib/mock-catalog";
import { org } from "@/lib/org";

const lastModified = new Date("2026-10-03");

export default function sitemap(): MetadataRoute.Sitemap {
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
    ...tests.map((test) => ({
      url: `${org.website}/services/${test.slug}`,
      lastModified,
    })),
    ...healthTopics.map((topic) => ({
      url: `${org.website}/health/${topic.slug}`,
      lastModified,
    })),
  ];
}
