import { createFileRoute } from "@tanstack/react-router";

import { createRobotsTxt, getSiteOrigin } from "@/lib/seo";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }) =>
        new Response(createRobotsTxt(getSiteOrigin(request.url)), {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        }),
    },
  },
});
