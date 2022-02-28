import { serve } from "../mod.ts";

await serve({
  repository: "c4spar/deno-cliffy",
  src: [{ src: "c4spar/cliffy-manual@main:/" }],
  nav: { collapse: true },
});
