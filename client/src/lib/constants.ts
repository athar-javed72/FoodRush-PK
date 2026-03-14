/** Fallback image when product has no image or URL fails to load */
export const PRODUCT_PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';

export function getProductImageSrc(image?: string | null): string {
  if (image && typeof image === 'string' && image.startsWith('http')) return image;
  return PRODUCT_PLACEHOLDER_IMAGE;
}
