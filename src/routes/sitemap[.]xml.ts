import { createFileRoute } from "@tanstack/react-router";

import { createSitemapXml, getSiteOrigin } from "@/lib/seo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) =>
        new Response(createSitemapXml(getSiteOrigin(request.url)), {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        }),
    },
  },
});
