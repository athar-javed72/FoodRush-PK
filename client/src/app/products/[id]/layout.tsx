import type { Metadata } from 'next';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${apiBase}/products/${id}`, { next: { revalidate: 60 } });
    const data = await res.json();
    const product = data?.data?.product;
    if (!product) return { title: 'Product' };
    return {
      title: product.name,
      description: product.description?.slice(0, 160) || `Order ${product.name} – Rs. ${product.price}`,
      openGraph: {
        title: product.name,
        description: product.description?.slice(0, 160),
        images: product.image ? [product.image] : []
      }
    };
  } catch {
    return { title: 'Product' };
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
