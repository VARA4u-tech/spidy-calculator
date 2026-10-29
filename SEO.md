# SEO implementation checklist

## Implemented

- [x] Server-rendered, crawlable landing page remains available to first-time visitors; visiting `/` no longer redirects them to Terms.
- [x] Calculator access still requires explicit Terms acceptance. `/terms` is marked `noindex, follow` and is not included in the sitemap.
- [x] Unique titles, descriptions, Open Graph metadata, and canonical links are defined for the home, calculator, privacy, and Terms routes.
- [x] The landing page explains real calculator operations, scientific mode, keyboard input, and local history, with user-visible FAQs and internal links to the app.
- [x] `WebSite` structured data is provided on the home page and `WebApplication` data on the calculator page. FAQ content is visible, but `FAQPage` markup is omitted: Google limits FAQ rich-result eligibility to authoritative government and health sites, so it is not an appropriate search feature to promise for this calculator.
- [x] `/robots.txt` and `/sitemap.xml` are served by the application. The sitemap contains only the home, calculator, and privacy URLs.
- [x] Canonical URLs, structured-data URLs, robots, and sitemap use `https://spidy-calculator.vercel.app` by default. Set `VITE_SITE_URL` to a verified future canonical origin if the production domain changes; preview request hosts are never emitted into indexing metadata.
- [x] The production client entry was reduced from 645 KB (216 KB gzip) to 369 KB (117 KB gzip) by loading GSAP scroll animations asynchronously and using Framer Motion's lazy feature bundle. The production build no longer reports a client chunk over 500 KB.
- [x] Automated tests cover sitemap membership and robots sitemap discovery.

## Before deploying

- [ ] If the canonical domain changes, set `VITE_SITE_URL` in the production build environment to the new canonical public origin (origin only: no path, query, credentials, or route). Rebuild and verify canonical tags, sitemap, and robots all use that same host.
- [ ] Confirm the deployment serves `/`, `/calculator`, `/privacy`, `/terms`, `/robots.txt`, and `/sitemap.xml` over HTTPS. Verify that only the chosen hostname/protocol is used as canonical; configure any HTTP, `www`, or preview-host redirects at the hosting layer only when those alternate hosts exist.
- [ ] Inspect the deployed sitemap and robots file. Submit `https://<canonical-host>/sitemap.xml` in Google Search Console and the equivalent sitemap interface for other search engines.
- [ ] Verify ownership in Google Search Console. A DNS TXT record is preferred for a domain property; an HTML verification file or meta tag can be used for a URL-prefix property if DNS access is unavailable. Verification and sitemap submission are external actions and are not performed by this repository.
- [ ] Use Search Console URL Inspection and the live URL test for the home and calculator pages. Review indexing/crawl reports and Core Web Vitals after real field data becomes available.

## Ongoing content and measurement

- [ ] Review Search Console queries and landing-page data monthly. Compare impressions, clicks, CTR, average position, and mobile/desktop Core Web Vitals; improve titles and descriptions where impressions are high but CTR is weak.
- [ ] Relevant intent to evaluate includes free online calculator, online math calculator, scientific calculator online, calculator without download, percentage calculator, and degree/radian trigonometry calculator. These are opportunities, not verified search-volume claims.
- [ ] Add supporting guides only when they answer a distinct user need with accurate examples (for example, percentage calculations or degree-versus-radian input). Link guides to the calculator and avoid generating near-duplicate keyword pages.
- [ ] Keep FAQ answers, privacy statements, feature lists, and structured data aligned with the actual application behavior.

No ownership verification, indexing, traffic, ranking, or Core Web Vitals outcome is claimed by this implementation.
