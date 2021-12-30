import { serve } from "./mod.ts";

await serve({
  repository: "c4spar/deno-cliffy",
  rev: "main",
  src: "src/pages",
  pages: true,
  // @TODO: if pagesDropdown is enabled show only items from active page, hide all other pages!
  pagesDropdown: true,
  nav: {
    collapse: true,
    items: [{
      label: "API",
      href: "https://doc.deno.land/https://deno.land/x/cliffy/mod.ts",
    }],
  },
});
