import React, { memo, useState } from 'react';
import { optimizeImageUrl } from '../../lib/imageUtils';

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string;
  alt: string;
  width?: number;
  priority?: boolean;
  objectFit?: 'cover' | 'contain';
}

export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  width = 640,
  priority = false,
  objectFit = 'cover',
  className = '',
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const optimizedSrc = optimizeImageUrl(src, width);

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      referrerPolicy="no-referrer"
      onLoad={() => setLoaded(true)}
      className={`${objectFit === 'cover' ? 'object-cover' : 'object-contain'} transition-opacity duration-500 ${
        loaded ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      {...props}
    />
  );
});
