import type { MetadataRoute } from "next";
import { listDocs } from "@/lib/docs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://poof.fun";

const STATIC_ROUTES = [
  "/discover/trending",
  "/discover/new",
  "/discover/top",
  "/launch/create",
  "/launch/mine",
  "/portfolio/holdings",
  "/portfolio/rewards",
  "/narrative/nvidia-ceo-cheating",
  "/narrative/elon-musk-favorite-meme",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = listDocs().map((d) => (d.slug === "introduction" ? "/docs" : `/docs/${d.slug}`));
  return [...STATIC_ROUTES, ...docs].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
