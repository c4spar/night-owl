import { serve } from "./mod.ts";

await serve({
  repository: "c4spar/deno-cliffy",
  directories: {
    benchmarks: "data",
    docs: "docs",
    examples: "examples",
  },
});
