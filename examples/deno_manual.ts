import { serve } from "../mod.ts";

await serve({
  src: "denoland/manual@main:/",
  nav: {
    collapse: true,
  },
});
