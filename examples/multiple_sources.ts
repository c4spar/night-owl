import { serve } from "../mod.ts";

await serve({
  src: [
    {
      src: "denoland/manual@main:/",
      prefix: "/deno",
      label: "Deno",
    },
    {
      src: "c4spar/cliffy-docs@main:src",
      prefix: "/cliffy",
      label: "Cliffy",
    },
  ],
  pages: true,
  nav: {
    collapse: true,
    items: [{
      label: "Deno",
      href: "/deno/introduction",
    }],
  },
});
