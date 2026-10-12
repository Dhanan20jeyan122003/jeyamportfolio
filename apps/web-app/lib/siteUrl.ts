/**
 * Returns the canonical base URL of the website.
 * Priority:
 * 1. NEXT_PUBLIC_SITE_URL (custom domain set in Vercel or .env)
 * 2. VERCEL_PROJECT_PRODUCTION_URL (Vercel system production domain)
 * 3. VERCEL_URL (Vercel deployment domain)
 * 4. Fallback to default production URL
 */
export function getSiteUrl(): string {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    'https://dhananjeyanportfolio-ai.vercel.app';

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  return url.replace(/\/$/, '');
}
