import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://foodrush.pk';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/driver/', '/checkout', '/orders', '/profile', '/addresses']
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
