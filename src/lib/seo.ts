export const INDEXABLE_ROUTES = ["/", "/calculator", "/privacy"] as const;

const configuredSiteUrl =
  import.meta.env["VITE_SITE_URL"]?.trim() || "https://spidy-calculator.vercel.app";

function getConfiguredSiteOrigin(): string | undefined {
  if (!configuredSiteUrl) return undefined;

  const siteUrl = new URL(configuredSiteUrl);
  if (
    (siteUrl.protocol !== "https:" && siteUrl.protocol !== "http:") ||
    siteUrl.pathname !== "/" ||
    siteUrl.search ||
    siteUrl.hash ||
    siteUrl.username ||
    siteUrl.password
  ) {
    throw new Error(
      "VITE_SITE_URL must be an HTTP(S) origin without a path, query, or credentials.",
    );
  }

  return siteUrl.origin;
}

export function getCanonicalUrl(path: (typeof INDEXABLE_ROUTES)[number] | "/terms"): string {
  const origin = getConfiguredSiteOrigin();
  return origin ? new URL(path, `${origin}/`).href : path;
}

export function getAbsoluteSiteUrl(
  path: (typeof INDEXABLE_ROUTES)[number] | "/terms",
): string | undefined {
  const origin = getConfiguredSiteOrigin();
  return origin ? new URL(path, `${origin}/`).href : undefined;
}

export function getSiteOrigin(requestUrl: string): string {
  return getConfiguredSiteOrigin() ?? new URL(requestUrl).origin;
}

export function createRobotsTxt(origin: string): string {
  const siteOrigin = new URL(origin).origin;
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`;
}

export function createSitemapXml(origin: string): string {
  const siteOrigin = new URL(origin).origin;
  const urls = INDEXABLE_ROUTES.map(
    (path) => `  <url><loc>${new URL(path, `${siteOrigin}/`).href}</loc></url>`,
  );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}
