import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

export const PUBLIC_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
} as const;

/**
 * Wraps a read-only database query with Next.js Data Cache and tag invalidation.
 */
export function cachedPublicQuery<T>(
  keyParts: string[],
  tag: string,
  fetcher: () => Promise<T>,
  revalidate = 60
): Promise<T> {
  return unstable_cache(fetcher, keyParts, {
    tags: [tag],
    revalidate,
  })();
}

/**
 * Returns a JSON response with public CDN/browser caching headers.
 */
export function publicJsonResponse(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: PUBLIC_CACHE_HEADERS,
  });
}
