import type { MetadataRoute } from "next";
import { org } from "@/lib/org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/portal/"],
    },
    sitemap: `${org.website}/sitemap.xml`,
  };
}
