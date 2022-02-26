import { serve } from "../mod.ts";

await serve({
  repository: "c4spar/deno-cliffy",
  src: [{ src: "c4spar/cliffy-docs@main:src" }],
  nav: { collapse: true },
});
