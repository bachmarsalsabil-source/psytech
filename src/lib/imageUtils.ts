/** Resize Unsplash URLs to appropriate widths for faster loading. */
export function optimizeImageUrl(url: string, width = 640): string {
  if (!url.includes('images.unsplash.com')) return url;
  try {
    const parsed = new URL(url);
    parsed.searchParams.set('auto', 'format');
    parsed.searchParams.set('fit', 'crop');
    parsed.searchParams.set('q', '75');
    parsed.searchParams.set('w', String(width));
    return parsed.toString();
  } catch {
    return url;
  }
}

export function avatarUrl(name: string, size = 88): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=D4AF37&color=050403&size=${size}`;
}
