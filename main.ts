import { serve } from "./mod.ts";

await serve({
  repository: "denoland/manual",
  rev: "main",
  selectedExample: "dotted_options.ts",
  moduleSelection: false,
  directories: {
    benchmarks: "c4spar/cliffy-benchmarks@main:data",
    docs: "denoland/manual@main:/",
    examples: "c4spar/deno-cliffy@main:/examples/flags",
  },
});
