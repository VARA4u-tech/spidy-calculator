import { describe, expect, it } from "vitest";

import { createRobotsTxt, createSitemapXml, getCanonicalUrl, getSiteOrigin } from "./seo";

describe("SEO discovery files", () => {
  it("points crawlers to the sitemap at the public origin", () => {
    expect(createRobotsTxt("https://calculator.example/")).toBe(
      "User-agent: *\nAllow: /\n\nSitemap: https://calculator.example/sitemap.xml\n",
    );
  });

  it("lists only canonical, indexable pages in the sitemap", () => {
    const sitemap = createSitemapXml("https://calculator.example");

    expect(sitemap).toContain("<loc>https://calculator.example/</loc>");
    expect(sitemap).toContain("<loc>https://calculator.example/calculator</loc>");
    expect(sitemap).toContain("<loc>https://calculator.example/privacy</loc>");
    expect(sitemap).not.toContain("/terms");
    expect(sitemap.match(/<url>/g)).toHaveLength(3);
  });

  it("uses the production domain rather than a request or preview host", () => {
    expect(getSiteOrigin("https://preview.example")).toBe("https://spidy-calculator.vercel.app");
    expect(getCanonicalUrl("/calculator")).toBe("https://spidy-calculator.vercel.app/calculator");
  });
});
