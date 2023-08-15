import { serve } from "../mod.ts";

serve({
  repository: "c4spar/deno-cliffy",
  src: [{ src: "c4spar/cliffy-manual@main:/" }],
  nav: { collapse: true },
});
