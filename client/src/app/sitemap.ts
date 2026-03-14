import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://foodrush.pk';
const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/menu`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/cart`, lastModified: new Date(), changeFrequency: 'always', priority: 0.7 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 }
  ];

  let productUrls: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${apiBase}/products?limit=500`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const items = data?.data?.items || data?.data?.products || [];
    productUrls = items.map((p: { _id: string; updatedAt?: string }) => ({
      url: `${baseUrl}/products/${p._id}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }));
  } catch {
    // ignore fetch errors (e.g. API down during build)
  }

  return [...staticRoutes, ...productUrls];
}
