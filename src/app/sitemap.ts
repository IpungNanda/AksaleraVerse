
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aksaleraverse.com";

  const routes = [
    "",
    "/informasi",
    "/informasi/beasiswa",
    "/informasi/magang",
    "/informasi/pengumuman",
    "/merchandise",
    "/aduan",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
