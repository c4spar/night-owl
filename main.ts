import { serve } from "./mod.ts";

await serve({
  repository: "c4spar/deno-cliffy",
  rev: "main",
  selectedExample: "command.ts",
  directories: {
    benchmarks: "../deno-cliffy/docs/data",
    docs: "../deno-cliffy/docs/pages",
    examples: "../deno-cliffy/docs/examples",
  },
});
