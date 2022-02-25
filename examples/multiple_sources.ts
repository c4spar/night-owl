import { serve } from "../mod.ts";

await serve({
  src: [
    {
      src: "c4spar/cliffy-docs@main:src",
      prefix: "/cliffy",
      label: "Cliffy",
    },
    {
      src: "denoland/manual@main:/",
      prefix: "/deno",
      label: "Deno",
    },
  ],
  pages: true,
  nav: { collapse: true },
});
