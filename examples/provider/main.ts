import { serve } from "../../mod.ts";
import { FooProvider } from "./pages/foo.tsx";
import { BarProvider } from "./pages/bar.tsx";

await serve({
  repository: "c4spar/deno-cliffy",
  src: "examples/provider/pages",
  providers: [
    { component: FooProvider, props: { bar: "123" } },
    { component: BarProvider, props: { boop: "123" } },
  ],
});
