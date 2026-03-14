'use client';

import { useState } from 'react';
import { getProductImageSrc, PRODUCT_PLACEHOLDER_IMAGE } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
}

/** Renders product image with fallback on error or missing URL */
export function ProductImage({ src, alt, className, sizes }: ProductImageProps) {
  const [errored, setErrored] = useState(false);
  const resolved = getProductImageSrc(src);
  const effectiveSrc = errored ? PRODUCT_PLACEHOLDER_IMAGE : resolved;

  return (
    <img
      src={effectiveSrc}
      alt={alt}
      className={cn('object-cover', className)}
      sizes={sizes}
      onError={() => setErrored(true)}
    />
  );
}

export { getProductImageSrc, PRODUCT_PLACEHOLDER_IMAGE };
